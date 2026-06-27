<?php

namespace Database\Factories;

use App\Models\CompanyMember;
use App\Models\Company;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyMemberFactory extends Factory
{
    protected $model = CompanyMember::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'user_id' => User::factory(),
            'role' => $this->faker->randomElement(['admin', 'member', 'recruiter']),
        ];
    }
}
