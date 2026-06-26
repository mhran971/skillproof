<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\StoreChallengeRequest;
use App\Http\Requests\Company\UpdateChallengeRequest;
use App\Http\Resources\CompanyChallengeResource;
use App\Models\Challenge;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $company = $user->company;
        if (!$company) abort(403);

        $query = Challenge::with(['requiredSkills', 'submissions'])
            ->where('company_id', $company->id)
            ->latest();

        if ($status = $request->input('status')) {
            $query->where('is_published', $status === 'published');
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Company/Challenges/Index', [
            'challenges' => CompanyChallengeResource::collection(
                $query->paginate(10)->withQueryString()
            ),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $company = $user->company;
        if (!$company) abort(403);

        return Inertia::render('Company/Challenges/Create', [
            'availableSkills' => Skill::where('is_active', true)->get(['id', 'name']),
            'difficulty_levels' => ['beginner', 'intermediate', 'advanced', 'expert'],
        ]);
    }

    public function store(StoreChallengeRequest $request)
    {
        $user = Auth::user();
        $company = $user->company;
        if (!$company) abort(403);

        $challenge = Challenge::create([
            'company_id' => $company->id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . uniqid(),
            'description' => $request->description,
            'requirements' => $request->requirements,
            'deliverables' => $request->deliverables,
            'evaluation_criteria' => $request->evaluation_criteria,
            'difficulty_level' => $request->difficulty_level,
            'duration_hours' => $request->duration_hours,
            'deadline' => $request->deadline,
            'max_participants' => $request->max_participants,
            'is_published' => $request->boolean('is_published', false),
            'reward_description' => $request->reward_description,
        ]);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('challenges/' . $challenge->id, 'public');
            $challenge->update(['attachment_path' => $path]);
        }

        if ($request->has('required_skills')) {
            $challenge->requiredSkills()->sync($request->required_skills);
        }

        return redirect()->route('company.challenges.index')
            ->with('success', 'Challenge created successfully.');
    }

    public function show(Challenge $challenge)
    {
        $user = Auth::user();
        if (!$user->company || $challenge->company_id !== $user->company->id) { abort(403); }

        return Inertia::render('Company/Challenges/Show', [
            'challenge' => new CompanyChallengeResource($challenge->load([
                'requiredSkills', 'submissions.user', 'submissions.evaluations'
            ])),
        ]);
    }

    public function edit(Challenge $challenge)
    {
        $user = Auth::user();
        if (!$user->company || $challenge->company_id !== $user->company->id) { abort(403); }

        return Inertia::render('Company/Challenges/Edit', [
            'challenge' => new CompanyChallengeResource($challenge->load('requiredSkills')),
            'availableSkills' => Skill::where('is_active', true)->get(['id', 'name']),
            'difficulty_levels' => ['beginner', 'intermediate', 'advanced', 'expert'],
        ]);
    }

    public function update(UpdateChallengeRequest $request, Challenge $challenge)
    {
        $user = Auth::user();
        if (!$user->company || $challenge->company_id !== $user->company->id) { abort(403); }

        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'requirements' => $request->requirements,
            'deliverables' => $request->deliverables,
            'evaluation_criteria' => $request->evaluation_criteria,
            'difficulty_level' => $request->difficulty_level,
            'duration_hours' => $request->duration_hours,
            'deadline' => $request->deadline,
            'max_participants' => $request->max_participants,
            'is_published' => $request->boolean('is_published', false),
            'reward_description' => $request->reward_description,
        ];

        if ($request->hasFile('attachment')) {
            if ($challenge->attachment_path && Storage::disk('public')->exists($challenge->attachment_path)) {
                Storage::disk('public')->delete($challenge->attachment_path);
            }
            $data['attachment_path'] = $request->file('attachment')->store('challenges/' . $challenge->id, 'public');
        }

        $challenge->update($data);

        if ($request->has('required_skills')) {
            $challenge->requiredSkills()->sync($request->required_skills);
        }

        return redirect()->route('company.challenges.index')
            ->with('success', 'Challenge updated successfully.');
    }

    public function destroy(Challenge $challenge)
    {
        $user = Auth::user();
        if (!$user->company || $challenge->company_id !== $user->company->id) { abort(403); }

        if ($challenge->attachment_path && Storage::disk('public')->exists($challenge->attachment_path)) {
            Storage::disk('public')->delete($challenge->attachment_path);
        }

        $challenge->delete();

        return redirect()->route('company.challenges.index')
            ->with('success', 'Challenge deleted successfully.');
    }

    public function togglePublish(Challenge $challenge)
    {
        $user = Auth::user();
        if (!$user->company || $challenge->company_id !== $user->company->id) { abort(403); }

        $challenge->update(['is_published' => !$challenge->is_published]);

        return back()->with('success', $challenge->is_published ? 'Challenge published.' : 'Challenge unpublished.');
    }
}