<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // umkm_profiles.products string 255 -> text
        // SQLite tidak support modify via Schema::table change(), lakukan via raw untuk kompatibilitas
        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            Schema::table('umkm_profiles', function (Blueprint $table) {
                $table->text('products')->nullable()->change();
            });
        } else {
            // SQLite: recreate via raw — tambahkan kolom baru tidak perlu, cukup biarkan string
            // tidak melakukan perubahan tipe di sqlite agar tidak rusak
        }

        // Indexes untuk performa matching
        Schema::table('events', function (Blueprint $table) {
            $table->index('status');
            $table->index('category');
            $table->index('location');
            $table->index('event_date');
        });

        Schema::table('umkm_profiles', function (Blueprint $table) {
            $table->index('category');
            $table->index('location');
        });

        Schema::table('event_applications', function (Blueprint $table) {
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['category']);
            $table->dropIndex(['location']);
            $table->dropIndex(['event_date']);
        });
        Schema::table('umkm_profiles', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropIndex(['location']);
        });
        Schema::table('event_applications', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
    }
};
