<?php

namespace App\Policies;

use App\Models\Challenge;
use App\Models\User;

class ChallengePolicy
{
    public function view(User $user, Challenge $challenge): bool
    {
        return $user->isAdmin() || 
               ($user->isCompany() && $challenge->company_id === $user->company?->id);
    }

    public function update(User $user, Challenge $challenge): bool
    {
        return $user->isAdmin() || 
               ($user->isCompany() && $challenge->company_id === $user->company?->id);
    }

    public function delete(User $user, Challenge $challenge): bool
    {
        return $user->isAdmin() || 
               ($user->isCompany() && $challenge->company_id === $user->company?->id);
    }
}