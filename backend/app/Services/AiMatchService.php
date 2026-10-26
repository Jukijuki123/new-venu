<?php

namespace App\Services;

use App\Models\Event;
use App\Models\UmkmProfile;

/**
 * AiMatchService — deterministic scoring engine
 *
 * Bobot:
 *  CATEGORY 40%
 *  LOCATION 20%
 *  TARGET   15%
 *  BUDGET   20%
 *  PROFILE   5%
 *
 * Total 100, integer, tanpa random.
 *
 * Asumsi BUDGET:
 *  booth_price  = biaya sewa 1 booth di event (ditentukan sekolah)
 *  booth_budget_max = kemampuan maksimal UMKM untuk booth
 *  price_min/max = kisaran harga jual produk UMKM — TIDAK dibandingkan
 *                  dengan booth_price karena jenis harga berbeda.
 */
class AiMatchService
{
    private const WEIGHT_CATEGORY = 40;
    private const WEIGHT_LOCATION = 20;
    private const WEIGHT_TARGET   = 15;
    private const WEIGHT_BUDGET   = 20;
    private const WEIGHT_PROFILE  = 5;

    /** Pasangan kategori yang dianggap terkait (partial score) */
    private const RELATED_MAP = [
        'makanan'   => ['minuman' => 70],
        'minuman'   => ['makanan' => 70],
        'kerajinan' => ['aksesoris' => 60, 'fashion' => 50],
        'aksesoris' => ['kerajinan' => 60, 'fashion' => 60],
        'fashion'   => ['aksesoris' => 60, 'kerajinan' => 50],
    ];

    /** Pasangan target audience yang dianggap related */
    private const TARGET_RELATED = [
        'pelajar'  => ['remaja' => 80, 'umum' => 60, 'keluarga' => 50],
        'remaja'   => ['pelajar' => 80, 'umum' => 70, 'keluarga' => 50],
        'umum'     => ['pelajar' => 60, 'remaja' => 70, 'keluarga' => 70],
        'keluarga' => ['umum' => 70, 'pelajar' => 50, 'remaja' => 50],
    ];

    /**
     * Hitung skor kecocokan Event <-> UMKM.
     *
     * @return array{score:int, reasons:string[], breakdown:array}
     */
    public function score(Event $event, UmkmProfile $umkm): array
    {
        $categoryResult = $this->scoreCategory($event, $umkm);
        $locationResult = $this->scoreLocation($event, $umkm);
        $targetResult   = $this->scoreTarget($event, $umkm);
        $budgetResult   = $this->scoreBudget($event, $umkm);
        $profileResult  = $this->scoreProfile($event, $umkm);

        $total = $categoryResult['points']
            + $locationResult['points']
            + $targetResult['points']
            + $budgetResult['points']
            + $profileResult['points'];

        $total = min(100, max(0, (int) round($total)));

        $reasons = [];
        if ($categoryResult['fulfilled']) $reasons[] = 'Kategori produk sesuai';
        if ($locationResult['fulfilled']) $reasons[] = 'Lokasi usaha sesuai dengan lokasi event';
        if ($targetResult['fulfilled'])   $reasons[] = 'Target audiens sesuai';
        if ($budgetResult['fulfilled'])   $reasons[] = 'Budget booth sesuai';
        if ($profileResult['fulfilled'])  $reasons[] = 'Profil usaha sesuai';

        return [
            'score'     => $total,
            'reasons'   => $reasons,
            'breakdown' => [
                'category' => $categoryResult,
                'location' => $locationResult,
                'target'   => $targetResult,
                'budget'   => $budgetResult,
                'profile'  => $profileResult,
            ],
        ];
    }

    private function scoreCategory(Event $event, UmkmProfile $umkm): array
    {
        $eventCategories = $event->categories ?: [$event->category];
        $eventCategories = array_map(fn($c) => $this->normalize($c), $eventCategories);
        $umkmCategory = $this->normalize($umkm->category);

        // exact match
        if (in_array($umkmCategory, $eventCategories, true)) {
            return ['percent' => 100, 'points' => self::WEIGHT_CATEGORY, 'fulfilled' => true];
        }

        // related check — ambil skor tertinggi
        $best = 0;
        foreach ($eventCategories as $ec) {
            $related = self::RELATED_MAP[$ec] ?? [];
            if (isset($related[$umkmCategory])) {
                $best = max($best, $related[$umkmCategory]);
            }
            // reverse lookup juga
            $reverse = self::RELATED_MAP[$umkmCategory] ?? [];
            if (isset($reverse[$ec])) {
                $best = max($best, $reverse[$ec]);
            }
        }

        if ($best > 0) {
            $points = (int) round($best / 100 * self::WEIGHT_CATEGORY);
            // related 70% -> 28 poin tetap dianggap fulfilled untuk reasons
            return ['percent' => $best, 'points' => $points, 'fulfilled' => $best >= 60];
        }

        return ['percent' => 0, 'points' => 0, 'fulfilled' => false];
    }

