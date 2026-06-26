<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $company = auth()->user()->company;

        if (!$company) {
            abort(403, 'No company profile found.');
        }

        $challenges = Challenge::where('company_id', $company->id);
        $challengeIds = (clone $challenges)->pluck('id');

        $stats = [
            'total_challenges' => (clone $challenges)->count(),
            'published_challenges' => (clone $challenges)->where('is_published', true)->count(),
            'total_submissions' => ChallengeSubmission::whereIn('challenge_id', $challengeIds)->count(),
            'pending_review' => ChallengeSubmission::whereIn('challenge_id', $challengeIds)->where('status', 'submitted')->count(),
            'under_review' => ChallengeSubmission::whereIn('challenge_id', $challengeIds)->where('status', 'under_review')->count(),
            'accepted_count' => ChallengeSubmission::whereIn('challenge_id', $challengeIds)->where('status', 'accepted')->count(),
            'average_score' => ChallengeSubmission::whereIn('challenge_id', $challengeIds)->avg('final_score') ?? 0,
        ];

        $recentSubmissions = ChallengeSubmission::with(['candidateProfile.user:id,name,email,avatar', 'challenge:id,title,slug'])
            ->whereIn('challenge_id', $challengeIds)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($sub) => [
                'id' => $sub->id,
                'title' => $sub->challenge->title, // ChallengeSubmission doesn't have a title, using challenge title
                'candidate_name' => $sub->candidateProfile->user->name,
                'candidate_avatar' => $sub->candidateProfile->user->avatar,
                'challenge_title' => $sub->challenge->title,
                'challenge_slug' => $sub->challenge->slug,
                'status' => $sub->status,
                'status_label' => match($sub->status) {
                    'draft' => 'Draft',
                    'submitted' => 'Submitted',
                    'under_review' => 'Under Review',
                    'evaluated' => 'Evaluated',
                    'accepted' => 'Accepted',
                    'rejected' => 'Rejected',
                    default => ucfirst($sub->status),
                },
                'submitted_at' => $sub->submitted_at,
            ]);

        $topChallenges = Challenge::where('company_id', $company->id)
            ->withCount('submissions')
            ->orderByDesc('submissions_count')
            ->take(5)
            ->get()
            ->map(fn ($ch) => [
                'id' => $ch->id,
                'title' => $ch->title,
                'slug' => $ch->slug,
                'submissions_count' => $ch->submissions_count,
                'is_published' => $ch->is_published,
            ]);

        return Inertia::render('Company/Dashboard', [
            'stats' => $stats,
            'recentSubmissions' => $recentSubmissions,
            'topChallenges' => $topChallenges,
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'logo' => $company->logo,
            ],
        ]);
    }
}
