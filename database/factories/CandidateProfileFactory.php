<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CandidateProfile>
 */
class CandidateProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'professional_headline' => $this->faker->sentence(),
            'bio' => $this->faker->paragraph(),
            'location' => $this->faker->city(),
            'github_url' => $this->faker->url(),
            'linkedin_url' => $this->faker->url(),
            'experience_level' => $this->faker->randomElement(['junior', 'mid', 'senior', 'lead']),
            'is_public' => true,
            'is_available' => true,
            'reputation_score' => $this->faker->numberBetween(0, 1000),
            'profile_completion' => $this->faker->numberBetween(10, 100),
        ];
    }
}
