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


// ============================================================================
// 4. CHALLENGE MODEL
// ============================================================================
// Path: app/Models/Challenge.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'title',
        'slug',
        'description',
        'requirements',
        'deliverables',
        'difficulty_level',
        'duration_hours',
        'deadline',
        'max_participants',
        'is_published',
        'reward_description',
        'evaluation_criteria',
        'passing_score',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
            'is_published' => 'boolean',
            'duration_hours' => 'integer',
            'max_participants' => 'integer',
            'evaluation_criteria' => 'array',
            'passing_score' => 'integer',
        ];
    }

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function requiredSkills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'challenge_skills')
            ->withTimestamps();
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    // ============================================================
    // SCOPES
    // ============================================================

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('deadline')->orWhere('deadline', '>', now());
        });
    }

    // ============================================================
    // ACCESSORS
    // ============================================================

    protected function isExpired(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->deadline && $this->deadline < now(),
        );
    }

    protected function isFull(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->max_participants && $this->submissions()
                ->where('status', '!=', 'draft')
                ->count() >= $this->max_participants,
        );
    }
}