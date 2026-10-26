<?php

// app/Http/Controllers/Api/EventDiscoveryController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Http\Traits\ApiResponse;
use App\Models\Event;
use Illuminate\Http\Request;

class EventDiscoveryController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Event::query()
            ->where('status', 'published')
            ->whereDate('event_date', '>=', now()->toDateString())
            ->with('school');

        if ($request->filled('category')) {
            $category = $request->category;
            $query->where(function ($q) use ($category) {
                $q->where('category', $category)
                  ->orWhereJsonContains('categories', $category);
            });
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->date_to);
        }

        if ($request->filled('max_booth_price')) {
            $query->where('booth_price', '<=', $request->max_booth_price);
        }

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhereHas('school', function ($sq) use ($search) {
                      $sq->where('school_name', 'like', "%{$search}%");
                  });
            });
        }

        /*
        * Homepage:
        * GET /events?limit=3
        */
        if ($request->filled('limit')) {
            $limit = min((int) $request->limit, 12);

            $events = $query
                ->orderBy('event_date', 'asc')
                ->limit($limit)
                ->get();

            return $this->success(
                'Event terdekat.',
                EventResource::collection($events)
            );
        }

        /*
        * Event Discovery:
        * GET /events
        */
        $events = $query
            ->orderBy('event_date', 'asc')
            ->paginate(12);

        return $this->success(
            'Daftar event.',
            EventResource::collection($events)->response()->getData(true)
        );
    }

    public function show(string $slug)
    {
        $event = Event::where('slug', $slug)->where('status', 'published')->with('school')->firstOrFail();
        return $this->success('Detail event.', new EventResource($event));
    }
}
