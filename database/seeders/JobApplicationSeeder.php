<?php

namespace Database\Seeders;

use App\Models\CandidateProfile;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Database\Seeder;

class JobApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $candidates = CandidateProfile::all();
        $jobs = Job::all();
        $challenges = Challenge::all();

        if ($candidates->isEmpty() || $jobs->isEmpty()) {
            return;
        }

        foreach ($candidates as $candidate) {
            // Apply to some jobs
            $randomJobs = $jobs->random(rand(1, 3));
            foreach ($randomJobs as $job) {
                JobApplication::factory()->create([
                    'job_id' => $job->id,
                    'candidate_profile_id' => $candidate->id,
                ]);
            }

            // Submit to some challenges
            if ($challenges->isNotEmpty()) {
                $randomChallenges = $challenges->random(rand(1, 3));
                foreach ($randomChallenges as $challenge) {
                    ChallengeSubmission::factory()->create([
                        'challenge_id' => $challenge->id,
                        'candidate_profile_id' => $candidate->id,
                    ]);
                }
            }
        }
    }
}
