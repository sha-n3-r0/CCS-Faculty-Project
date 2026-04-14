<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Settings', [
            'adminUsers' => $this->adminUsersPayload(),
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
}
