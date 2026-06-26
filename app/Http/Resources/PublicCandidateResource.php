<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicCandidateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'avatar' => $this->avatar,
            'email' => $this->when($request->user()?->hasRole('company'), $this->email),
            'headline' => $this->candidateProfile?->professional_headline,
            'bio' => $this->candidateProfile?->bio,
            'location' => $this->candidateProfile?->location,
            'website' => $this->candidateProfile?->website,
            'github' => $this->candidateProfile?->github_url,
            'linkedin' => $this->candidateProfile?->linkedin_url,
            'experience_level' => $this->candidateProfile?->experience_level,
            'experience_label' => match($this->candidateProfile?->experience_level) {
                'entry' => 'Entry Level',
                'junior' => 'Junior',
                'mid' => 'Mid-Level',
                'senior' => 'Senior',
                'lead' => 'Lead',
                default => ucfirst($this->candidateProfile?->experience_level),
            },
            'is_available' => $this->candidateProfile?->is_available,
            'reputation_score' => $this->candidateProfile?->reputation_score ?? 0,
            'profile_completion' => $this->candidateProfile?->profile_completion ?? 0,
            'skills' => $this->whenLoaded('skills', fn () => 
                $this->skills->map(fn ($skill) => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'category' => $skill->whenLoaded('category', fn () => [
                        'id' => $skill->category->id,
                        'name' => $skill->category->name,
                    ]),
                ])
            ),
            'submissions' => $this->whenLoaded('submissions', fn () => 
                $this->submissions->map(fn ($sub) => [
                    'id' => $sub->id,
                    'title' => $sub->title,
                    'status' => $sub->status,
                    'challenge' => [
                        'id' => $sub->challenge->id,
                        'title' => $sub->challenge->title,
                        'slug' => $sub->challenge->slug,
                        'company' => [
                            'id' => $sub->challenge->company->id,
                            'name' => $sub->challenge->company->name,
                            'logo' => $sub->challenge->company->logo ? \Storage::disk('public')->url($sub->challenge->company->logo) : null,
                        ],
                    ],
                    'score' => $sub->evaluations->where('is_final', true)->first()?->score,
                ])
            ),
            'joined_at' => $this->created_at?->format('M Y'),
        ];
    }
}