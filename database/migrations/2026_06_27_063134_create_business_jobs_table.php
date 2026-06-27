<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->text('responsibilities')->nullable();
            $table->string('location')->nullable();
            $table->boolean('is_remote')->default(false);
            $table->boolean('is_hybrid')->default(false);
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->string('salary_currency', 10)->default('USD');
            $table->string('employment_type')->nullable(); // full-time, part-time, contract, internship
            $table->string('experience_level')->nullable();
            $table->json('required_skills')->nullable();
            $table->json('nice_to_have_skills')->nullable();
            $table->json('benefits')->nullable();
            $table->timestamp('application_deadline')->nullable();
            $table->string('status')->default('published');
            $table->integer('views_count')->default(0);
            $table->integer('applications_count')->default(0);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
