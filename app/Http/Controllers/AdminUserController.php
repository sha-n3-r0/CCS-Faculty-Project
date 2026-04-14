<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
        ]);

        $existing = User::query()->where('email', $validated['email'])->first();

        if ($existing) {
            if ($existing->is_admin) {
                throw ValidationException::withMessages([
                    'email' => __('This email already has administrator access.'),
                ]);
            }

            $existing->update([
                'name' => $validated['name'],
                'is_admin' => true,
                'is_active' => true,
            ]);

            return redirect()->route('settings');
        }

        $base = Str::slug(Str::before($validated['email'], '@'), '_');
        if ($base === '') {
            $base = 'user';
        }
        $username = $base;
        $n = 0;
        while (User::query()->where('username', $username)->exists()) {
            $n++;
            $username = $base.'_'.$n;
        }

        User::query()->create([
            'name' => $validated['name'],
            'username' => $username,
            'email' => $validated['email'],
            'password' => Hash::make(Str::password(20)),
            'is_admin' => true,
            'is_active' => true,
        ]);

        return redirect()->route('settings');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        if (! $user->is_admin) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'is_active' => ['required', 'boolean'],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_active' => (bool) $validated['is_active'],
        ]);

        return redirect()->route('settings');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if (! $user->is_admin) {
            abort(404);
        }

        $adminCount = User::query()->where('is_admin', true)->count();
        if ($adminCount <= 1) {
            throw ValidationException::withMessages([
                'revoke' => __('At least one administrator must remain.'),
            ]);
        }

        if ($request->user()?->id === $user->id) {
            throw ValidationException::withMessages([
                'revoke' => __('You cannot revoke your own administrator access.'),
            ]);
        }

        $user->update(['is_admin' => false]);

        return redirect()->route('settings');
    }
}
