<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FraudAlert>
 */
class FraudAlertFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => $this->faker->randomElement(['plagiarism', 'multiple_accounts', 'suspicious_activity']),
            'description' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['open', 'investigation', 'closed', 'dismissed']),
            'severity' => $this->faker->randomElement(['low', 'medium', 'high', 'critical']),
        ];
    }
}
