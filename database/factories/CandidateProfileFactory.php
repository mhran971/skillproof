<?php

namespace Database\Factories;

use App\Models\CandidateProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CandidateProfileFactory extends Factory
{
    protected $model = CandidateProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'professional_headline' => $this->faker->jobTitle(),
            'biography' => $this->faker->paragraph(),
            'phone' => $this->faker->phoneNumber(),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'birth_date' => $this->faker->date(),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'github_url' => $this->faker->url(),
            'linkedin_url' => $this->faker->url(),
            'portfolio_url' => $this->faker->url(),
            'reputation_score' => $this->faker->randomFloat(2, 0, 1000),
            'job_readiness_score' => $this->faker->randomFloat(2, 0, 100),
            'profile_completion' => $this->faker->numberBetween(0, 100),
            'is_public' => true,
        ];
    }
}
