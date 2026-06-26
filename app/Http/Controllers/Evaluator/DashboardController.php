<?php

namespace App\Http\Controllers\Evaluator;

use App\Http\Controllers\Controller;
use App\Models\ChallengeSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $pendingReviews = ChallengeSubmission::where('status', 'submitted')
            ->orWhere('status', 'under_review')
            ->count();

        $myReviews = ChallengeSubmission::whereHas('reviews', fn($q) => $q->where('reviewer_id', $request->user()->id))
            ->count();

        return Inertia::render('Evaluator/Dashboard', [
            'stats' => [
                'pending_reviews' => $pendingReviews,
                'my_reviews' => $myReviews,
            ],
        ]);
    }
}
