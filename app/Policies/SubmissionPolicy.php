<?php

namespace App\Policies;

use App\Models\Submission;
use App\Models\User;

class SubmissionPolicy
{
    public function view(User $user, Submission $submission): bool
    {
        return $user->isAdmin() || 
               $submission->user_id === $user->id || 
               ($user->isCompany() && $submission->challenge->company_id === $user->company?->id);
    }

    public function update(User $user, Submission $submission): bool
    {
        return $submission->user_id === $user->id && $submission->status === 'draft';
    }

    public function delete(User $user, Submission $submission): bool
    {
        return $submission->user_id === $user->id && $submission->status === 'draft';
    }

    public function evaluate(User $user, Submission $submission): bool
    {
        return $user->isCompany() && 
               $submission->challenge->company_id === $user->company?->id &&
               $submission->status !== 'draft';
    }
}