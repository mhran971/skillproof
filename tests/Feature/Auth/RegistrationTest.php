<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register_as_candidate(): void
    {
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'username' => 'testuser',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'candidate',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', ['email' => 'test@example.com', 'username' => 'testuser']);
        $user = \App\Models\User::where('email', 'test@example.com')->first();
        $this->assertTrue($user->hasRole('candidate'));
        $this->assertDatabaseHas('candidate_profiles', ['user_id' => $user->id]);
    }

    public function test_new_users_can_register_as_company(): void
    {
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);

        $response = $this->post('/register', [
            'name' => 'Test Company User',
            'email' => 'company@example.com',
            'username' => 'companyuser',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'company',
            'company_name' => 'Test Company',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));

        $this->assertDatabaseHas('users', ['email' => 'company@example.com', 'username' => 'companyuser']);
        $user = \App\Models\User::where('email', 'company@example.com')->first();
        $this->assertTrue($user->hasRole('company'));
        $this->assertDatabaseHas('companies', ['user_id' => $user->id, 'name' => 'Test Company']);
    }
}
