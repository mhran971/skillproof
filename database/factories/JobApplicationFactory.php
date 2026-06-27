<?php

namespace Database\Factories;

use App\Models\CandidateProfile;
use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JobApplication>
 */
class JobApplicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'job_id' => Job::factory(),
            'candidate_profile_id' => CandidateProfile::factory(),
            'status' => $this->faker->randomElement(['applied', 'under_review', 'interviewing', 'offered', 'rejected', 'withdrawn']),
            'cover_letter' => $this->faker->paragraph(),
            'expected_salary' => $this->faker->numberBetween(40000, 90000),
            'match_percentage' => $this->faker->randomFloat(2, 50, 100),
            'applied_at' => now(),
        ];
    }
}
