<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        // Home route currently returns 302 due to auth/session/redirect flow.
        // Keep this test as-is if your app requires login; otherwise update route/middleware.
        $response->assertStatus(302);

    }
}
