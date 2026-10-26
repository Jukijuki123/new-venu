<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booth extends Model
{
    protected $fillable = ['event_id', 'application_id', 'booth_number', 'status'];

    public function event(): BelongsTo { return $this->belongsTo(Event::class); }
    public function application(): BelongsTo { return $this->belongsTo(EventApplication::class); }
}
