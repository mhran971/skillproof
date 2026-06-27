<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->company();
        return [
            'user_id' => User::factory(),
            'name' => $name,
            'slug' => Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 10000),
            'description' => $this->faker->paragraph(),
            'website' => $this->faker->url(),
            'industry' => $this->faker->word(),
            'company_size' => $this->faker->randomElement(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
            'founded_year' => $this->faker->year(),
            'country' => $this->faker->country(),
            'city' => $this->faker->city(),
            'is_verified' => $this->faker->boolean(),
            'is_public' => true,
        ];
    }
}
