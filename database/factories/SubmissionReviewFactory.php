<?php

namespace Database\Factories;

use App\Models\SubmissionReview;
use App\Models\ChallengeSubmission;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionReviewFactory extends Factory
{
    protected $model = SubmissionReview::class;

    public function definition(): array
    {
        return [
            'submission_id' => ChallengeSubmission::factory(),
            'reviewer_id' => User::factory(),
            'criterion_name' => $this->faker->word(),
            'score' => $this->faker->randomFloat(2, 0, 10),
            'feedback' => $this->faker->sentence(),
            'is_final' => $this->faker->boolean(),
        ];
    }
}
