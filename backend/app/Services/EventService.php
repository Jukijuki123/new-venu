<?php

namespace App\Services;

use App\Models\{Event, School};
use Illuminate\Support\Str;

class EventService
{
    public function create(School $school, array $data): Event
    {
        $data['slug'] = $this->generateUniqueSlug($data['name']);
        $data['status'] = 'draft';

        if (!empty($data['categories'])) {
            $data['category'] = $data['categories'][0];
        } elseif (!empty($data['category'])) {
            $data['categories'] = [$data['category']];
        }

        return $school->events()->create($data);
    }

    public function update(Event $event, array $data): Event
    {
        if (
            isset($data['name']) &&
            $data['name'] !== $event->name
        ) {
            $data['slug'] = $this->generateUniqueSlug(
                $data['name']
            );
        }

        if (!empty($data['categories'])) {
            $data['category'] = $data['categories'][0];
        } elseif (!empty($data['category'])) {
            $data['categories'] = [$data['category']];
        }

        $event->update($data);

        return $event->fresh();
    }

    public function publish(Event $event): Event
    {
        $event->update(['status' => 'published']);
        return $event;
    }

    private function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $i = 1;

        while (Event::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }
}
