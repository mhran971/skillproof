<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\CandidateProfile;
use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\RolePermissionSeeder;

class RedirectionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_candidate_is_redirected_to_candidate_dashboard(): void
    {
        $user = User::factory()->create();
        $user->assignRole('candidate');
        CandidateProfile::create([
            'user_id' => $user->id,
            'reputation_score' => 0,
            'profile_completion' => 0,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('candidate.dashboard'));

        $response = $this->followRedirects($response);
        $response->assertStatus(200);
    }

    public function test_company_is_redirected_to_company_dashboard(): void
    {
        $user = User::factory()->create();
        $user->assignRole('company');
        Company::create([
            'user_id' => $user->id,
            'name' => 'Test Company',
            'slug' => 'test-company-' . $user->id,
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('company.dashboard'));

        $response = $this->followRedirects($response);
        $response->assertStatus(200);
    }

    public function test_user_without_role_is_handled_gracefully(): void
    {
        $user = User::factory()->create();
        // No role assigned

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('profile.edit'));

        $response = $this->followRedirects($response);
        $response->assertStatus(200);
    }

    public function test_candidate_without_profile_fails_gracefully(): void
    {
        $user = User::factory()->create();
        $user->assignRole('candidate');
        // Missing CandidateProfile

        $response = $this->actingAs($user)->get(route('candidate.dashboard'));

        $response->assertStatus(403);
    }

    public function test_company_without_profile_fails_gracefully(): void
    {
        $user = User::factory()->create();
        $user->assignRole('company');
        // Missing Company profile

        $response = $this->actingAs($user)->get(route('company.dashboard'));

        // Current code has:
        // if (!$company) { abort(403, 'No company profile found.'); }
        $response->assertStatus(403);
    }
}
