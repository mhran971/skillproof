<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submission_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained('challenge_submissions')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users');
            $table->string('criterion_name', 255);
            $table->decimal('score', 4, 2);
            $table->text('feedback')->nullable();
            $table->boolean('is_final')->default(false);
            $table->timestamps();

            $table->index('submission_id');
            $table->index('reviewer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submission_reviews');
    }
};

