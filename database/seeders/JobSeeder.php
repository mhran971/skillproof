<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();
        $admin = User::role('admin')->first();

        foreach (range(1, 10) as $i) {
            Job::factory()->create([
                'company_id' => $companies->random()->id,
                'created_by' => $admin ? $admin->id : User::factory(),
            ]);
        }
    }
}
