<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class StoreChallengeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('company') && $this->user()->company !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'requirements' => ['required', 'string'],
            'deliverables' => ['required', 'string'],
            'evaluation_criteria' => ['required', 'array', 'min:1'],
            'evaluation_criteria.*.name' => ['required', 'string', 'max:100'],
            'evaluation_criteria.*.weight' => ['required', 'integer', 'min:1', 'max:100'],
            'difficulty_level' => ['required', 'in:beginner,intermediate,advanced,expert'],
            'duration_hours' => ['nullable', 'integer', 'min:1'],
            'deadline' => ['nullable', 'date', 'after:now'],
            'max_participants' => ['nullable', 'integer', 'min:1'],
            'required_skills' => ['nullable', 'array'],
            'required_skills.*' => ['exists:skills,id'],
            'reward_description' => ['nullable', 'string', 'max:1000'],
            'attachment' => ['nullable', 'file', 'max:10240'],
            'is_published' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'evaluation_criteria.required' => 'At least one evaluation criterion is required.',
            'evaluation_criteria.*.name.required' => 'Each criterion must have a name.',
            'evaluation_criteria.*.weight.required' => 'Each criterion must have a weight.',
        ];
    }
}