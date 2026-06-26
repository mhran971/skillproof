<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_id', 'candidate_profile_id', 'status', 'cover_letter',
        'expected_salary', 'match_percentage', 'applied_at', 'reviewed_at', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'applied_at' => 'datetime',
            'reviewed_at' => 'datetime',
            'expected_salary' => 'decimal:2',
            'match_percentage' => 'decimal:2',
        ];
    }

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_id');
    }

    public function candidateProfile()
    {
        return $this->belongsTo(CandidateProfile::class, 'candidate_profile_id');
    }
}

