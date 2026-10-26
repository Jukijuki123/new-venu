<?php
// app/Services/AnalyticsService.php
namespace App\Services;

use App\Models\Event;

class AnalyticsService
{
    public function forEvent(Event $event): array
    {
        $applications = $event->applications()->with('umkm');

        $total = (clone $applications)->count();
        $approved = (clone $applications)->where('status', 'approved')->count();
        $rejected = (clone $applications)->where('status', 'rejected')->count();
        $pending = (clone $applications)->where('status', 'pending')->count();

        $boothsFilled = $event->booths()->where('status', 'occupied')->count();
        $boothCapacity = $event->booth_capacity;

        $occupancyRate = $boothCapacity > 0
            ? round(($boothsFilled / $boothCapacity) * 100, 2)
            : 0;

        $acceptanceRate = $total > 0
            ? round(($approved / $total) * 100, 2)
            : 0;

        $avgMatchScore = (clone $applications)->whereNotNull('match_score')->avg('match_score');

        // Distribusi kategori tenant yang terikat pada event ini (hanya yang approved/active)
        $categoryCounts = (clone $applications)
            ->where('status', 'approved')
            ->join('umkm_profiles', 'event_applications.umkm_id', '=', 'umkm_profiles.id')
            ->selectRaw('COALESCE(umkm_profiles.category, "Lainnya") as cat, COUNT(*) as count')
            ->groupBy('cat')
            ->pluck('count', 'cat')
            ->map(fn ($n) => (int) $n)
            ->toArray();

        $dominantCategory = null;
        if (!empty($categoryCounts)) {
            $dominantCategory = array_keys($categoryCounts, max($categoryCounts))[0];
        }

        // Distribusi lokasi tenant (jika data tersedia)
        $locationCounts = (clone $applications)
            ->where('status', 'approved')
            ->join('umkm_profiles', 'event_applications.umkm_id', '=', 'umkm_profiles.id')
            ->whereNotNull('umkm_profiles.location')
            ->selectRaw('umkm_profiles.location as loc, COUNT(*) as count')
            ->groupBy('loc')
            ->pluck('count', 'loc')
            ->map(fn ($n) => (int) $n)
            ->toArray();

        $hasLocationData = !empty($locationCounts);

        // Insight event — derivasi murni dari data, tanpa dummy
        $insights = $this->buildInsights([
            'booth_capacity' => $boothCapacity,
            'booths_filled' => $boothsFilled,
            'booth_empty' => max($boothCapacity - $boothsFilled, 0),
            'occupancy_rate' => $occupancyRate,
            'acceptance_rate' => $acceptanceRate,
            'approved' => $approved,
            'total_applications' => $total,
            'pending' => $pending,
            'dominant_category' => $dominantCategory,
            'category_counts' => $categoryCounts,
            'has_location_data' => $hasLocationData,
        ]);

        return [
            'total_applications' => $total,
            'approved_applications' => $approved,
            'rejected_applications' => $rejected,
            'pending_applications' => $pending,
            'booths_filled' => $boothsFilled,
            'booth_capacity' => $boothCapacity,
            'occupancy_rate' => $occupancyRate,
            'acceptance_rate' => $acceptanceRate,
            'average_match_score' => $avgMatchScore !== null ? round($avgMatchScore, 2) : null,
            'category_counts' => $categoryCounts,
            'dominant_category' => $dominantCategory,
            'location_counts' => $locationCounts,
            'has_location_data' => $hasLocationData,
            'insights' => $insights,
        ];
    }

    /**
     * Buat insight yang selalu turunan dari data — tidak pernah menghasilkan angka palsu.
     *
     * @param array $d Data statistik event (sudah dihitung).
     * @return array<int, array{type: string, text: string}>
     */
    private function buildInsights(array $d): array
    {
        $insights = [];

        // 1. Keterisian booth
        if ($d['booth_capacity'] > 0) {
            if ($d['occupancy_rate'] >= 75) {
                $insights[] = [
                    'type' => 'success',
                    'text' => "{$d['occupancy_rate']}% kapasitas booth telah terisi.",
                ];
            } elseif ($d['occupancy_rate'] >= 40) {
                $insights[] = [
                    'type' => 'info',
                    'text' => "Kapasitas booth telah terisi {$d['occupancy_rate']}%. Masih tersedia {$d['booth_empty']} booth.",
                ];
            } else {
                $insights[] = [
                    'type' => 'warning',
                    'text' => "Masih tersedia {$d['booth_empty']} booth. Keterisian masih {$d['occupancy_rate']}%.",
                ];
            }
        }

        // 2. Kategori dominan
        if ($d['dominant_category'] !== null) {
            $insights[] = [
                'type' => 'info',
                'text' => "{$d['dominant_category']} menjadi kategori tenant paling dominan.",
            ];
        }

        // 3. Performa proposal
        if ($d['total_applications'] > 0) {
            if ($d['acceptance_rate'] >= 60) {
                $insights[] = [
                    'type' => 'success',
                    'text' => "Sebagian besar proposal telah diterima ({$d['acceptance_rate']}%).",
                ];
            } elseif ($d['acceptance_rate'] >= 30) {
                $insights[] = [
                    'type' => 'info',
                    'text' => "{$d['approved']} dari {$d['total_applications']} proposal diterima ({$d['acceptance_rate']}%).",
                ];
            } else {
                $insights[] = [
                    'type' => 'warning',
                    'text' => "Hanya {$d['approved']} proposal diterima. {$d['pending']} proposal masih menunggu.",
                ];
            }
        }

        // 4. Booth kosong → rekomendasi AI Match
        if ($d['booth_empty'] > 0) {
            $insights[] = [
                'type' => 'warning',
                'text' => "Masih tersedia {$d['booth_empty']} booth kosong. Pertimbangkan mencari tambahan UMKM melalui AI Match.",
            ];
        }

        // 5. Proposal menunggu
        if ($d['pending'] > 0) {
            $insights[] = [
                'type' => 'info',
                'text' => "{$d['pending']} proposal masih menunggu peninjauan.",
            ];
        }

        return $insights;
    }
}