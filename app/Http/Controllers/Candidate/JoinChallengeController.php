<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class JoinChallengeController extends Controller
{
    public function __invoke(Challenge $challenge): RedirectResponse
    {
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('info', __('Please log in to join this challenge.'));
        }

        $user = Auth::user();
        if (!$user->hasRole('candidate')) {
            abort(403, __('Only candidates can join challenges.'));
        }

        $profile = $user->candidateProfile;
        if (!$profile) abort(403, 'Candidate profile not found.');

        if (!$challenge->is_published) {
            abort(403, __('This challenge is not available.'));
        }

        if ($challenge->deadline && $challenge->deadline < now()) {
            abort(403, __('This challenge has expired.'));
        }

        $existingChallengeSubmission = ChallengeSubmission::where('candidate_profile_id', $profile->id)
            ->where('challenge_id', $challenge->id)
            ->first();

        if ($existingChallengeSubmission) {
            return redirect()->route('candidate.submissions.edit', $existingChallengeSubmission)
                ->with('info', __('You have already joined this challenge.'));
        }

        if ($challenge->max_participants) {
            $currentParticipants = $challenge->submissions()->where('status', '!=', 'draft')->count();
            if ($currentParticipants >= $challenge->max_participants) {
                abort(403, __('This challenge has reached the maximum number of participants.'));
            }
        }

        $submission = ChallengeSubmission::create([
            'challenge_id' => $challenge->id,
            'candidate_profile_id' => $profile->id,
            'status' => 'draft',
        ]);

        return redirect()->route('candidate.submissions.edit', $submission)
            ->with('success', __('Challenge joined successfully! Start working on your solution.'));
    }
}
