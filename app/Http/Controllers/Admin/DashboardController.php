<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Challenge;
use App\Models\Job;
use App\Models\Company;
use App\Models\ChallengeSubmission;
use App\Models\FraudAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_users' => User::count(),
            'total_candidates' => User::role('candidate')->count(),
            'total_companies' => User::role('company')->count(),
            'total_challenges' => Challenge::count(),
            'total_jobs' => Job::count(),
            'pending_submissions' => ChallengeSubmission::where('status', 'submitted')->count(),
            'pending_evaluations' => ChallengeSubmission::where('status', 'under_review')->count(),
            'fraud_alerts' => FraudAlert::where('status', 'open')->count(),
            'new_users_today' => User::whereDate('created_at', today())->count(),
            'new_users_this_week' => User::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];

        $recentUsers = User::with('roles')->latest()->take(10)->get()
            ->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->first()?->name,
                'is_active' => $user->is_active,
                'created_at' => $user->created_at->toISOString(),
            ]);

        $recentSubmissions = ChallengeSubmission::with(['challenge', 'candidateProfile.user'])
            ->latest()->take(10)->get()
            ->map(fn($sub) => [
                'id' => $sub->id,
                'challenge_title' => $sub->challenge->title,
                'candidate_name' => $sub->candidateProfile->user->name,
                'status' => $sub->status,
                'submitted_at' => $sub->submitted_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentSubmissions' => $recentSubmissions,
        ]);
    }
}
