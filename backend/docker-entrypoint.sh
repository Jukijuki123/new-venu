#!/bin/sh
set -e

# Wait for MySQL database if configured
if [ "$DB_CONNECTION" = "mysql" ] && [ -n "$DB_HOST" ]; then
    echo "Waiting for database connection at $DB_HOST:${DB_PORT:-3306}..."
    while ! nc -z "$DB_HOST" "${DB_PORT:-3306}"; do
        sleep 1
    done
    echo "Database is ready!"
fi

# Ensure storage directories and permissions
mkdir -p /var/www/storage/framework/sessions \
         /var/www/storage/framework/views \
         /var/www/storage/framework/cache \
         /var/www/storage/logs \
         /var/www/bootstrap/cache

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# Create storage symlink
php artisan storage:link --force || true

# Run database migrations safely (does not wipe/reset existing data)
echo "Running database migrations..."
php artisan migrate --force

# Smart Auto-Seed: Jika database baru (tabel user kosong), otomatis isi data seeder
USER_COUNT=$(php artisan tinker --execute="echo \App\Models\User::count();" 2>/dev/null || echo "0")
if [ "$USER_COUNT" = "0" ]; then
    echo "Fresh database detected (0 users). Running database seeder..."
    php artisan db:seed --force || true
else
    echo "Database already initialized ($USER_COUNT users found). Skipping seeder."
fi

# Production optimizations
if [ "$APP_ENV" = "production" ]; then
    echo "Optimizing configurations for production..."
    php artisan config:cache || true
    php artisan route:cache || true
    php artisan view:cache || true
fi

echo "Starting VENU Backend Supervisor..."
exec /usr/bin/supervisord -c /etc/supervisord.conf
