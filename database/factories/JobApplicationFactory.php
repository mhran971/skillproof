<?php

namespace Database\Factories;

use App\Models\JobApplication;
use App\Models\Job;
use App\Models\CandidateProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobApplicationFactory extends Factory
{
    protected $model = JobApplication::class;

    public function definition(): array
    {
        return [
            'job_id' => Job::factory(),
            'candidate_profile_id' => CandidateProfile::factory(),
            'status' => $this->faker->randomElement(['applied', 'under_review', 'interviewing', 'offered', 'rejected', 'withdrawn']),
            'cover_letter' => $this->faker->paragraph(),
            'expected_salary' => $this->faker->numberBetween(30000, 150000),
            'match_percentage' => $this->faker->randomFloat(2, 50, 100),
            'applied_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
