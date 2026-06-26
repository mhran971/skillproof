<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubmissionReview extends Model
{
    use HasFactory;

    protected $table = 'submission_reviews';

    protected $fillable = ['submission_id', 'reviewer_id', 'criterion_name', 'score', 'feedback', 'is_final'];

    protected function casts(): array
    {
        return ['score' => 'decimal:2', 'is_final' => 'boolean'];
    }

    public function submission()
    {
        return $this->belongsTo(ChallengeSubmission::class, 'submission_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
