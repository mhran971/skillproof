<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JobFactory extends Factory
{
    protected $model = Job::class;

    public function definition(): array
    {
        $title = $this->faker->jobTitle();
        return [
            'company_id' => Company::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $this->faker->paragraphs(3, true),
            'requirements' => $this->faker->paragraph(),
            'benefits' => $this->faker->paragraph(),
            'location' => $this->faker->city(),
            'type' => $this->faker->randomElement(['full-time', 'part-time', 'contract', 'internship']),
            'salary_range' => $this->faker->randomElement(['$50k - $70k', '$70k - $90k', '$100k+']),
            'is_active' => true,
        ];
    }
}
