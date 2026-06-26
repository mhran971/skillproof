<?php

use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Candidate\ChallengeController as CandidateChallengeController;
use App\Http\Controllers\Candidate\DashboardController as CandidateDashboardController;
use App\Http\Controllers\Candidate\JoinChallengeController;
use App\Http\Controllers\Candidate\ProfileController as CandidateProfileController;
use App\Http\Controllers\Candidate\SubmissionController as CandidateSubmissionController;
use App\Http\Controllers\Company\ChallengeController as CompanyChallengeController;
use App\Http\Controllers\Company\DashboardController as CompanyDashboardController;
use App\Http\Controllers\Company\SubmissionController as CompanySubmissionController;
use App\Http\Controllers\FileDownloadController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Public\CandidateController as PublicCandidateController;
use App\Http\Controllers\Public\ChallengeController as PublicChallengeController;
use App\Http\Controllers\Public\CompanyController as PublicCompanyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('public.challenges.index');
})->name('home');

Route::get('/dashboard', function () {
    if (auth()->user()->hasRole('company')) {
        return redirect()->route('company.dashboard');
    }
    return redirect()->route('candidate.dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('/challenges', [PublicChallengeController::class, 'index'])->name('public.challenges.index');
Route::get('/challenges/{slug}', [PublicChallengeController::class, 'show'])->name('public.challenges.show');

Route::get('/candidates', [PublicCandidateController::class, 'index'])->name('public.candidates.index');
Route::get('/candidates/{username}', [PublicCandidateController::class, 'show'])->name('public.candidates.show');

Route::get('/companies', [PublicCompanyController::class, 'index'])->name('public.companies.index');
Route::get('/companies/{slug}', [PublicCompanyController::class, 'show'])->name('public.companies.show');

/*
|--------------------------------------------------------------------------
| Auth Routes (handled by Laravel Breeze/Fortify or custom)
|--------------------------------------------------------------------------
*/

// Add your auth routes here (login, register, etc.)

/*
|--------------------------------------------------------------------------
| Candidate Routes (Protected)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:candidate'])->prefix('candidate')->name('candidate.')->group(function () {
    Route::get('/dashboard', [CandidateDashboardController::class, 'index'])->name('dashboard');

    Route::get('/challenges', [CandidateChallengeController::class, 'index'])->name('challenges.index');
    Route::get('/challenges/{challenge}', [CandidateChallengeController::class, 'show'])->name('challenges.show');
    Route::post('/challenges/{challenge}/join', [CandidateChallengeController::class, 'join'])->name('challenges.join');

    Route::get('/submissions', [CandidateSubmissionController::class, 'index'])->name('submissions.index');
    Route::get('/submissions/create/{challenge}', [CandidateSubmissionController::class, 'create'])->name('submissions.create');
    Route::post('/submissions', [CandidateSubmissionController::class, 'store'])->name('submissions.store');
    Route::get('/submissions/{submission}', [CandidateSubmissionController::class, 'show'])->name('submissions.show');
    Route::get('/submissions/{submission}/edit', [CandidateSubmissionController::class, 'edit'])->name('submissions.edit');
    Route::put('/submissions/{submission}', [CandidateSubmissionController::class, 'update'])->name('submissions.update');
    Route::delete('/submissions/{submission}', [CandidateSubmissionController::class, 'destroy'])->name('submissions.destroy');
    Route::post('/submissions/{submission}/files', [CandidateSubmissionController::class, 'uploadFile'])->name('submissions.files.upload');
    Route::delete('/submissions/{submission}/files/{fileId}', [CandidateSubmissionController::class, 'deleteFile'])->name('submissions.files.destroy');

    Route::get('/profile', [CandidateProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [CandidateProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [CandidateProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/skills', [CandidateProfileController::class, 'updateSkills'])->name('profile.skills');
    Route::post('/profile/avatar', [CandidateProfileController::class, 'uploadAvatar'])->name('profile.avatar');
});

/*
|--------------------------------------------------------------------------
| Company Routes (Protected)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:company'])->prefix('company')->name('company.')->group(function () {
    Route::get('/dashboard', [CompanyDashboardController::class, 'index'])->name('dashboard');

    Route::get('/challenges', [CompanyChallengeController::class, 'index'])->name('challenges.index');
    Route::get('/challenges/create', [CompanyChallengeController::class, 'create'])->name('challenges.create');
    Route::post('/challenges', [CompanyChallengeController::class, 'store'])->name('challenges.store');
    Route::get('/challenges/{challenge}', [CompanyChallengeController::class, 'show'])->name('challenges.show');
    Route::get('/challenges/{challenge}/edit', [CompanyChallengeController::class, 'edit'])->name('challenges.edit');
    Route::put('/challenges/{challenge}', [CompanyChallengeController::class, 'update'])->name('challenges.update');
    Route::delete('/challenges/{challenge}', [CompanyChallengeController::class, 'destroy'])->name('challenges.destroy');
    Route::post('/challenges/{challenge}/publish', [CompanyChallengeController::class, 'publish'])->name('challenges.publish');
    Route::post('/challenges/{challenge}/unpublish', [CompanyChallengeController::class, 'unpublish'])->name('challenges.unpublish');

    Route::get('/submissions', [CompanySubmissionController::class, 'index'])->name('submissions.index');
    Route::get('/submissions/{submission}', [CompanySubmissionController::class, 'show'])->name('submissions.show');
    Route::post('/submissions/{submission}/evaluate', [CompanySubmissionController::class, 'evaluate'])->name('submissions.evaluate');
    Route::put('/submissions/{submission}/status', [CompanySubmissionController::class, 'updateStatus'])->name('submissions.status');
    Route::get('/submissions/{submission}/files/{fileId}/download', [CompanySubmissionController::class, 'downloadFile'])->name('submissions.files.download');
});

/*
|--------------------------------------------------------------------------
| File Download Route
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->get('/files/{fileId}/download', FileDownloadController::class)->name('files.download');

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::post('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
    Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
    Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
});

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [\App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [\App\Http\Controllers\ProfileController::class, 'destroy'])->name('profile.destroy');
});
require __DIR__.'/auth.php';
