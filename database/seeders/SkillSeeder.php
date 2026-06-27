<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Frontend' => ['React', 'Vue', 'Angular', 'Tailwind CSS', 'TypeScript'],
            'Backend' => ['PHP', 'Laravel', 'Node.js', 'Python', 'Go', 'Ruby on Rails'],
            'Mobile' => ['React Native', 'Flutter', 'Swift', 'Kotlin'],
            'Design' => ['Figma', 'Adobe XD', 'Sketch'],
            'DevOps' => ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        ];

        foreach ($categories as $catName => $skills) {
            $category = SkillCategory::factory()->create([
                'name' => $catName,
                'slug' => \Illuminate\Support\Str::slug($catName),
            ]);

            foreach ($skills as $skillName) {
                Skill::factory()->create([
                    'name' => $skillName,
                    'slug' => \Illuminate\Support\Str::slug($skillName),
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}
