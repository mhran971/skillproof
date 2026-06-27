<?php

namespace Database\Factories;

use App\Models\SubmissionFile;
use App\Models\ChallengeSubmission;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionFileFactory extends Factory
{
    protected $model = SubmissionFile::class;

    public function definition(): array
    {
        return [
            'submission_id' => ChallengeSubmission::factory(),
            'file_name' => $this->faker->word() . '.pdf',
            'file_path' => 'submissions/' . $this->faker->uuid() . '.pdf',
            'file_type' => 'document',
            'file_size' => $this->faker->numberBetween(1000, 10000000),
            'mime_type' => 'application/pdf',
        ];
    }
}
