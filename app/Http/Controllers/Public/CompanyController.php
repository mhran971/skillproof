<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PublicCompanyResource;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = Company::withCount('challenges')
            ->whereHas('user', fn ($q) => $q->where('is_active', true));

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('industry', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($industry = $request->input('industry')) {
            $query->where('industry', $industry);
        }

        return Inertia::render('Public/Companies/Index', [
            'companies' => PublicCompanyResource::collection(
                $query->orderByDesc('challenges_count')->paginate(16)->withQueryString()
            ),
            'filters' => $request->only(['search', 'industry']),
            'industries' => Company::whereNotNull('industry')->distinct()->pluck('industry'),
        ]);
    }

    public function show(string $slug)
    {
        $company = Company::with([
            'user:id,name,email',
            'challenges' => fn ($q) => $q
                ->where('is_published', true)
                ->where(function ($q) {
                    $q->whereNull('deadline')->orWhere('deadline', '>', now());
                })
                ->with('requiredSkills:id,name')
                ->latest()
                ->take(6),
        ])
        ->where('slug', $slug)
        ->firstOrFail();

        $stats = [
            'total_challenges' => $company->challenges()->count(),
            'active_challenges' => $company->challenges()
                ->where('is_published', true)
                ->where(function ($q) {
                    $q->whereNull('deadline')->orWhere('deadline', '>', now());
                })->count(),
            'total_submissions' => $company->challenges()->withCount('submissions')->get()->sum('submissions_count'),
            'accepted_candidates' => \App\Models\Submission::whereHas('challenge', fn ($q) => $q->where('company_id', $company->id))
                ->where('status', 'accepted')
                ->count(),
        ];

        return Inertia::render('Public/Companies/Show', [
            'company' => new PublicCompanyResource($company),
            'stats' => $stats,
        ]);
    }
}