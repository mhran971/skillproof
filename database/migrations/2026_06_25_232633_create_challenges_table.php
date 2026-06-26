<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('description');
            $table->text('requirements');
            $table->text('deliverables');
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced', 'expert']);
            $table->foreignId('category_id')->constrained('challenge_categories');
            $table->string('industry', 100)->nullable();
            $table->integer('duration_hours')->nullable();
            $table->timestamp('deadline')->nullable();
            $table->integer('max_participants')->nullable();
            $table->string('reward', 255)->nullable();
            // NOTE: 'achievements' table doesn't exist in this repo yet; keep badge_id as plain nullable column.
            $table->unsignedBigInteger('badge_id')->nullable();
            $table->json('evaluation_criteria');
            $table->json('required_skills')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->enum('visibility', ['public', 'private', 'invite_only'])->default('public');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->index('slug');
            $table->index('difficulty');
            $table->index('category_id');
            $table->index('is_published');
            $table->index('visibility');
            $table->index('deadline');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};

