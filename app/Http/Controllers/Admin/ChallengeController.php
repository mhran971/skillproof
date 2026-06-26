<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $query = Challenge::with(['company:id,name', 'requiredSkills:id,name']);

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($status = $request->input('status')) {
            $query->where('is_published', $status === 'published');
        }

        return Inertia::render('Admin/Challenges/Index', [
            'challenges' => $query->latest()->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Challenge $challenge)
    {
        $challenge->load(['company', 'requiredSkills', 'submissions' => fn ($q) => $q->latest()->take(10)]);

        return Inertia::render('Admin/Challenges/Show', [
            'challenge' => $challenge,
        ]);
    }

    public function togglePublish(Challenge $challenge)
    {
        $challenge->update(['is_published' => !$challenge->is_published]);

        return redirect()->back()->with('success',
            $challenge->is_published
                ? __('Challenge published.')
                : __('Challenge unpublished.'));
    }

    public function destroy(Challenge $challenge)
    {
        $challenge->delete();

        return redirect()->route('admin.challenges.index')
            ->with('success', __('Challenge deleted successfully.'));
    }
}
