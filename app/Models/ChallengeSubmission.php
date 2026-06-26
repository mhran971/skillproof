<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChallengeSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_id', 'candidate_profile_id', 'status',
        'github_url', 'live_url', 'document_url', 'video_url', 'notes',
        'submitted_at', 'evaluated_at', 'final_score', 'ai_score', 'reviewer_notes',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'evaluated_at' => 'datetime',
            'final_score' => 'decimal:2',
            'ai_score' => 'decimal:2',
        ];
    }

    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    public function candidateProfile()
    {
        return $this->belongsTo(CandidateProfile::class, 'candidate_profile_id');
    }

    public function files()
    {
        return $this->hasMany(SubmissionFile::class, 'submission_id');
    }

    public function reviews()
    {
        return $this->hasMany(SubmissionReview::class, 'submission_id');
    }
}

