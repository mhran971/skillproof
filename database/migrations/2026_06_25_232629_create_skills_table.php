<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->unique();
            $table->foreignId('category_id')->nullable()->constrained('skill_categories')->onDelete('set null');
            $table->string('slug', 255)->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('slug');
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};

