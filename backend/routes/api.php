<?php

// routes/api.php
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CollaborationController;
use App\Http\Controllers\Api\EventDiscoveryController;
use App\Http\Controllers\Api\School\AnalyticsController;
use App\Http\Controllers\Api\School\EventController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\School\ProfileController as SchoolProfileController;
use App\Http\Controllers\Api\Umkm\ApplicationController;
use App\Http\Controllers\Api\Umkm\ProfileController as UmkmProfileController;
use App\Http\Controllers\Api\School\ApplicationController as SchoolApplicationController;
use App\Http\Controllers\Api\School\MatchController as SchoolMatchController;
use App\Http\Controllers\Api\Umkm\MatchController as UmkmMatchController;
use App\Http\Controllers\Api\UmkmDiscoveryController;

Route::prefix('v1')->group(function () {
    // Public — session/CSRF untuk SPA ditangani EnsureFrontendRequestsAreStateful
    // Rate limiting untuk mencegah brute-force pada autentikasi
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('auth/register', [AuthController::class, 'register']);
        Route::post('auth/login', [AuthController::class, 'login']);
    });

    // Public discovery — tidak butuh auth
    Route::get('events', [EventDiscoveryController::class, 'index']);
    Route::get('events/{slug}', [EventDiscoveryController::class, 'show']);
    Route::get('umkms', [UmkmDiscoveryController::class, 'index']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        Route::middleware('role:school')->prefix('school')->group(function () {
            Route::get('profile', [SchoolProfileController::class, 'show']);
            Route::put('profile', [SchoolProfileController::class, 'update']);

            Route::apiResource('events', EventController::class)->except(['destroy'])->parameters(['events' => 'event']);
            Route::delete('events/{event}', [EventController::class, 'destroy']);
            Route::post('events/{event}/publish', [EventController::class, 'publish']);

            Route::get('events/{event}/applications', [SchoolApplicationController::class, 'index']);
            Route::patch('applications/{application}/approve', [SchoolApplicationController::class, 'approve']);
            Route::patch('applications/{application}/reject', [SchoolApplicationController::class, 'reject']);

            Route::get('events/{event}/matches', [SchoolMatchController::class, 'index']);
            Route::get('events/{event}/analytics', [AnalyticsController::class, 'show']);

            // School-initiated collaborations (invite UMKM)
            Route::post('collaborations', [CollaborationController::class, 'storeSchool']);
        });

        Route::middleware('role:umkm')->prefix('umkm')->group(function () {
            Route::get('profile', [UmkmProfileController::class, 'show']);
            Route::put('profile', [UmkmProfileController::class, 'update']);

            Route::get('applications', [ApplicationController::class, 'index']);
            Route::get('applications/{application}', [ApplicationController::class, 'show']);

            Route::get('matches', [UmkmMatchController::class, 'index']);
        });

        Route::middleware('role:umkm')->group(function () {
            Route::post('events/{event}/applications', [ApplicationController::class, 'store']);
        });

        // Collaboration — both roles, auth check di controller
        Route::get('collaborations', [CollaborationController::class, 'index']);
        Route::get('collaborations/{application}', [CollaborationController::class, 'show']);
        Route::patch('collaborations/{application}', [CollaborationController::class, 'update']);
        Route::post('collaborations/{application}/accept', [CollaborationController::class, 'accept']);
        Route::post('collaborations/{application}/reject', [CollaborationController::class, 'reject']);
        Route::post('collaborations/{application}/negotiate', [CollaborationController::class, 'negotiate']);
        Route::post('collaborations/{application}/cancel', [CollaborationController::class, 'cancel']);
    });
});
