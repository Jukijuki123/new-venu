<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'name',
        'slug',
        'description',
        'category',
        'categories',
        'event_date',
        'location',
        'target_audience',
        'target_visitors',
        'booth_capacity',
        'booth_price',
        'status',
    ];

    protected $casts = [
        'event_date' => 'date',
        'categories' => 'array',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(EventApplication::class);
    }

    public function booths(): HasMany
    {
        return $this->hasMany(Booth::class);
    }
}
