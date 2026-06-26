<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Evaluation;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_id',
        'user_id',
        'title',
        'description',
        'solution_url',
        'repository_url',
        'status',
        'submitted_at',
        'final_score',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'final_score' => 'integer',
        ];
    }

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    /**
     * The challenge this submission belongs to
     */
    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class);
    }

    /**
     * The candidate who made this submission
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * All evaluations for this submission
     */
    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }

    /**
     * The final evaluation (if exists)
     */
    public function finalEvaluation(): BelongsTo
    {
        return $this->belongsTo(Evaluation::class, 'final_evaluation_id');
    }

    /**
     * All files attached to this submission
     */
    public function files(): HasMany
    {
        return $this->hasMany(SubmissionFile::class);
    }

    // ============================================================
    // SCOPES
    // ============================================================

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    public function scopeUnderReview($query)
    {
        return $query->where('status', 'under_review');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeEvaluated($query)
    {
        return $query->whereHas('evaluations', fn ($q) => $q->where('is_final', true));
    }

    public function scopePendingEvaluation($query)
    {
        return $query->where('status', 'submitted')
            ->whereDoesntHave('evaluations', fn ($q) => $q->where('is_final', true));
    }

    // ============================================================
    // ACCESSORS & HELPERS
    // ============================================================

    /**
     * Check if submission is in draft state
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Check if submission has been submitted (not draft)
     */
    public function isSubmitted(): bool
    {
        return $this->status !== 'draft';
    }

    /**
     * Check if submission has a final evaluation
     */
    public function hasFinalEvaluation(): bool
    {
        return $this->evaluations()->where('is_final', true)->exists();
    }

    /**
     * Get the latest evaluation
     */
    public function latestEvaluation(): ?Evaluation
    {
        return $this->evaluations()->latest()->first();
    }

    /**
     * Get average score from all evaluations
     */
    public function averageScore(): ?float
    {
        $avg = $this->evaluations()->avg('score');
        return $avg ? round($avg, 2) : null;
    }

    // ============================================================
    // BOOT METHOD - Auto-update reputation on acceptance
    // ============================================================

    protected static function boot(): void
    {
        parent::boot();

        static::updated(function (Submission $submission) {
            if ($submission->wasChanged('status') && $submission->status === 'accepted') {
                // Update candidate reputation
                $profile = $submission->user->candidateProfile;
                if ($profile) {
                    $profile->increment('reputation_score', 10);
                }
            }
        });
    }
}
