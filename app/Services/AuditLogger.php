<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Request;

class AuditLogger
{
    public function log(Request $request, string $action, ?string $entityType = null, ?int $entityId = null, array $metadata = []): void
    {
        $user = $request->user();

        AuditLog::query()->create([
            'user_id' => $user instanceof Authenticatable ? $user->getAuthIdentifier() : null,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 1000),
            'metadata' => $metadata,
        ]);
    }
}

