<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Migrations\Migration;

Schema::table('event_applications', function ($table) {
    $table->dropColumn('match_reason_ai');
});
echo "Done\n";
