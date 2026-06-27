<?php

namespace Database\Factories;

use App\Models\Challenge;
use App\Models\Company;
use App\Models\ChallengeCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ChallengeFactory extends Factory
{
    protected $model = Challenge::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(4);
        return [
            'company_id' => Company::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $this->faker->paragraphs(3, true),
            'requirements' => $this->faker->paragraph(),
            'deliverables' => $this->faker->paragraph(),
            'difficulty' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced', 'expert']),
            'category_id' => ChallengeCategory::factory(),
            'industry' => $this->faker->word(),
            'duration_hours' => $this->faker->numberBetween(1, 168),
            'deadline' => $this->faker->dateTimeBetween('now', '+1 month'),
            'max_participants' => $this->faker->numberBetween(10, 100),
            'reward' => $this->faker->sentence(),
            'evaluation_criteria' => [
                ['name' => 'Code Quality', 'weight' => 40],
                ['name' => 'Functionality', 'weight' => 40],
                ['name' => 'Design', 'weight' => 20],
            ],
            'is_published' => true,
            'is_featured' => $this->faker->boolean(),
            'visibility' => 'public',
            'created_by' => function (array $attributes) {
                return Company::find($attributes['company_id'])->user_id;
            },
        ];
    }
}
