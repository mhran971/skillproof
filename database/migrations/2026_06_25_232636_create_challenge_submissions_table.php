<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')->constrained()->onDelete('cascade');
            $table->foreignId('candidate_profile_id')->constrained('candidate_profiles')->onDelete('cascade');
            $table->enum('status', ['draft', 'submitted', 'under_review', 'evaluated', 'accepted', 'rejected'])->default('draft');
            $table->string('github_url', 255)->nullable();
            $table->string('live_url', 255)->nullable();
            $table->string('document_url', 255)->nullable();
            $table->string('video_url', 255)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('evaluated_at')->nullable();
            $table->decimal('final_score', 5, 2)->nullable();
            $table->decimal('ai_score', 5, 2)->nullable();
            $table->text('reviewer_notes')->nullable();
            $table->timestamps();

            $table->unique(['challenge_id', 'candidate_profile_id']);
            $table->index('status');
            $table->index('candidate_profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_submissions');
    }
};

