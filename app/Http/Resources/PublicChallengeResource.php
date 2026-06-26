<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicChallengeResource extends JsonResource
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
            'difficulty_level' => $this->difficulty_level,
            'difficulty_label' => match($this->difficulty_level) {
                'beginner' => 'Beginner',
                'intermediate' => 'Intermediate',
                'advanced' => 'Advanced',
                'expert' => 'Expert',
                default => ucfirst($this->difficulty_level),
            },
            'difficulty_color' => match($this->difficulty_level) {
                'beginner' => 'green',
                'intermediate' => 'blue',
                'advanced' => 'purple',
                'expert' => 'red',
                default => 'gray',
            },
            'duration_hours' => $this->duration_hours,
            'deadline' => $this->deadline,
            'deadline_human' => $this->deadline ? $this->deadline->diffForHumans() : null,
            'max_participants' => $this->max_participants,
            'is_published' => $this->is_published,
            'reward_description' => $this->reward_description,
            'evaluation_criteria' => $this->evaluation_criteria,
            'created_at' => $this->created_at,
            'company' => $this->whenLoaded('company', fn () => [
                'id' => $this->company->id,
                'name' => $this->company->name,
                'slug' => $this->company->slug,
                'logo' => $this->company->logo ? \Storage::disk('public')->url($this->company->logo) : null,
            ]),
            'required_skills' => $this->whenLoaded('requiredSkills', fn () => 
                $this->requiredSkills->map(fn ($skill) => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                ])
            ),
            'submissions_count' => $this->whenLoaded('submissions', fn () => $this->submissions->count()),
            'accepted_submissions' => $this->whenLoaded('submissions', fn () => 
                $this->submissions->where('status', 'accepted')->map(fn ($sub) => [
                    'id' => $sub->id,
                    'user_name' => $sub->user->name,
                    'user_avatar' => $sub->user->avatar,
                ])->values()
            ),
        ];
    }
}