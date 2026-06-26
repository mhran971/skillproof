<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicChallengeResource;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $query = Challenge::with(['company:id,name,logo,slug', 'requiredSkills:id,name'])
            ->where('is_published', true)
            ->where(function ($q) {
                $q->whereNull('deadline')->orWhere('deadline', '>', now());
            });

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('company', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        // Difficulty filter
        if ($difficulty = $request->input('difficulty')) {
            $query->where('difficulty_level', $difficulty);
        }

        // Skills filter
        if ($skills = $request->input('skills')) {
            $skillIds = is_array($skills) ? $skills : explode(',', $skills);
            $query->whereHas('requiredSkills', fn ($q) => $q->whereIn('skills.id', $skillIds));
        }

        // Company filter
        if ($companyId = $request->input('company')) {
            $query->where('company_id', $companyId);
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        match ($sort) {
            'popular' => $query->withCount('submissions')->orderByDesc('submissions_count'),
            'deadline' => $query->orderByRaw('ISNULL(deadline), deadline ASC'),
            default => $query->latest(),
        };

        return Inertia::render('Public/Challenges/Index', [
            'challenges' => PublicChallengeResource::collection(
                $query->paginate(12)->withQueryString()
            ),
            'filters' => $request->only(['search', 'difficulty', 'skills', 'company', 'sort']),
            'difficultyLevels' => ['beginner', 'intermediate', 'advanced', 'expert'],
            'allSkills' => Skill::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function show(string $slug)
    {
        $challenge = Challenge::with([
            'company:id,name,logo,slug,description,website,location',
            'requiredSkills:id,name',
            'submissions' => fn ($q) => $q->where('status', 'accepted')->with('candidateProfile.user:id,name,avatar')->take(5),
        ])
        ->where('is_published', true)
        ->where(function ($q) {
            $q->whereNull('deadline')->orWhere('deadline', '>', now());
        })
        ->where('slug', $slug)
        ->firstOrFail();

        $hasSubmitted = false;
        $userSubmission = null;

        if (auth()->check() && auth()->user()->hasRole('candidate')) {
            $profile = auth()->user()->candidateProfile;
            if ($profile) {
                $userSubmission = ChallengeSubmission::where('candidate_profile_id', $profile->id)
                    ->where('challenge_id', $challenge->id)
                    ->first(['id', 'status']);

                $hasSubmitted = $userSubmission !== null;
            }
        }

        $stats = [
            'total_submissions' => $challenge->submissions()->where('status', '!=', 'draft')->count(),
            'accepted_count' => $challenge->submissions()->where('status', 'accepted')->count(),
            'avg_score' => $challenge->submissions()
                ->whereNotNull('final_score')
                ->avg('final_score') ?? 0,
        ];

        return Inertia::render('Public/Challenges/Show', [
            'challenge' => new PublicChallengeResource($challenge),
            'hasSubmitted' => $hasSubmitted,
            'userSubmission' => $userSubmission,
            'stats' => $stats,
        ]);
    }
}
