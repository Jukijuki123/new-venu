<?php

// app/Http/Controllers/Api/School/ApplicationController.php
namespace App\Http\Controllers\Api\School;

use App\Exceptions\ApplicationRuleException;
use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\{Event, EventApplication};
use App\Services\ApplicationService;

class ApplicationController extends Controller
{
    use ApiResponse;

    public function __construct(private ApplicationService $applicationService) {}

    public function index(Event $event)
    {
        $this->authorize('manageApplications', $event);

        $applications = $event->applications()->with('umkm', 'booth')->latest()->get();
        return $this->success('Daftar aplikasi.', $applications);
    }

    public function approve(EventApplication $application)
    {
        $this->authorize('manageApplications', $application->event);

        try {
            $application = $this->applicationService->approve($application);
        } catch (ApplicationRuleException $e) {
            return $this->error($e->getMessage(), [], 409);
        }

        return $this->success('Aplikasi disetujui, booth ditetapkan.', $application);
    }

    public function reject(EventApplication $application)
    {
        $this->authorize('manageApplications', $application->event);

        try {
            $application = $this->applicationService->reject($application);
        } catch (ApplicationRuleException $e) {
            return $this->error($e->getMessage(), [], 409);
        }

        return $this->success('Aplikasi ditolak.', $application);
    }
}
