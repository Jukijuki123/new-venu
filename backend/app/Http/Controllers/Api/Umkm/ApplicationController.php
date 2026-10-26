<?php

// app/Http/Controllers/Api/Umkm/ApplicationController.php
namespace App\Http\Controllers\Api\Umkm;

use App\Exceptions\ApplicationRuleException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Umkm\StoreApplicationRequest;
use App\Http\Traits\ApiResponse;
use App\Models\Event;
use App\Models\EventApplication;
use App\Services\ApplicationService;

class ApplicationController extends Controller
{
    use ApiResponse;

    public function __construct(private ApplicationService $applicationService) {}

    public function index()
    {
        $applications = auth()->user()->umkmProfile
            ->applications()
            ->with('event', 'booth')
            ->latest()
            ->get();

        return $this->success('Daftar aplikasi.', $applications);
    }

    public function show(EventApplication $application)
    {
        if ($application->umkm_id !== auth()->user()->umkmProfile->id) {
            return $this->error('Akses ditolak.', [], 403);
        }

        return $this->success('Detail aplikasi.', $application->load('event', 'booth'));
    }

    // sesudah
    public function store(Event $event, \Illuminate\Http\Request $request)
    {
        $request->validate([
            'message' => 'nullable|string|max:2000',
            'proposed_price' => 'nullable|integer|min:0',
        ]);
        try {
            $application = $this->applicationService->apply(
                auth()->user()->umkmProfile,
                $event->id,
                $request->input('message'),
                $request->input('proposed_price') !== null ? (int) $request->input('proposed_price') : null
            );
        } catch (ApplicationRuleException $e) {
            return $this->error($e->getMessage(), [], 409);
        }

        return $this->success('Pendaftaran berhasil, menunggu review sekolah.', $application, 201);
    }
}
