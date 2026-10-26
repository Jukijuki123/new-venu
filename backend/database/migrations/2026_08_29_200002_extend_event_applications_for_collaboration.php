<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_applications', function (Blueprint $table) {
            $table->enum('initiated_by', ['school', 'umkm'])->default('umkm')->after('umkm_id');
            $table->text('message')->nullable()->after('match_reason');
            $table->unsignedBigInteger('proposed_price')->nullable()->after('message');
            $table->text('notes')->nullable()->after('proposed_price');
        });

        // Ubah enum status agar support flow lengkap.
        // MySQL: modify enum. SQLite: tidak support enum, biarkan string check di aplikasi.
        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            // Drop dan recreate dengan nilai baru — MySQL spesifik via raw
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE event_applications MODIFY COLUMN status ENUM('pending','reviewing','negotiating','approved','rejected','cancelled','completed') NOT NULL DEFAULT 'pending'");
        }
    }

    public function down(): void
    {
        Schema::table('event_applications', function (Blueprint $table) {
            $table->dropColumn(['initiated_by', 'message', 'proposed_price', 'notes']);
        });
        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE event_applications MODIFY COLUMN status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'");
        }
    }
};
