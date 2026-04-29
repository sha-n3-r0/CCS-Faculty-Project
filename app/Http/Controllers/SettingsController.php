<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\SystemSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function show(SystemSettings $settings): Response
    {
        return Inertia::render('Settings', [
            'adminUsers' => $this->adminUsersPayload(),
            'systemConfig' => $settings->get(),
        ]);
    }

    /**
     * @return list<array{id: int, name: string, email: string, status: string}>
     */
    public static function adminUsersPayload(): array
    {
        return User::query()
            ->where('is_admin', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'is_active'])
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'status' => $u->is_active ? 'Active' : 'Inactive',
            ])
            ->values()
            ->all();
    }

    public function updateConfig(Request $request, SystemSettings $settings): RedirectResponse
    {
        $validated = $request->validate([
            'current_semester' => ['nullable', 'string', 'max:255'],
        ]);

        $settings->put([
            'current_semester' => $validated['current_semester'] ?? null,
        ]);

        return redirect()
            ->route('settings')
            ->with('success', 'System configuration updated.');
    }
}
