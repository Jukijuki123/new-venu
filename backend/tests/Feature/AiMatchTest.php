<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\School;
use App\Models\UmkmProfile;
use App\Models\User;
use App\Services\AiMatchService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiMatchTest extends TestCase
{
    use RefreshDatabase;

    private function makeEvent(array $over = []): Event
    {
        $school = School::factory()->create();
        return Event::factory()->create(array_merge([
            'school_id' => $school->id,
            'category' => 'Makanan',
            'categories' => ['Makanan'],
            'location' => 'Jakarta Timur',
            'target_audience' => 'Pelajar',
            'booth_price' => 400000,
            'status' => 'published',
        ], $over));
    }

    private function makeUmkm(array $over = []): UmkmProfile
    {
        return UmkmProfile::factory()->create(array_merge([
            'category' => 'Makanan',
            'location' => 'Jakarta Timur',
            'target_audience' => 'Pelajar',
            'booth_budget_max' => 500000,
            'description' => 'Usaha makanan enak untuk pelajar di festival budaya',
        ], $over));
    }

    public function test_same_category_produces_high_score(): void
    {
        $event = $this->makeEvent();
        $umkm = $this->makeUmkm(['category' => 'Makanan']);
        $svc = app(AiMatchService::class);
        $r = $svc->score($event, $umkm);
        $this->assertGreaterThanOrEqual(90, $r['score']);
        $this->assertContains('Kategori produk sesuai', $r['reasons']);
    }

    public function test_related_category_partial(): void
    {
        $event = $this->makeEvent(['category' => 'Makanan', 'categories' => ['Makanan']]);
        $umkm = $this->makeUmkm(['category' => 'Minuman']);
        $svc = app(AiMatchService::class);
        $r = $svc->score($event, $umkm);
        // Makanan<->Minuman related 70% -> should still be >=75 overall with other factors
        $this->assertGreaterThanOrEqual(75, $r['score']);
    }

    public function test_unrelated_category_low(): void
    {
        $event = $this->makeEvent(['category' => 'Makanan', 'categories' => ['Makanan']]);
        $umkm = $this->makeUmkm(['category' => 'Kerajinan']);
        $svc = app(AiMatchService::class);
        $r = $svc->score($event, $umkm);
        $this->assertLessThan(70, $r['score']);
        $this->assertNotContains('Kategori produk sesuai', $r['reasons']);
    }

    public function test_same_location_increases_score(): void
    {
        $event = $this->makeEvent(['location' => 'Jakarta Timur']);
        $same = $this->makeUmkm(['location' => 'Jakarta Timur']);
        $diff = $this->makeUmkm(['location' => 'Bandung']);
        $svc = app(AiMatchService::class);
        $sameScore = $svc->score($event, $same)['score'];
        $diffScore = $svc->score($event, $diff)['score'];
        $this->assertGreaterThan($diffScore, $sameScore);
        $r = $svc->score($event, $same);
        $this->assertContains('Lokasi usaha sesuai dengan lokasi event', $r['reasons']);
    }

    public function test_same_target_increases_score(): void
    {
        $event = $this->makeEvent(['target_audience' => 'Pelajar']);
        $same = $this->makeUmkm(['target_audience' => 'Pelajar']);
        $svc = app(AiMatchService::class);
        $r = $svc->score($event, $same);
        $this->assertContains('Target audiens sesuai', $r['reasons']);
    }

    public function test_deterministic(): void
    {
        $event = $this->makeEvent();
        $umkm = $this->makeUmkm();
        $svc = app(AiMatchService::class);
        $a = $svc->score($event, $umkm);
        $b = $svc->score($event, $umkm);
        $this->assertSame($a['score'], $b['score']);
        $this->assertSame($a['reasons'], $b['reasons']);
    }

    public function test_match_endpoint_does_not_create_collaboration(): void
    {
        $schoolUser = User::factory()->create(['role' => 'school']);
        $school = School::factory()->create(['user_id' => $schoolUser->id]);
        $event = $this->makeEvent(['school_id' => $school->id]);
        UmkmProfile::factory()->count(2)->create();

        $token = $schoolUser->createToken('test_token')->plainTextToken;
        $resp = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/v1/school/events/{$event->id}/matches");
        $resp->assertOk();
        $this->assertEquals(0, \App\Models\EventApplication::count());
    }

    public function test_school_cannot_access_another_schools_event_matches(): void
    {
        $owner = User::factory()->create(['role' => 'school']);
        $ownerSchool = School::factory()->create(['user_id' => $owner->id]);
        $event = $this->makeEvent(['school_id' => $ownerSchool->id]);

        $other = User::factory()->create(['role' => 'school']);
        School::factory()->create(['user_id' => $other->id]);

        $token = $other->createToken('test_token')->plainTextToken;
        $resp = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson("/api/v1/school/events/{$event->id}/matches");
        $resp->assertStatus(403);
    }

    public function test_umkm_match_endpoint_requires_auth(): void
    {
        $resp = $this->getJson('/api/v1/umkm/matches');
        $resp->assertStatus(401);
    }

    public function test_collaboration_created_from_match(): void
    {
        $schoolUser = User::factory()->create(['role' => 'school']);
        $school = School::factory()->create(['user_id' => $schoolUser->id]);
        $event = $this->makeEvent(['school_id' => $school->id]);

        $umkmUser = User::factory()->create(['role' => 'umkm']);
        $umkm = UmkmProfile::factory()->create(['user_id' => $umkmUser->id]);

        // school invites umkm
        $token = $schoolUser->createToken('test_token')->plainTextToken;
        $resp = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/school/collaborations', [
                'event_id' => $event->id,
                'umkm_id' => $umkm->id,
                'message' => 'Mari kolaborasi',
            ]);
        $resp->assertCreated();
        $this->assertDatabaseHas('event_applications', ['event_id' => $event->id, 'umkm_id' => $umkm->id, 'initiated_by' => 'school']);

        // umkm can see it
        $appId = $resp->json('data.id');
        $token2 = $umkmUser->createToken('test_token')->plainTextToken;
        $resp2 = $this->withHeader('Authorization', 'Bearer ' . $token2)
            ->getJson("/api/v1/collaborations/{$appId}");
        $resp2->assertOk();
    }

    public function test_public_events_accessible_without_auth(): void
    {
        $this->makeEvent();
        $resp = $this->getJson('/api/v1/events');
        $resp->assertOk();
    }
}
