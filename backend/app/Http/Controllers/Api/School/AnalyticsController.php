<?php

// app/Http/Controllers/Api/School/AnalyticsController.php
namespace App\Http\Controllers\Api\School;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Event;
use App\Services\AnalyticsService;

class AnalyticsController extends Controller
{
    use ApiResponse;

    public function __construct(private AnalyticsService $analyticsService) {}

    public function show(Event $event)
    {
        $this->authorize('manageApplications', $event); // ownership check, reuse policy yang sama

        $data = $this->analyticsService->forEvent($event);

        return $this->success('Analytics event.', $data);
    }
}
