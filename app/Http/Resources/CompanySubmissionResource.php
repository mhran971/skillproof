<?php

namespace App\Http\Resources;

use App\Http\Resources\EvaluationResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanySubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'github_url' => $this->github_url,
            'live_url' => $this->live_url,
            'document_url' => $this->document_url,
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
            'candidate' => $this->whenLoaded('candidateProfile', fn () => [
                'id' => $this->candidateProfile->user->id,
                'name' => $this->candidateProfile->user->name,
                'email' => $this->candidateProfile->user->email,
                'avatar' => $this->candidateProfile->user->avatar,
                'headline' => $this->candidateProfile->professional_headline,
                'profile_completion' => $this->candidateProfile->profile_completion,
            ]),
            'challenge' => $this->whenLoaded('challenge', fn () => [
                'id' => $this->challenge->id,
                'title' => $this->challenge->title,
                'slug' => $this->challenge->slug,
                'evaluation_criteria' => $this->challenge->evaluation_criteria,
            ]),
            'files' => $this->whenLoaded('files', fn () => $this->files->map(fn ($file) => [
                'id' => $file->id,
                'file_name' => $file->file_name,
                'file_size' => $file->file_size,
                'mime_type' => $file->mime_type,
            ])),
            'evaluations' => $this->whenLoaded('reviews', fn () => EvaluationResource::collection($this->reviews)),
            'overall_score' => $this->final_score,
            'my_evaluation' => $this->whenLoaded('reviews', function () {
                return $this->reviews->firstWhere('reviewer_id', auth()->id());
            }),
        ];
    }
}
