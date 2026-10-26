<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EventApplication extends Model
{
    protected $fillable = ['event_id', 'umkm_id', 'initiated_by', 'status', 'match_score', 'match_reason', 'message', 'proposed_price', 'notes', 'applied_at', 'reviewed_at'];
    protected $casts = ['match_reason' => 'array', 'applied_at' => 'datetime', 'reviewed_at' => 'datetime'];

    public function event(): BelongsTo { return $this->belongsTo(Event::class); }
    public function umkm(): BelongsTo { return $this->belongsTo(UmkmProfile::class, 'umkm_id'); }
    public function booth(): HasOne { return $this->hasOne(Booth::class, 'application_id'); }
}
