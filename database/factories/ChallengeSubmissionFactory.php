<?php

namespace Database\Factories;

use App\Models\CandidateProfile;
use App\Models\Challenge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChallengeSubmission>
 */
class ChallengeSubmissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'challenge_id' => Challenge::factory(),
            'candidate_profile_id' => CandidateProfile::factory(),
            'status' => $this->faker->randomElement(['draft', 'submitted', 'under_review', 'evaluated', 'accepted', 'rejected']),
            'github_url' => $this->faker->url(),
            'notes' => $this->faker->sentence(),
            'submitted_at' => now(),
            'final_score' => $this->faker->randomFloat(2, 0, 100),
        ];
    }
}
