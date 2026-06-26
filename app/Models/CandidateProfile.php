<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'professional_headline',
        'bio',
        'location',
        'website',
        'github_url',
        'linkedin_url',
        'experience_level',
        'is_public',
        'is_available',
        'reputation_score',
        'profile_completion',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'is_available' => 'boolean',
            'reputation_score' => 'integer',
            'profile_completion' => 'integer',
        ];
    }

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
