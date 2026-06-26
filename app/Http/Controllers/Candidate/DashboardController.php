<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\ChallengeSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $profile = $request->user()->candidateProfile;

        if (!$profile) {
            abort(403, 'Candidate profile not found.');
        }

        $stats = [
            'profile_completion' => $profile->profile_completion,
            'reputation_score' => $profile->reputation_score,
            'job_readiness_score' => $profile->job_readiness_score,
            'total_submissions' => ChallengeSubmission::where('candidate_profile_id', $profile->id)->count(),
            'accepted_submissions' => ChallengeSubmission::where('candidate_profile_id', $profile->id)->where('status', 'accepted')->count(),
            'pending_applications' => 0, // Temporarily disabled until JobApplication table exists
        ];

        $recentSubmissions = ChallengeSubmission::with('challenge')
            ->where('candidate_profile_id', $profile->id)
            ->latest()->take(5)->get()
            ->map(fn($sub) => [
                'id' => $sub->id,
                'challenge_title' => $sub->challenge->title,
                'status' => $sub->status,
                'final_score' => $sub->final_score,
                'submitted_at' => $sub->submitted_at?->toISOString(),
            ]);

        return Inertia::render('Candidate/Dashboard', [
            'stats' => $stats,
            'recentSubmissions' => $recentSubmissions,
        ]);
    }
}
