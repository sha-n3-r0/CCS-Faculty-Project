<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogsController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'action' => ['nullable', 'string', 'max:128'],
        ]);

        $q = trim((string) ($validated['q'] ?? ''));
        $action = trim((string) ($validated['action'] ?? ''));

        $logs = AuditLog::query()
            ->when($q !== '', function ($query) use ($q) {
                $like = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $q).'%';
                $query->where(function ($sub) use ($like) {
                    $sub->where('action', 'like', $like)
                        ->orWhere('entity_type', 'like', $like)
                        ->orWhere('ip_address', 'like', $like);
                });
            })
            ->when($action !== '', fn ($query) => $query->where('action', $action))
            ->orderByDesc('created_at')
            ->paginate(50)
            ->withQueryString()
            ->through(fn (AuditLog $l) => [
                'id' => $l->id,
                'user_id' => $l->user_id,
                'action' => $l->action,
                'entity_type' => $l->entity_type,
                'entity_id' => $l->entity_id,
                'ip_address' => $l->ip_address,
                'created_at' => $l->created_at?->toISOString(),
                'metadata' => $l->metadata,
            ]);

        return Inertia::render('AuditLogs', [
            'logs' => $logs,
            'filters' => [
                'q' => $q,
                'action' => $action,
            ],
        ]);
    }
}

