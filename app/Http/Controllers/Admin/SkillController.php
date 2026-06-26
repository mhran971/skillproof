<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use App\Models\SkillCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SkillController extends Controller
{
    public function index(Request $request)
    {
        $query = Skill::with('category:id,name');

        if ($search = $request->input('search')) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($category = $request->input('category')) {
            $query->where('category_id', $category);
        }

        return Inertia::render('Admin/Skills/Index', [
            'skills' => $query->latest()->paginate(20)->withQueryString(),
            'categories' => SkillCategory::all(['id', 'name']),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:skills,name',
            'category_id' => 'required|exists:skill_categories,id',
            'description' => 'nullable|string|max:500',
        ]);

        Skill::create([
            ...$validated,
            'slug' => Str::slug($validated['name']),
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', __('Skill created successfully.'));
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:skills,name,' . $skill->id,
            'category_id' => 'required|exists:skill_categories,id',
            'description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $skill->update([
            ...$validated,
            'slug' => Str::slug($validated['name']),
        ]);

        return redirect()->back()->with('success', __('Skill updated successfully.'));
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();

        return redirect()->back()->with('success', __('Skill deleted successfully.'));
    }
}