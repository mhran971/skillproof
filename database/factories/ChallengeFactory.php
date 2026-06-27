<?php

namespace Database\Factories;

use App\Models\ChallengeCategory;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Challenge>
 */
class ChallengeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'title' => $this->faker->sentence(),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->paragraphs(3, true),
            'requirements' => $this->faker->paragraphs(2, true),
            'deliverables' => $this->faker->paragraphs(2, true),
            'difficulty' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced', 'expert']),
            'category_id' => ChallengeCategory::factory(),
            'industry' => $this->faker->word(),
            'duration_hours' => $this->faker->numberBetween(1, 100),
            'deadline' => $this->faker->dateTimeBetween('+1 week', '+1 month'),
            'max_participants' => $this->faker->numberBetween(10, 100),
            'reward' => $this->faker->sentence(),
            'evaluation_criteria' => [
                ['name' => 'Code Quality', 'weight' => 40],
                ['name' => 'Performance', 'weight' => 30],
                ['name' => 'UI/UX', 'weight' => 30],
            ],
            'is_published' => true,
            'visibility' => 'public',
            'created_by' => User::factory(),
        ];
    }
}
