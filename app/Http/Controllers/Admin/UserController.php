<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles:id,name');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->role($role);
        }

        if ($status = $request->input('status')) {
            $query->where('is_active', $status === 'active');
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $query->latest()->paginate(20)->withQueryString(),
            'filters' => $request->only(['search', 'role', 'status']),
            'roles' => ['candidate', 'company', 'admin'],
        ]);
    }

    public function show(User $user)
    {
        $user->load(['roles', 'candidateProfile', 'company', 'skills:id,name']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    public function toggleStatus(User $user)
    {
        $user->update(['is_active' => !$user->is_active]);

        return redirect()->back()
            ->with('success', $user->is_active
                ? __('User activated successfully.')
                : __('User deactivated successfully.'));
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', __('User deleted successfully.'));
    }
}
