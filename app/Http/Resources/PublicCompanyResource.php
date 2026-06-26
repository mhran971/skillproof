<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicCompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'logo' => $this->logo ? \Storage::disk('public')->url($this->logo) : null,
            'description' => $this->description,
            'industry' => $this->industry,
            'location' => $this->location,
            'website' => $this->website,
            'size' => $this->size,
            'founded_year' => $this->founded_year,
            'challenges_count' => $this->whenCounted('challenges'),
            'challenges' => $this->whenLoaded('challenges', fn () => 
                $this->challenges->map(fn ($ch) => [
                    'id' => $ch->id,
                    'title' => $ch->title,
                    'slug' => $ch->slug,
                    'difficulty_level' => $ch->difficulty_level,
                    'difficulty_label' => match($ch->difficulty_level) {
                        'beginner' => 'Beginner',
                        'intermediate' => 'Intermediate',
                        'advanced' => 'Advanced',
                        'expert' => 'Expert',
                        default => ucfirst($ch->difficulty_level),
                    },
                    'deadline' => $ch->deadline,
                    'required_skills' => $ch->whenLoaded('requiredSkills', fn () => 
                        $ch->requiredSkills->map(fn ($s) => ['id' => $s->id, 'name' => $s->name])
                    ),
                ])
            ),
        ];
    }
}