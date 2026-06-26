<?php
namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\ChallengeSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index()
    {
        $profile = Auth::user()->candidateProfile;
        if (!$profile) abort(403, 'Candidate profile not found.');

        $submissions = ChallengeSubmission::where('candidate_profile_id', $profile->id)
            ->with(['challenge:id,title,slug,company_id', 'challenge.company:id,name,logo,slug', 'reviews' => fn ($q) => $q->where('is_final', true)])
            ->latest()
            ->paginate(12);

        return Inertia::render('Candidate/Submissions/Index', [
            'submissions' => $submissions,
            'statuses' => ['draft', 'submitted', 'under_review', 'evaluated', 'accepted', 'rejected'],
        ]);
    }

    public function show(ChallengeSubmission $submission)
    {
        $profile = Auth::user()->candidateProfile;
        if (!$profile || $submission->candidate_profile_id !== $profile->id) { abort(403); }

        $submission->load([
            'challenge',
            'challenge.company:id,name,logo,slug',
            'reviews.reviewer:id,name',
            'files',
        ]);

        return Inertia::render('Candidate/Submissions/Show', [
            'submission' => $submission,
        ]);
    }

    public function create(Challenge $challenge)
    {
        $profile = Auth::user()->candidateProfile;
        if (!$profile) abort(403, 'Candidate profile not found.');

        // Check if user already has a submission for this challenge
        $existingSubmission = ChallengeSubmission::where('candidate_profile_id', $profile->id)
            ->where('challenge_id', $challenge->id)
            ->first();

        if ($existingSubmission) {
            return redirect()->route('candidate.submissions.edit', $existingSubmission);
        }

        return Inertia::render('Candidate/Submissions/Create', [
            'challenge' => $challenge->load('requiredSkills:id,name', 'company:id,name,logo,slug'),
        ]);
    }

    public function store(Request $request, Challenge $challenge)
    {
        $profile = Auth::user()->candidateProfile;
        if (!$profile) abort(403, 'Candidate profile not found.');

        $validated = $request->validate([
            'github_url' => 'nullable|url|max:255',
            'live_url' => 'nullable|url|max:255',
            'document_url' => 'nullable|url|max:255',
            'notes' => 'nullable|string',
            'files.*' => 'nullable|file|max:10240', // 10MB max per file
        ]);

        $submission = ChallengeSubmission::create([
            'challenge_id' => $challenge->id,
            'candidate_profile_id' => $profile->id,
            'github_url' => $validated['github_url'] ?? null,
            'live_url' => $validated['live_url'] ?? null,
            'document_url' => $validated['document_url'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => $request->boolean('submit_now') ? 'submitted' : 'draft',
            'submitted_at' => $request->boolean('submit_now') ? now() : null,
        ]);

        // Handle file uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('submissions/' . $submission->id, 'public');
                $submission->files()->create([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        $message = $request->boolean('submit_now')
            ? __('Submission submitted successfully.')
            : __('Draft saved successfully.');

        return redirect()->route('candidate.submissions.index')
            ->with('success', $message);
    }

    public function edit(ChallengeSubmission $submission)
    {
        $profile = Auth::user()->candidateProfile;
        if (!$profile || $submission->candidate_profile_id !== $profile->id) { abort(403); }

        if ($submission->status !== 'draft') {
            return redirect()->route('candidate.submissions.show', $submission)
                ->with('error', __('Only draft submissions can be edited.'));
        }

        $submission->load(['challenge', 'files', 'challenge.company:id,name,logo,slug']);

        return Inertia::render('Candidate/Submissions/Edit', [
            'submission' => $submission,
        ]);
    }

    public function update(Request $request, ChallengeSubmission $submission)
    {
        $profile = Auth::user()->candidateProfile;
        if (!$profile || $submission->candidate_profile_id !== $profile->id) { abort(403); }

        if ($submission->status !== 'draft') {
            abort(403, 'Only draft submissions can be updated.');
        }

        $validated = $request->validate([
            'github_url' => 'nullable|url|max:255',
            'live_url' => 'nullable|url|max:255',
            'document_url' => 'nullable|url|max:255',
            'notes' => 'nullable|string',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $submission->update([
            'github_url' => $validated['github_url'] ?? null,
            'live_url' => $validated['live_url'] ?? null,
            'document_url' => $validated['document_url'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => $request->boolean('submit_now') ? 'submitted' : 'draft',
            'submitted_at' => $request->boolean('submit_now') ? now() : $submission->submitted_at,
        ]);

        // Handle new file uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('submissions/' . $submission->id, 'public');
                $submission->files()->create([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        $message = $request->boolean('submit_now')
            ? __('Submission submitted successfully.')
            : __('Draft updated successfully.');

        return redirect()->route('candidate.submissions.index')
            ->with('success', $message);
    }

    public function destroy(ChallengeSubmission $submission)
    {
        $profile = Auth::user()->candidateProfile;
        if (!$profile || $submission->candidate_profile_id !== $profile->id) { abort(403); }

        // Delete associated files from storage
        foreach ($submission->files as $file) {
            Storage::disk('public')->delete($file->file_path);
        }

        $submission->delete();

        return redirect()->route('candidate.submissions.index')
            ->with('success', __('Submission deleted successfully.'));
    }

    public function submit(ChallengeSubmission $submission)
    {
        $profile = Auth::user()->candidateProfile;
        if (!$profile || $submission->candidate_profile_id !== $profile->id) { abort(403); }

        if ($submission->status !== 'draft') {
            return redirect()->back()->with('error', __('Only draft submissions can be submitted.'));
        }

        $submission->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return redirect()->route('candidate.submissions.index')
            ->with('success', __('Submission submitted successfully.'));
    }
}
