<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class EvaluateSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('company') && $this->user()->company !== null;
    }

    public function rules(): array
    {
        return [
            'score' => ['required', 'integer', 'min:0', 'max:100'],
            'feedback' => ['required', 'string', 'min:10'],
            'criteria_scores' => ['nullable', 'array'],
            'criteria_scores.*.name' => ['required_with:criteria_scores', 'string'],
            'criteria_scores.*.score' => ['required_with:criteria_scores', 'integer', 'min:0', 'max:100'],
            'criteria_scores.*.weight' => ['required_with:criteria_scores', 'integer', 'min:1', 'max:100'],
            'is_final' => ['boolean'],
            'accept' => ['required_if:is_final,true', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'feedback.required' => 'Please provide detailed feedback for the candidate.',
            'feedback.min' => 'Feedback must be at least 10 characters long.',
            'accept.required_if' => 'Please decide whether to accept or reject this submission.',
        ];
    }
}