    private function scoreLocation(Event $event, UmkmProfile $umkm): array
    {
        if (!$umkm->location || !$event->location) {
            // fallback neutral 40% jika salah satu kosong
            $points = (int) round(40 / 100 * self::WEIGHT_LOCATION);
            return ['percent' => 40, 'points' => $points, 'fulfilled' => false];
        }

        $a = $this->normalize($umkm->location);
        $b = $this->normalize($event->location);

        if ($a === $b) {
            return ['percent' => 100, 'points' => self::WEIGHT_LOCATION, 'fulfilled' => true];
        }

        // keduanya mengandung kata "jakarta" tapi kecamatan beda -> partial 60%
        if (str_contains($a, 'jakarta') && str_contains($b, 'jakarta')) {
            return ['percent' => 60, 'points' => (int) round(60 / 100 * self::WEIGHT_LOCATION), 'fulfilled' => true];
        }

        // substring match (mis Jakarta Timur contains Jakarta)
        if (str_contains($b, $a) || str_contains($a, $b)) {
            return ['percent' => 70, 'points' => (int) round(70 / 100 * self::WEIGHT_LOCATION), 'fulfilled' => true];
        }

        // kota berbeda -> low
        return ['percent' => 10, 'points' => (int) round(10 / 100 * self::WEIGHT_LOCATION), 'fulfilled' => false];
    }

    private function scoreTarget(Event $event, UmkmProfile $umkm): array
    {
        if (!$event->target_audience || !$umkm->target_audience) {
            $points = (int) round(50 / 100 * self::WEIGHT_TARGET);
            return ['percent' => 50, 'points' => $points, 'fulfilled' => false];
        }

        $a = $this->normalize($event->target_audience);
        $b = $this->normalize($umkm->target_audience);

        if ($a === $b) {
            return ['percent' => 100, 'points' => self::WEIGHT_TARGET, 'fulfilled' => true];
        }

        $related = self::TARGET_RELATED[$a] ?? [];
        if (isset($related[$b])) {
            $pct = $related[$b];
            $points = (int) round($pct / 100 * self::WEIGHT_TARGET);
            return ['percent' => $pct, 'points' => $points, 'fulfilled' => $pct >= 70];
        }

        // reverse
        $reverse = self::TARGET_RELATED[$b] ?? [];
        if (isset($reverse[$a])) {
            $pct = $reverse[$a];
            $points = (int) round($pct / 100 * self::WEIGHT_TARGET);
            return ['percent' => $pct, 'points' => $points, 'fulfilled' => $pct >= 70];
        }

        return ['percent' => 30, 'points' => (int) round(30 / 100 * self::WEIGHT_TARGET), 'fulfilled' => false];
    }

    private function scoreBudget(Event $event, UmkmProfile $umkm): array
    {
        if ($umkm->booth_budget_max === null) {
            $points = (int) round(50 / 100 * self::WEIGHT_BUDGET);
            return ['percent' => 50, 'points' => $points, 'fulfilled' => false];
        }

        $price = (int) $event->booth_price;
        $budget = (int) $umkm->booth_budget_max;

        if ($price <= $budget) {
            return ['percent' => 100, 'points' => self::WEIGHT_BUDGET, 'fulfilled' => true];
        }

        $over = ($price - $budget) / max(1, $budget);
        if ($over <= 0.20) {
            return ['percent' => 60, 'points' => (int) round(60 / 100 * self::WEIGHT_BUDGET), 'fulfilled' => false];
        }
        if ($over <= 0.50) {
            return ['percent' => 30, 'points' => (int) round(30 / 100 * self::WEIGHT_BUDGET), 'fulfilled' => false];
        }

        return ['percent' => 10, 'points' => (int) round(10 / 100 * self::WEIGHT_BUDGET), 'fulfilled' => false];
    }

    private function scoreProfile(Event $event, UmkmProfile $umkm): array
    {
        $desc = $this->normalize($umkm->description);
        if ($desc === '') {
            return ['percent' => 0, 'points' => 0, 'fulfilled' => false];
        }

        // bonus jika deskripsi mengandung kategori/event keywords
        $keywords = [];
        $cats = $event->categories ?: [$event->category];
        foreach ($cats as $c) {
            $keywords[] = $this->normalize($c);
        }
        $keywords[] = $this->normalize($event->name);

        foreach ($keywords as $kw) {
            if ($kw !== '' && str_contains($desc, $kw)) {
                return ['percent' => 100, 'points' => self::WEIGHT_PROFILE, 'fulfilled' => true];
            }
        }

        // deskripsi cukup panjang -> partial
        if (mb_strlen($desc) > 20) {
            return ['percent' => 60, 'points' => (int) round(60 / 100 * self::WEIGHT_PROFILE), 'fulfilled' => true];
        }

        return ['percent' => 30, 'points' => (int) round(30 / 100 * self::WEIGHT_PROFILE), 'fulfilled' => false];
    }

    private function normalize(?string $value): string
    {
        return strtolower(trim($value ?? ''));
    }
}
