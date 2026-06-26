<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CompanyChallengeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'deliverables' => $this->deliverables,
            'evaluation_criteria' => $this->evaluation_criteria,
            'difficulty_level' => $this->difficulty_level,
            'difficulty_label' => match($this->difficulty_level) {
                'beginner' => 'Beginner',
                'intermediate' => 'Intermediate',
                'advanced' => 'Advanced',
                'expert' => 'Expert',
                default => ucfirst($this->difficulty_level),
            },
            'duration_hours' => $this->duration_hours,
            'deadline' => $this->deadline,
            'max_participants' => $this->max_participants,
            'is_published' => $this->is_published,
            'reward_description' => $this->reward_description,
            'attachment_path' => $this->attachment_path ? Storage::disk('public')->url($this->attachment_path) : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'required_skills' => $this->whenLoaded('requiredSkills', fn () => $this->requiredSkills->map(fn ($skill) => [
                'id' => $skill->id,
                'name' => $skill->name,
            ])),
            'submissions_count' => $this->whenLoaded('submissions', fn () => $this->submissions->count()),
            'submissions' => $this->whenLoaded('submissions', fn () => $this->submissions->map(fn ($sub) => [
                'id' => $sub->id,
                'status' => $sub->status,
                'user_name' => $sub->user->name ?? null,
                'submitted_at' => $sub->submitted_at,
            ])),
        ];
    }
}