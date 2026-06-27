<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Models\ChallengeCategory;
use App\Models\Company;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChallengeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Frontend', 'Backend', 'Full Stack', 'Data Science', 'Mobile', 'Security'];
        $categoryModels = [];

        foreach ($categories as $cat) {
            $categoryModels[] = ChallengeCategory::factory()->create([
                'name' => $cat,
                'slug' => \Illuminate\Support\Str::slug($cat),
            ]);
        }

        $companies = Company::all();
        if ($companies->isEmpty()) {
            $companies = Company::factory(3)->create();
        }

        $skills = Skill::all();
        $admin = User::role('admin')->first();

        foreach (range(1, 10) as $i) {
            $challenge = Challenge::factory()->create([
                'company_id' => $companies->random()->id,
                'category_id' => collect($categoryModels)->random()->id,
                'created_by' => $admin ? $admin->id : User::factory(),
            ]);

            if ($skills->isNotEmpty()) {
                $challenge->requiredSkills()->attach(
                    $skills->random(rand(2, 5))->pluck('id')->toArray()
                );
            }
        }
    }
}
