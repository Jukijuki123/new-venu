<?php

namespace App\Http\Controllers\Api\School;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Event;
use App\Models\EventApplication;
use App\Models\UmkmProfile;
use App\Services\AiMatchService;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    use ApiResponse;

    public function __construct(private AiMatchService $matchService) {}

    public function index(Request $request, Event $event)
    {
        $this->authorize('manageApplications', $event);

        // Ambil AI reason yang sudah ada di DB
        $aiReasons = EventApplication::where('event_id', $event->id)
            ->whereNotNull('match_reason_ai')
            ->pluck('match_reason_ai', 'umkm_id');

        $umkms = UmkmProfile::query()
            ->when($request->filled('category'), fn($q) => $q->where('category', $request->category))
            ->when($request->filled('location'), fn($q) => $q->where('location', 'like', "%{$request->location}%"))
            ->get();

        $appliedUmkmIds = EventApplication::where('event_id', $event->id)
            ->pluck('status', 'umkm_id');

        $matches = $umkms->map(function ($umkm) use ($event, $appliedUmkmIds, $aiReasons) {
            $result = $this->matchService->score($event, $umkm);

            return [
                'umkm_id'          => $umkm->id,
                'business_name'    => $umkm->business_name,
                'description'      => $umkm->description,
                'category'         => $umkm->category,
                'location'         => $umkm->location,
                'logo'             => $umkm->logo,
                'price_min'        => $umkm->price_min,
                'price_max'        => $umkm->price_max,
                'booth_budget_max' => $umkm->booth_budget_max,
                'target_audience'  => $umkm->target_audience,
                'match_score'      => $result['score'],
                'match_reason'     => $result['reasons'],
                'match_reason_ai'  => $aiReasons[$umkm->id] ?? null,
                'application_status' => $appliedUmkmIds[$umkm->id] ?? null,
            ];
        })->sortByDesc('match_score')->values();

        if ($request->filled('min_score')) {
            $matches = $matches->filter(fn($m) => $m['match_score'] >= (int) $request->min_score)->values();
        }

        if ($request->filled('limit')) {
            $matches = $matches->take(min((int) $request->limit, 100))->values();
        }

        return $this->success('Rekomendasi UMKM untuk event ini.', $matches);
    }
}
