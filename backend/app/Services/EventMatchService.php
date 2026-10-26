<?php

namespace App\Services;

use App\Models\Event;
use App\Models\UmkmProfile;

/**
 * Backward-compatible wrapper — delegates to AiMatchService
 * Existing code (ApplicationService, old controllers) tetap jalan.
 */
class EventMatchService
{
    public function __construct(private AiMatchService $aiMatch) {}

    public function score(Event $event, UmkmProfile $umkm): array
    {
        $r = $this->aiMatch->score($event, $umkm);
        return [
            'score'   => $r['score'],
            'reasons' => $r['reasons'],
        ];
    }
}
