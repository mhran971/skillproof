<?php

namespace Database\Factories;

use App\Models\ChallengeSubmission;
use App\Models\Challenge;
use App\Models\CandidateProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChallengeSubmissionFactory extends Factory
{
    protected $model = ChallengeSubmission::class;

    public function definition(): array
    {
        return [
            'challenge_id' => Challenge::factory(),
            'candidate_profile_id' => CandidateProfile::factory(),
            'status' => $this->faker->randomElement(['draft', 'submitted', 'under_review', 'evaluated', 'accepted', 'rejected']),
            'github_url' => $this->faker->url(),
            'live_url' => $this->faker->url(),
            'notes' => $this->faker->sentence(),
            'submitted_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'final_score' => $this->faker->randomFloat(2, 0, 100),
        ];
    }
}
