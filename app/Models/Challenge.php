<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'title', 'slug', 'description', 'requirements', 'deliverables',
        'difficulty', 'category_id', 'industry', 'duration_hours', 'deadline',
        'max_participants', 'reward', 'badge_id', 'evaluation_criteria',
        'required_skills', 'is_published', 'is_featured', 'visibility', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
            'evaluation_criteria' => 'array',
            'required_skills' => 'array',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'duration_hours' => 'integer',
            'max_participants' => 'integer',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function submissions()
    {
        return $this->hasMany(ChallengeSubmission::class);
    }

    // NOTE: category/required skills relations require pivot tables.
}

