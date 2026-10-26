<?php

// app/Services/ApplicationService.php
namespace App\Services;

use App\Exceptions\ApplicationRuleException;
use App\Models\{Booth, Event, EventApplication, UmkmProfile};
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class ApplicationService
{

    public function __construct(private EventMatchService $matchService) {}

    public function apply(UmkmProfile $umkm, int $eventId, ?string $message = null, ?int $proposedPrice = null): EventApplication
    {
        $event = Event::findOrFail($eventId);

        if ($event->status !== 'published') {
            throw new ApplicationRuleException('Event ini belum atau tidak lagi menerima pendaftaran.');
        }

        $exists = EventApplication::where('event_id', $event->id)
            ->where('umkm_id', $umkm->id)
            ->exists();

        if ($exists) {
            throw new ApplicationRuleException('Kamu sudah mendaftar pada event ini.');
        }

        $approvedCount = EventApplication::where('event_id', $event->id)
            ->where('status', 'approved')
            ->count();

        if ($approvedCount >= $event->booth_capacity) {
            throw new ApplicationRuleException('Kuota tenant untuk event ini sudah penuh.');
        }

        $matchResult = $this->matchService->score($event, $umkm);

        // match_reason_ai hanya diisi jika fitur LLM diaktifkan (opsional, berbayar API)
        $matchReasonAi = null;
        if (Config::get('ai_match.llm_enabled', false)) {
            $matchReasonAi = $this->generateAiReason($event, $umkm);
        }

        return EventApplication::create([
            'event_id' => $event->id,
            'umkm_id' => $umkm->id,
            'initiated_by' => 'umkm',
            'status' => 'pending',
            'match_score' => $matchResult['score'],
            'match_reason' => $matchResult['reasons'],
            'match_reason_ai' => $matchReasonAi,
            'message' => $message,
            'proposed_price' => $proposedPrice,
            'applied_at' => now(),
        ]);
    }

    /**
     * Generate alasan kecocokan melalui LLM (opsional).
     * Implementasi aktual akan dipasang saat AI_MATCH_LLM_ENABLED=true.
     */
    private function generateAiReason(Event $event, UmkmProfile $umkm): ?string
    {
        // Placeholder untuk integrasi Gemini LLM di masa depan.
        // Saat ini mengembalikan null karena fitur LLM masih opsional/belum diaktifkan.
        return null;
    }

    public function approve(EventApplication $application): EventApplication
{
    if (!in_array($application->status, ['pending', 'reviewing', 'negotiating'], true)) {
        throw new ApplicationRuleException('Aplikasi ini sudah direview sebelumnya.');
    }

    $event = $application->event;

    // Rule 4 dicek ulang di sini (bukan cuma di apply), karena kondisi bisa berubah antara apply dan review
    $approvedCount = EventApplication::where('event_id', $event->id)
        ->where('status', 'approved')
        ->count();

    if ($approvedCount >= $event->booth_capacity) {
        throw new ApplicationRuleException('Kuota booth untuk event ini sudah penuh.');
    }

    return DB::transaction(function () use ($application, $event) {
        $application->update([
            'status' => 'approved',
            'reviewed_at' => now(),
        ]);

        Booth::create([
            'event_id' => $event->id,
            'application_id' => $application->id,
            'booth_number' => $this->generateBoothNumber($event->id),
            'status' => 'occupied',
        ]);

        return $application->fresh('booth');
    });
}

public function reject(EventApplication $application): EventApplication
{
    if (!in_array($application->status, ['pending', 'reviewing', 'negotiating'], true)) {
        throw new ApplicationRuleException('Aplikasi ini sudah direview sebelumnya.');
    }

    $application->update([
        'status' => 'rejected',
        'reviewed_at' => now(),
    ]);

    return $application;
}

private function generateBoothNumber(int $eventId): string
{
    $count = Booth::where('event_id', $eventId)->count();
    $letter = 'A';
    $number = str_pad($count + 1, 2, '0', STR_PAD_LEFT);

    return "{$letter}{$number}";
}
}
