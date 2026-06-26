<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'evaluator_id',
        'score',
        'feedback',
        'criteria_scores',
        'is_final',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'integer',
            'criteria_scores' => 'array',
            'is_final' => 'boolean',
        ];
    }

    // ============================================================
    // RELATIONSHIPS
    // ============================================================

    /**
     * The submission being evaluated
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * The company user who made this evaluation
     */
    public function evaluator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }

    // ============================================================
    // SCOPES
    // ============================================================

    public function scopeFinal($query)
    {
        return $query->where('is_final', true);
    }

    public function scopeDraft($query)
    {
        return $query->where('is_final', false);
    }

    public function scopeByEvaluator($query, int $evaluatorId)
    {
        return $query->where('evaluator_id', $evaluatorId);
    }

    public function scopeForSubmission($query, int $submissionId)
    {
        return $query->where('submission_id', $submissionId);
    }

    public function scopeScoreAbove($query, int $minScore)
    {
        return $query->where('score', '>=', $minScore);
    }

    // ============================================================
    // ACCESSORS & HELPERS
    // ============================================================

    /**
     * Get score as percentage (assuming max score is 100)
     */
    public function scorePercentage(): int
    {
        return min(100, max(0, $this->score));
    }

    /**
     * Get score grade
     */
    public function grade(): string
    {
        return match (true) {
            $this->score >= 90 => 'A+',
            $this->score >= 85 => 'A',
            $this->score >= 80 => 'A-',
            $this->score >= 75 => 'B+',
            $this->score >= 70 => 'B',
            $this->score >= 65 => 'B-',
            $this->score >= 60 => 'C+',
            $this->score >= 55 => 'C',
            $this->score >= 50 => 'C-',
            default => 'F',
        };
    }

    /**
     * Get score color for UI
     */
    public function scoreColor(): string
    {
        return match (true) {
            $this->score >= 80 => 'green',
            $this->score >= 60 => 'yellow',
            $this->score >= 40 => 'orange',
            default => 'red',
        };
    }

    /**
     * Get criteria score by name
     */
    public function getCriteriaScore(string $criterionName): ?int
    {
        if (!$this->criteria_scores || !is_array($this->criteria_scores)) {
            return null;
        }

        foreach ($this->criteria_scores as $criteria) {
            if (($criteria['name'] ?? '') === $criterionName) {
                return $criteria['score'] ?? null;
            }
        }

        return null;
    }

    // ============================================================
    // BOOT METHOD - Auto-update submission on final evaluation
    // ============================================================

    protected static function boot(): void
    {
        parent::boot();

        static::created(function (Evaluation $evaluation) {
            if ($evaluation->is_final) {
                $evaluation->submission->update([
                    'final_score' => $evaluation->score,
                ]);
            }
        });

        static::updated(function (Evaluation $evaluation) {
            if ($evaluation->wasChanged('is_final') && $evaluation->is_final) {
                $evaluation->submission->update([
                    'final_score' => $evaluation->score,
                ]);
            }
        });
    }
}

