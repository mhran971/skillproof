<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\EvaluateSubmissionRequest;
use App\Http\Resources\CompanySubmissionResource;
use App\Http\Resources\EvaluationResource;
use App\Models\Challenge;
use App\Models\Evaluation;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $company = $user->company;
        if (!$company) abort(403);

        $challengeIds = Challenge::where('company_id', $company->id)->pluck('id');

        $query = Submission::with(['user:id,name,email,avatar', 'challenge:id,title,slug', 'evaluations'])
            ->whereIn('challenge_id', $challengeIds)
            ->where('status', '!=', 'draft')
            ->latest();

        if ($challengeId = $request->input('challenge')) {
            $query->where('challenge_id', $challengeId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Company/Submissions/Index', [
            'submissions' => CompanySubmissionResource::collection(
                $query->paginate(10)->withQueryString()
            ),
            'filters' => $request->only(['challenge', 'status', 'search']),
            'challenges' => Challenge::where('company_id', $company->id)
                ->get(['id', 'title']),
            'statuses' => ['submitted', 'under_review', 'evaluated', 'accepted', 'rejected'],
        ]);
    }

    public function show(Submission $submission)
    {
        $user = Auth::user();
        if (!$user->company || $submission->challenge->company_id !== $user->company->id) { abort(403); }

        $submission->load([
            'user.candidateProfile.skills',
            'challenge.company',
            'challenge.requiredSkills',
            'challenge.evaluation_criteria',
            'files',
            'evaluations.evaluator',
        ]);

        $existingEvaluation = Evaluation::where('submission_id', $submission->id)
            ->where('evaluator_id', auth()->id())
            ->first();

        return Inertia::render('Company/Submissions/Show', [
            'submission' => new CompanySubmissionResource($submission),
            'evaluation' => $existingEvaluation ? new EvaluationResource($existingEvaluation) : null,
            'canEvaluate' => auth()->user()->can('evaluate', $submission),
        ]);
    }

    public function evaluate(EvaluateSubmissionRequest $request, Submission $submission)
    {
        $user = Auth::user();
        if (!$user->company || $submission->challenge->company_id !== $user->company->id) { abort(403); }

        $evaluation = Evaluation::updateOrCreate(
            [
                'submission_id' => $submission->id,
                'evaluator_id' => auth()->id(),
            ],
            [
                'score' => $request->score,
                'feedback' => $request->feedback,
                'criteria_scores' => $request->criteria_scores,
                'is_final' => $request->boolean('is_final', false),
            ]
        );

        if ($request->boolean('is_final', false)) {
            $submission->update([
                'status' => $request->boolean('accept') ? 'accepted' : 'rejected',
            ]);

            if ($request->boolean('accept')) {
                $submission->user->candidateProfile?->increment('reputation_score', 10);
            }
        } else {
            $submission->update(['status' => 'under_review']);
        }

        return redirect()->back()
            ->with('success', $request->boolean('is_final') ? 'Final evaluation saved.' : 'Evaluation saved as draft.');
    }

    public function downloadFile(Submission $submission, int $fileId)
    {
        $user = Auth::user();
        if (!$user->company || $submission->challenge->company_id !== $user->company->id) { abort(403); }

        $file = $submission->files()->findOrFail($fileId);

        return Storage::disk('private')->download($file->file_path, $file->original_name);
    }
}
