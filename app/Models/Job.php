<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'title', 'slug', 'description', 'requirements', 'responsibilities',
        'location', 'is_remote', 'is_hybrid', 'salary_min', 'salary_max', 'salary_currency',
        'employment_type', 'experience_level', 'required_skills', 'nice_to_have_skills',
        'benefits', 'application_deadline', 'status', 'views_count', 'applications_count', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'is_remote' => 'boolean',
            'is_hybrid' => 'boolean',
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'required_skills' => 'array',
            'nice_to_have_skills' => 'array',
            'benefits' => 'array',
            'application_deadline' => 'datetime',
            'views_count' => 'integer',
            'applications_count' => 'integer',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'job_id');
    }
}

