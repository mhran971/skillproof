<?php

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
        return $this->hasMany(ChallengeSubmission::class);
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
}
