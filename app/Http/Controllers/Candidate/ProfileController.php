<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\CandidateProfile;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user();
        $user->load('candidateProfile', 'skills:id,name,category_id');

        return Inertia::render('Candidate/Profile/Edit', [
            'user' => $user,
            'allSkills' => Skill::where('is_active', true)->with('category:id,name')->get(),
            'experienceLevels' => ['entry', 'junior', 'mid', 'senior', 'lead'],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:50|alpha_dash|unique:users,username,' . $user->id,
            'avatar' => 'nullable|image|max:2048',
            'professional_headline' => 'nullable|string|max:255',
            'bio' => 'nullable|string|max:5000',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:500',
            'github_url' => 'nullable|url|max:500',
            'linkedin_url' => 'nullable|url|max:500',
            'experience_level' => 'required|string|in:entry,junior,mid,senior,lead',
            'is_public' => 'boolean',
            'is_available' => 'boolean',
            'skills' => 'nullable|array',
            'skills.*' => 'exists:skills,id',
        ]);

        // Update user basic info
        $user->update([
            'name' => $validated['name'],
            'username' => $validated['username'],
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => $avatarPath]);
        }

        // Update or create candidate profile
        $profileData = [
            'professional_headline' => $validated['professional_headline'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'location' => $validated['location'] ?? null,
            'website' => $validated['website'] ?? null,
            'github_url' => $validated['github_url'] ?? null,
            'linkedin_url' => $validated['linkedin_url'] ?? null,
            'experience_level' => $validated['experience_level'],
            'is_public' => $validated['is_public'] ?? true,
            'is_available' => $validated['is_available'] ?? true,
        ];

        // Calculate profile completion
        $filledFields = collect($profileData)->filter(fn ($value) => !is_null($value) && $value !== '')->count();
        $totalFields = count($profileData);
        $profileData['profile_completion'] = min(100, round(($filledFields / $totalFields) * 100));

        if ($user->candidateProfile) {
            $user->candidateProfile->update($profileData);
        } else {
            $user->candidateProfile()->create($profileData);
        }

        // Sync skills
        if (isset($validated['skills'])) {
            $user->skills()->sync($validated['skills']);
        }

        return redirect()->route('candidate.profile.edit')
            ->with('success', __('Profile updated successfully.'));
    }
}