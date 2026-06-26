<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicCandidateResource;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $query = User::role('candidate')
            ->with(['candidateProfile', 'skills:id,name'])
            ->whereHas('candidateProfile', fn ($q) => $q->where('is_public', true));

        // Search by name
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Skills filter
        if ($skills = $request->input('skills')) {
            $skillIds = is_array($skills) ? $skills : explode(',', $skills);
            $query->whereHas('skills', fn ($q) => $q->whereIn('skills.id', $skillIds));
        }

        // Experience level
        if ($level = $request->input('level')) {
            $query->whereHas('candidateProfile', fn ($q) => $q->where('experience_level', $level));
        }

        // Availability
        if ($available = $request->input('available')) {
            $query->whereHas('candidateProfile', fn ($q) => $q->where('is_available', true));
        }

        // Sort
        $sort = $request->input('sort', 'reputation');
        match ($sort) {
            'newest' => $query->latest(),
            'name' => $query->orderBy('name'),
            default => $query->orderByDesc(
                fn ($q) => $q->select('reputation_score')->from('candidate_profiles')->whereColumn('user_id', 'users.id')
            ),
        };

        return Inertia::render('Public/Candidates/Index', [
            'candidates' => PublicCandidateResource::collection(
                $query->paginate(16)->withQueryString()
            ),
            'filters' => $request->only(['search', 'skills', 'level', 'available', 'sort']),
            'allSkills' => Skill::where('is_active', true)->get(['id', 'name']),
            'experienceLevels' => ['entry', 'junior', 'mid', 'senior', 'lead'],
        ]);
    }

    public function show(string $username)
    {
        $candidate = User::role('candidate')
            ->with([
                'candidateProfile',
                'skills:id,name,category_id',
                'skills.category:id,name',
                'submissions' => fn ($q) => $q
                    ->where('status', 'accepted')
                    ->with(['challenge:id,title,slug,company_id', 'challenge.company:id,name,logo,slug', 'evaluations:id,submission_id,score'])
                    ->latest()
                    ->take(6),
            ])
            ->where('username', $username)
            ->whereHas('candidateProfile', fn ($q) => $q->where('is_public', true))
            ->firstOrFail();

        $stats = [
            'completed_challenges' => $candidate->submissions()->where('status', 'accepted')->count(),
            'total_submissions' => $candidate->submissions()->where('status', '!=', 'draft')->count(),
            'avg_score' => $candidate->submissions()
                ->whereHas('evaluations', fn ($q) => $q->where('is_final', true))
                ->withAvg('evaluations as avg_score', 'score')
                ->value('avg_score') ?? 0,
            'reputation' => $candidate->candidateProfile?->reputation_score ?? 0,
        ];

        return Inertia::render('Public/Candidates/Show', [
            'candidate' => new PublicCandidateResource($candidate),
            'stats' => $stats,
        ]);
    }
}