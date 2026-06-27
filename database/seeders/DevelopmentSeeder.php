<?php

namespace Database\Seeders;

use App\Models\CandidateProfile;
use App\Models\Challenge;
use App\Models\ChallengeCategory;
use App\Models\ChallengeSubmission;
use App\Models\Company;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\Skill;
use App\Models\SkillCategory;
use App\Models\SubmissionReview;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DevelopmentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        $skillCategories = SkillCategory::factory()->count(5)->create();
        $challengeCategories = ChallengeCategory::factory()->count(3)->create();

        // 2. Skills
        $skills = collect();
        foreach ($skillCategories as $category) {
            $skills = $skills->concat(
                Skill::factory()->count(4)->create(['category_id' => $category->id])
            );
        }

        // 3. Companies & Their Users
        $companies = Company::factory()->count(5)->create()->each(function ($company) {
            $company->user->assignRole('company');
        });

        // 4. Candidates
        $candidates = CandidateProfile::factory()->count(20)->create()->each(function ($profile) use ($skills) {
            $profile->user->assignRole('candidate');
            // Attach some random skills
            $profile->user->skills()->attach(
                $skills->random(rand(2, 5))->pluck('id'),
                ['proficiency_level' => rand(1, 5)]
            );
        });

        // 5. Challenges
        $challenges = collect();
        foreach ($companies as $company) {
            $challenges = $challenges->concat(
                Challenge::factory()->count(3)->create([
                    'company_id' => $company->id,
                ])->each(function ($challenge) use ($skills) {
                    $challenge->requiredSkills()->attach($skills->random(rand(2, 4))->pluck('id'));
                })
            );
        }

        // 6. Jobs
        foreach ($companies as $company) {
            Job::factory()->count(2)->create(['company_id' => $company->id]);
        }

        // 7. Submissions & Reviews
        foreach ($challenges as $challenge) {
            // Select some random candidates to submit
            $submittingCandidates = $candidates->random(rand(2, 8));
            foreach ($submittingCandidates as $candidate) {
                $submission = ChallengeSubmission::factory()->create([
                    'challenge_id' => $challenge->id,
                    'candidate_profile_id' => $candidate->id,
                ]);

                if ($submission->status !== 'draft') {
                    // Add a review
                    SubmissionReview::factory()->create([
                        'submission_id' => $submission->id,
                        'reviewer_id' => $challenge->company->user_id,
                        'is_final' => in_array($submission->status, ['accepted', 'rejected', 'evaluated']),
                    ]);
                }
            }
        }

        // 8. Job Applications
        $jobs = Job::all();
        foreach ($candidates as $candidate) {
            $applyingJobs = $jobs->random(rand(1, 3));
            foreach ($applyingJobs as $job) {
                JobApplication::factory()->create([
                    'job_id' => $job->id,
                    'candidate_profile_id' => $candidate->id,
                ]);
            }
        }
    }
}
