<?php
namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index()
    {
        $submissions = Auth::user()->submissions()
            ->with(['challenge:id,title,slug,company_id', 'challenge.company:id,name,logo,slug', 'evaluations' => fn ($q) => $q->where('is_final', true)])
            ->latest()
            ->paginate(12);

        return Inertia::render('Candidate/Submissions/Index', [
            'submissions' => $submissions,
            'statuses' => ['draft', 'submitted', 'under_review', 'accepted', 'rejected'],
        ]);
    }

    public function show(Submission $submission)
    {
        $this->authorize('view', $submission);

        $submission->load([
            'challenge',
            'challenge.company:id,name,logo,slug',
            'evaluations.evaluator:id,name',
            'files',
        ]);

        return Inertia::render('Candidate/Submissions/Show', [
            'submission' => $submission,
        ]);
    }

    public function create(Challenge $challenge)
    {
        // Check if user already has a submission for this challenge
        $existingSubmission = Auth::user()->submissions()
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'solution_url' => 'nullable|url|max:500',
            'repository_url' => 'nullable|url|max:500',
            'files.*' => 'nullable|file|max:10240', // 10MB max per file
        ]);

        $submission = Submission::create([
            'challenge_id' => $challenge->id,
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'solution_url' => $validated['solution_url'] ?? null,
            'repository_url' => $validated['repository_url'] ?? null,
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

    public function edit(Submission $submission)
    {
        $this->authorize('update', $submission);

        if ($submission->status !== 'draft') {
            return redirect()->route('candidate.submissions.show', $submission)
                ->with('error', __('Only draft submissions can be edited.'));
        }

        $submission->load(['challenge', 'files', 'challenge.company:id,name,logo,slug']);

        return Inertia::render('Candidate/Submissions/Edit', [
            'submission' => $submission,
        ]);
    }

    public function update(Request $request, Submission $submission)
    {
        $this->authorize('update', $submission);

        if ($submission->status !== 'draft') {
            abort(403, 'Only draft submissions can be updated.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'solution_url' => 'nullable|url|max:500',
            'repository_url' => 'nullable|url|max:500',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $submission->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'solution_url' => $validated['solution_url'] ?? null,
            'repository_url' => $validated['repository_url'] ?? null,
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

    public function destroy(Submission $submission)
    {
        $this->authorize('delete', $submission);

        // Delete associated files from storage
        foreach ($submission->files as $file) {
            Storage::disk('public')->delete($file->file_path);
        }

        $submission->delete();

        return redirect()->route('candidate.submissions.index')
            ->with('success', __('Submission deleted successfully.'));
    }

    public function submit(Submission $submission)
    {
        $this->authorize('update', $submission);

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