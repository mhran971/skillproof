<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Submission;
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

        if (!Auth::user()->hasRole('candidate')) {
            abort(403, __('Only candidates can join challenges.'));
        }

        if (!$challenge->is_published) {
            abort(403, __('This challenge is not available.'));
        }

        if ($challenge->deadline && $challenge->deadline < now()) {
            abort(403, __('This challenge has expired.'));
        }

        $existingSubmission = Auth::user()->submissions()
            ->where('challenge_id', $challenge->id)
            ->first();

        if ($existingSubmission) {
            return redirect()->route('candidate.submissions.edit', $existingSubmission)
                ->with('info', __('You have already joined this challenge.'));
        }

        if ($challenge->max_participants) {
            $currentParticipants = $challenge->submissions()->where('status', '!=', 'draft')->count();
            if ($currentParticipants >= $challenge->max_participants) {
                abort(403, __('This challenge has reached the maximum number of participants.'));
            }
        }

        $submission = Submission::create([
            'challenge_id' => $challenge->id,
            'user_id' => Auth::id(),
            'title' => 'Draft: ' . $challenge->title,
            'description' => '',
            'status' => 'draft',
        ]);

        return redirect()->route('candidate.submissions.edit', $submission)
            ->with('success', __('Challenge joined successfully! Start working on your solution.'));
    }
}
