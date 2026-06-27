<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
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
            'title' => $this->faker->jobTitle(),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->paragraphs(3, true),
            'requirements' => $this->faker->paragraphs(2, true),
            'responsibilities' => $this->faker->paragraphs(2, true),
            'location' => $this->faker->city(),
            'is_remote' => $this->faker->boolean(),
            'is_hybrid' => $this->faker->boolean(),
            'salary_min' => $this->faker->numberBetween(30000, 50000),
            'salary_max' => $this->faker->numberBetween(60000, 100000),
            'salary_currency' => 'USD',
            'employment_type' => $this->faker->randomElement(['full-time', 'part-time', 'contract', 'internship']),
            'experience_level' => $this->faker->randomElement(['entry', 'mid', 'senior', 'lead']),
            'required_skills' => $this->faker->words(3),
            'nice_to_have_skills' => $this->faker->words(3),
            'benefits' => $this->faker->words(5),
            'application_deadline' => $this->faker->dateTimeBetween('+1 week', '+2 months'),
            'status' => 'published',
            'created_by' => User::factory(),
        ];
    }
}
