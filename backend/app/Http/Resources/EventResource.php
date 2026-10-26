<?php

// app/Http/Resources/EventResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
    'id' => $this->id,
    'name' => $this->name,
    'slug' => $this->slug,
    'description' => $this->description,

    'category' => $this->category,

    'categories' => $this->categories ?: [
        $this->category
    ],

    'event_date' => $this->event_date->format('Y-m-d'),

    'location' => $this->location,

    'target_audience' => $this->target_audience,

    'target_visitors' => $this->target_visitors,

    'booth_capacity' => $this->booth_capacity,

    'booth_price' => $this->booth_price,

    'status' => $this->status,

    'school' => [
        'id' => $this->school->id,
        'name' => $this->school->school_name,
    ],

    'created_at' => $this->created_at,
];
    }
}
