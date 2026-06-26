<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubmissionFile extends Model
{
    use HasFactory;

    protected $table = 'submission_files';

    protected $fillable = [
        'submission_id', 'file_name', 'file_path', 'file_type', 'file_size', 'mime_type',
    ];

    protected function casts(): array
    {
        return ['file_size' => 'integer'];
    }

    public function submission()
    {
        return $this->belongsTo(ChallengeSubmission::class, 'submission_id');
    }
}

