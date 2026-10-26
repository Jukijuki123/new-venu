<?php

// app/Http/Controllers/Api/School/EventController.php
namespace App\Http\Controllers\Api\School;

use App\Http\Controllers\Controller;
use App\Http\Requests\School\{StoreEventRequest, UpdateEventRequest};
use App\Http\Resources\EventResource;
use App\Http\Traits\ApiResponse;
use App\Models\Event;
use App\Services\EventService;

class EventController extends Controller
{
    use ApiResponse;

    public function __construct(private EventService $eventService) {}

    public function index()
    {
        $events = auth()->user()->school->events()->latest()->get();
        return $this->success('Daftar event.', EventResource::collection($events));
    }

    public function store(StoreEventRequest $request)
    {
        $event = $this->eventService->create(auth()->user()->school, $request->validated());
        return $this->success('Event berhasil dibuat.', new EventResource($event), 201);
    }

    public function show(Event $event)
    {
        $this->authorize('update', $event); // reuse: kalau bisa update, boleh lihat detail management-nya
        return $this->success('Detail event.', new EventResource($event));
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $this->authorize('update', $event);
        $event = $this->eventService->update($event, $request->validated());
        return $this->success('Event berhasil diperbarui.', new EventResource($event));
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event); // policy sudah cek status draft
        $event->delete();
        return $this->success('Event berhasil dihapus.');
    }

    public function publish(Event $event)
    {
        $this->authorize('publish', $event);
        $event = $this->eventService->publish($event);
        return $this->success('Event berhasil dipublikasikan.', new EventResource($event));
    }
}
