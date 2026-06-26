<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Submission;
use App\Models\Evaluation;
use Illuminate\Http\Request;
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
            'total_submissions' => Submission::whereIn('challenge_id', $challengeIds)->count(),
            'pending_review' => Submission::whereIn('challenge_id', $challengeIds)->where('status', 'submitted')->count(),
            'under_review' => Submission::whereIn('challenge_id', $challengeIds)->where('status', 'under_review')->count(),
            'accepted_count' => Submission::whereIn('challenge_id', $challengeIds)->where('status', 'accepted')->count(),
            'average_score' => Evaluation::whereHas('submission', function ($q) use ($challengeIds) {
                $q->whereIn('challenge_id', $challengeIds);
            })->avg('score') ?? 0,
        ];

        $recentSubmissions = Submission::with(['user:id,name,email,avatar', 'challenge:id,title,slug'])
            ->whereIn('challenge_id', $challengeIds)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($sub) => [
                'id' => $sub->id,
                'title' => $sub->title,
                'candidate_name' => $sub->user->name,
                'candidate_avatar' => $sub->user->avatar,
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
