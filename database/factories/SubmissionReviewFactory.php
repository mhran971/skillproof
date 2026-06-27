<?php

namespace Database\Factories;

use App\Models\ChallengeSubmission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SubmissionReview>
 */
class SubmissionReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'submission_id' => ChallengeSubmission::factory(),
            'reviewer_id' => User::factory(),
            'criterion_name' => $this->faker->word(),
            'score' => $this->faker->randomFloat(2, 0, 100),
            'feedback' => $this->faker->sentence(),
            'is_final' => $this->faker->boolean(),
        ];
    }
}
