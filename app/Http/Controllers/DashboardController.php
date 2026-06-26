<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isCandidate()) {
            return redirect()->route('candidate.dashboard');
        }

        if ($user->isCompany()) {
            return redirect()->route('company.dashboard');
        }

        if ($user->isEvaluator()) {
            return redirect()->route('evaluator.dashboard');
        }

        return Inertia::render('Dashboard');
    }
}
