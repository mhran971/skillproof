<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvaluationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'evaluator' => [
                'id' => $this->reviewer->id,
                'name' => $this->reviewer->name,
            ],
            'score' => $this->score,
            'feedback' => $this->feedback,
            'is_final' => $this->is_final,
            'created_at' => $this->created_at,
        ];
    }
}
