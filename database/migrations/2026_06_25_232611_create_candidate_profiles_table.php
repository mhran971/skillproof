<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidate_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('professional_headline', 255)->nullable();
            $table->text('biography')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('country', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('github_url', 255)->nullable();
            $table->string('linkedin_url', 255)->nullable();
            $table->string('portfolio_url', 255)->nullable();
            $table->decimal('reputation_score', 5, 2)->default(0.00);
            $table->decimal('job_readiness_score', 5, 2)->default(0.00);
            $table->unsignedTinyInteger('profile_completion')->default(0);
            $table->boolean('is_public')->default(true);
            $table->timestamps();

            $table->unique('user_id');
            $table->index('reputation_score');
            $table->index('job_readiness_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_profiles');
    }
};

