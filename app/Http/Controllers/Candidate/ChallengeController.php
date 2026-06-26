<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChallengeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $profile = $user->candidateProfile;
        if (!$profile) abort(403, 'Candidate profile not found.');

        $joinedChallengeIds = ChallengeSubmission::where('candidate_profile_id', $profile->id)
            ->pluck('challenge_id')
            ->toArray();

        $availableChallenges = Challenge::with(['company:id,name,logo,slug', 'requiredSkills:id,name'])
            ->where('is_published', true)
            ->where(function ($q) {
                $q->whereNull('deadline')->orWhere('deadline', '>', now());
            })
            ->whereNotIn('id', $joinedChallengeIds)
            ->latest()
            ->take(10)
            ->get();

        $myChallenges = ChallengeSubmission::where('candidate_profile_id', $profile->id)
            ->with(['challenge:id,title,slug,company_id', 'challenge.company:id,name,logo,slug'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Candidate/Challenges/Index', [
            'availableChallenges' => $availableChallenges,
            'myChallenges' => $myChallenges,
        ]);
    }

    public function show(Challenge $challenge)
    {
        $challenge->load(['company:id,name,logo,slug,description,website,location', 'requiredSkills:id,name']);
        $user = Auth::user();
        $profile = $user->candidateProfile;

        $submission = $profile ? ChallengeSubmission::where('candidate_profile_id', $profile->id)
            ->where('challenge_id', $challenge->id)
            ->first() : null;

        return Inertia::render('Candidate/Challenges/Show', [
            'challenge' => $challenge,
            'submission' => $submission,
        ]);
    }

    public function join(Challenge $challenge)
    {
        // Check if challenge is available
        if (!$challenge->is_published) {
            abort(403, 'This challenge is not available.');
        }

        if ($challenge->deadline && $challenge->deadline < now()) {
            abort(403, 'This challenge has expired.');
        }

        $user = Auth::user();
        $profile = $user->candidateProfile;
        if (!$profile) abort(403, 'Candidate profile not found.');

        // Check if user already joined
        $existingChallengeSubmission = ChallengeSubmission::where('candidate_profile_id', $profile->id)
            ->where('challenge_id', $challenge->id)
            ->first();

        if ($existingChallengeSubmission) {
            return redirect()->route('candidate.submissions.edit', $existingChallengeSubmission)
                ->with('info', __('You have already joined this challenge.'));
        }

        // Check max participants
        if ($challenge->max_participants) {
            $currentParticipants = $challenge->submissions()->where('status', '!=', 'draft')->count();
            if ($currentParticipants >= $challenge->max_participants) {
                abort(403, 'This challenge has reached the maximum number of participants.');
            }
        }

        // Create draft submission
        $submission = ChallengeSubmission::create([
            'challenge_id' => $challenge->id,
            'candidate_profile_id' => $profile->id,
            'status' => 'draft',
        ]);

        return redirect()->route('candidate.submissions.edit', $submission)
            ->with('success', __('You have joined the challenge. Start working on your solution!'));
    }
}
