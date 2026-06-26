<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanySubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'repository_url' => $this->repository_url,
            'live_demo_url' => $this->live_demo_url,
            'notes' => $this->notes,
            'status' => $this->status,
            'status_label' => match($this->status) {
                'draft' => 'Draft',
                'submitted' => 'Submitted',
                'under_review' => 'Under Review',
                'evaluated' => 'Evaluated',
                'accepted' => 'Accepted',
                'rejected' => 'Rejected',
                default => ucfirst($this->status),
            },
            'submitted_at' => $this->submitted_at,
            'created_at' => $this->created_at,
            'candidate' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'avatar' => $this->user->avatar,
                'headline' => $this->user->candidateProfile?->professional_headline,
                'profile_completion' => $this->user->candidateProfile?->profile_completion,
            ]),
            'challenge' => $this->whenLoaded('challenge', fn () => [
                'id' => $this->challenge->id,
                'title' => $this->challenge->title,
                'slug' => $this->challenge->slug,
                'evaluation_criteria' => $this->challenge->evaluation_criteria,
            ]),
            'files' => $this->whenLoaded('files', fn () => $this->files->map(fn ($file) => [
                'id' => $file->id,
                'original_name' => $file->original_name,
                'file_size' => $file->file_size,
                'mime_type' => $file->mime_type,
            ])),
            'evaluations' => $this->whenLoaded('evaluations', fn () => EvaluationResource::collection($this->evaluations)),
            'overall_score' => $this->whenLoaded('evaluations', function () {
                $scores = $this->evaluations->where('is_final', true)->pluck('score')->filter();
                return $scores->isNotEmpty() ? round($scores->avg(), 2) : null;
            }),
            'my_evaluation' => $this->whenLoaded('evaluations', function () {
                return $this->evaluations->firstWhere('evaluator_id', auth()->id());
            }),
        ];
    }
}