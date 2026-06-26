<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Submission;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChallengeController extends Controller
{
    public function index()
    {
        $joinedChallengeIds = Auth::user()->submissions()
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

        $myChallenges = Auth::user()->submissions()
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

        $submission = Auth::user()->submissions()
            ->where('challenge_id', $challenge->id)
            ->first();

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

        // Check if user already joined
        $existingSubmission = Auth::user()->submissions()
            ->where('challenge_id', $challenge->id)
            ->first();

        if ($existingSubmission) {
            return redirect()->route('candidate.submissions.edit', $existingSubmission)
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
        $submission = Submission::create([
            'challenge_id' => $challenge->id,
            'user_id' => Auth::id(),
            'title' => 'Draft: ' . $challenge->title,
            'description' => '',
            'status' => 'draft',
        ]);

        return redirect()->route('candidate.submissions.edit', $submission)
            ->with('success', __('You have joined the challenge. Start working on your solution!'));
    }
}