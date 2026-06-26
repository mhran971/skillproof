<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use App\Models\CandidateProfile;
use App\Models\Company;
use Illuminate\Support\Str;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ==================== PERMISSIONS ====================
        $permissions = [
            // User Management
            'users.view', 'users.create', 'users.edit', 'users.delete', 'users.ban',

            // Role Management
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete',

            // Challenge Management
            'challenges.view', 'challenges.create', 'challenges.edit', 'challenges.delete', 'challenges.publish',

            // Submission Management
            'submissions.view', 'submissions.evaluate', 'submissions.edit',

            // Job Management
            'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete', 'jobs.publish',

            // Company Management
            'companies.view', 'companies.create', 'companies.edit', 'companies.verify',

            // Candidate Management
            'candidates.view', 'candidates.edit', 'candidates.verify',

            // Evaluation
            'evaluations.create', 'evaluations.edit', 'evaluations.delete',

            // Internship Management
            'internships.view', 'internships.create', 'internships.edit', 'internships.delete',

            // Micro Task Management
            'micro_tasks.view', 'micro_tasks.create', 'micro_tasks.edit', 'micro_tasks.delete',

            // System
            'analytics.view', 'settings.manage', 'fraud.manage', 'audit.view',

            // Profile
            'profile.view', 'profile.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        // ==================== ROLES ====================

        // Admin Role - Full Access
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo(Permission::all());

        // Candidate Role
        $candidateRole = Role::create(['name' => 'candidate', 'guard_name' => 'web']);
        $candidateRole->givePermissionTo([
            'profile.view', 'profile.edit',
            'challenges.view',
            'submissions.view',
            'jobs.view',
            'internships.view',
            'micro_tasks.view',
        ]);

        // Company Role
        $companyRole = Role::create(['name' => 'company', 'guard_name' => 'web']);
        $companyRole->givePermissionTo([
            'profile.view', 'profile.edit',
            'challenges.view', 'challenges.create', 'challenges.edit', 'challenges.delete',
            'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete',
            'candidates.view',
            'internships.view', 'internships.create', 'internships.edit', 'internships.delete',
            'micro_tasks.view', 'micro_tasks.create', 'micro_tasks.edit', 'micro_tasks.delete',
            'evaluations.create', 'evaluations.edit',
        ]);

        // Evaluator Role
        $evaluatorRole = Role::create(['name' => 'evaluator', 'guard_name' => 'web']);
        $evaluatorRole->givePermissionTo([
            'profile.view', 'profile.edit',
            'challenges.view',
            'submissions.view', 'submissions.evaluate',
            'candidates.view',
            'evaluations.create', 'evaluations.edit',
        ]);

        // ==================== DEFAULT USERS ====================

        // Admin User
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@skillproof.com',
            'username' => 'admin',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        // Demo Candidate
        $candidate = User::create([
            'name' => 'Demo Candidate',
            'email' => 'candidate@skillproof.com',
            'username' => 'demo_candidate',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $candidate->assignRole('candidate');

        CandidateProfile::create([
            'user_id' => $candidate->id,
            'reputation_score' => 0,
            'job_readiness_score' => 0,
            'profile_completion' => 0,
        ]);

        // Demo Company
        $company = User::create([
            'name' => 'Demo Company',
            'email' => 'company@skillproof.com',
            'username' => 'demo_company',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $company->assignRole('company');

        Company::create([
            'user_id' => $company->id,
            'name' => 'Demo Company',
            'slug' => Str::slug('Demo Company') . '-' . $company->id,
        ]);

        // Demo Evaluator
        $evaluator = User::create([
            'name' => 'Demo Evaluator',
            'email' => 'evaluator@skillproof.com',
            'username' => 'demo_evaluator',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
        $evaluator->assignRole('evaluator');
    }
}
