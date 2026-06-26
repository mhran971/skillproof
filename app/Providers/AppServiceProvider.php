<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Gate::policy(\App\Models\Challenge::class, \App\Policies\ChallengePolicy::class);
        Gate::policy(\App\Models\Submission::class, \App\Policies\SubmissionPolicy::class);
        Gate::policy(\App\Models\User::class, \App\Policies\UserPolicy::class);
    
    }
}
