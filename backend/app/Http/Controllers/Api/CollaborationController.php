<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ApplicationRuleException;
use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Event;
use App\Models\EventApplication;
use App\Services\AiMatchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class CollaborationController extends Controller
{
    use ApiResponse;

    public function __construct(private AiMatchService $aiMatch) {}

    
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'school') {
            if (!$user->school) return $this->error('Profil sekolah belum dilengkapi.', [], 422);
            $eventIds = $user->school->events()->pluck('id');
            $apps = EventApplication::whereIn('event_id', $eventIds)
                ->with(['event', 'umkm', 'booth'])
                ->latest()
                ->get();
        } else {
            if (!$user->umkmProfile) return $this->error('Profil UMKM belum dilengkapi.', [], 422);
            $umkmId = $user->umkmProfile->id;
            $apps = EventApplication::where('umkm_id', $umkmId)
                ->with(['event', 'umkm', 'booth'])
                ->latest()
                ->get();
        }

        return $this->success('Daftar kolaborasi.', $apps);
    }

    public function show(Request $request, EventApplication $application)
    {
        $this->authorizeCollaboration($request->user(), $application);
        return $this->success('Detail kolaborasi.', $application->load(['event', 'umkm', 'booth']));
    }

    /**
     * School invites an UMKM to an event.
     * POST /api/v1/school/collaborations  {event_id, umkm_id, message?, proposed_price?}
     */
    public function storeSchool(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'umkm_id'  => 'required|exists:umkm_profiles,id',
            'message'  => 'nullable|string|max:2000',
            'proposed_price' => 'nullable|integer|min:0',
        ]);

        $event = Event::findOrFail($validated['event_id']);
        $this->authorize('manageApplications', $event);

        if ($event->status !== 'published') {
            return $this->error('Event belum dipublish.', [], 409);
        }

        $exists = EventApplication::where('event_id', $event->id)
            ->where('umkm_id', $validated['umkm_id'])
            ->exists();
        if ($exists) {
            return $this->error('UMKM sudah memiliki aplikasi/kolaborasi untuk event ini.', [], 409);
        }

        $umkm = \App\Models\UmkmProfile::findOrFail($validated['umkm_id']);
        $match = $this->aiMatch->score($event, $umkm);

        // match_reason_ai hanya diisi jika fitur LLM diaktifkan (opsional, berbayar API)
        $matchReasonAi = null;
        if (Config::get('ai_match.llm_enabled', false)) {
            $matchReasonAi = $this->generateAiReason($event, $umkm);
        }

        $app = EventApplication::create([
            'event_id' => $event->id,
            'umkm_id' => $umkm->id,
            'initiated_by' => 'school',
            'status' => 'pending',
            'match_score' => $match['score'],
            'match_reason' => $match['reasons'],
            'match_reason_ai' => $matchReasonAi,
            'message' => $validated['message'] ?? null,
            'proposed_price' => $validated['proposed_price'] ?? null,
            'applied_at' => now(),
        ]);

        return $this->success('Proposal kolaborasi terkirim ke UMKM.', $app, 201);
    }

    public function update(Request $request, EventApplication $application)
    {
        $this->authorizeCollaboration($request->user(), $application);

        if (!in_array($application->status, ['pending', 'reviewing', 'negotiating'], true)) {
            return $this->error('Kolaborasi sudah final, tidak dapat diubah.', [], 409);
        }

        $validated = $request->validate([
            'message' => 'nullable|string|max:2000',
            'proposed_price' => 'nullable|integer|min:0',
            'notes' => 'nullable|string|max:2000',
        ]);

        $application->update($validated);

        return $this->success('Kolaborasi diperbarui.', $application->fresh()->load(['event', 'umkm']));
    }

    public function accept(Request $request, EventApplication $application)
    {
        $this->authorizeCollaboration($request->user(), $application);
        return $this->transition($application, 'approved', $request->user());
    }

    public function reject(Request $request, EventApplication $application)
    {
        $this->authorizeCollaboration($request->user(), $application);
        return $this->transition($application, 'rejected', $request->user());
    }

    public function negotiate(Request $request, EventApplication $application)
    {
        $this->authorizeCollaboration($request->user(), $application);

        if (!in_array($application->status, ['pending', 'reviewing', 'negotiating'], true)) {
            return $this->error('Hanya kolaborasi pending/reviewing/negotiating yang bisa dinegosiasi.', [], 409);
        }

        $validated = $request->validate([
            'message' => 'nullable|string|max:2000',
            'proposed_price' => 'nullable|integer|min:0',
            'notes' => 'nullable|string|max:2000',
        ]);

        $application->update(array_merge($validated, ['status' => 'negotiating']));

        return $this->success('Status kolaborasi diubah menjadi negotiating.', $application->fresh());
    }

    public function cancel(Request $request, EventApplication $application)
    {
        $this->authorizeCollaboration($request->user(), $application);

        if (in_array($application->status, ['approved', 'completed', 'cancelled'], true)) {
            return $this->error('Kolaborasi tidak dapat dibatalkan pada status ini.', [], 409);
        }

        $application->update(['status' => 'cancelled', 'reviewed_at' => now()]);

        return $this->success('Kolaborasi dibatalkan.', $application->fresh());
    }

    private function authorizeCollaboration($user, EventApplication $application): void
    {
        if ($user->role === 'school') {
            if (!$user->school || $application->event->school_id !== $user->school->id) {
                abort(response()->json(['success' => false, 'message' => 'Akses ditolak.', 'errors' => []], 403));
            }
        } else {
            if (!$user->umkmProfile || $application->umkm_id !== $user->umkmProfile->id) {
                abort(response()->json(['success' => false, 'message' => 'Akses ditolak.', 'errors' => []], 403));
            }
        }
    }

    private function transition(EventApplication $application, string $target, $user)
    {
        if (!in_array($application->status, ['pending', 'reviewing', 'negotiating'], true)) {
            return $this->error('Kolaborasi sudah final.', [], 409);
        }

        if ($target === 'approved') {
            $event = $application->event;
            $approvedCount = EventApplication::where('event_id', $event->id)
                ->where('status', 'approved')->count();
            if ($approvedCount >= $event->booth_capacity) {
                return $this->error('Kuota booth event sudah penuh.', [], 409);
            }

            return DB::transaction(function () use ($application, $event) {
                $application->update(['status' => 'approved', 'reviewed_at' => now()]);
                \App\Models\Booth::create([
                    'event_id' => $event->id,
                    'application_id' => $application->id,
                    'booth_number' => $this->generateBoothNumber($event->id),
                    'status' => 'occupied',
                ]);
                return $this->success('Kolaborasi disetujui.', $application->fresh()->load('booth'));
            });
        }

        // rejected
        $application->update(['status' => 'rejected', 'reviewed_at' => now()]);
        return $this->success('Kolaborasi ditolak.', $application->fresh());
    }

    private function generateBoothNumber(int $eventId): string
    {
        $count = \App\Models\Booth::where('event_id', $eventId)->count();
        return 'A' . str_pad($count + 1, 2, '0', STR_PAD_LEFT);
    }

    /**
     * Generate alasan kecocokan melalui LLM (opsional).
     * Implementasi aktual akan dipasang saat AI_MATCH_LLM_ENABLED=true.
     */
    private function generateAiReason(\App\Models\Event $event, \App\Models\UmkmProfile $umkm): ?string
    {
        // Placeholder untuk integrasi Gemini LLM di masa depan.
        return null;
    }
}
