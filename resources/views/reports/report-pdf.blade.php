<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'Report' }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #0f172a; }
        .header { margin-bottom: 14px; }
        .title { font-size: 18px; font-weight: 700; margin: 0; }
        .meta { margin-top: 4px; font-size: 11px; color: #475569; }
        .pill { display: inline-block; padding: 2px 8px; border: 1px solid #cbd5e1; border-radius: 9999px; margin-left: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
        th { background: #f8fafc; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #334155; }
        td { font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <p class="title">{{ $title ?? 'Report' }}</p>
        <div class="meta">
            Generated at: {{ data_get($meta ?? [], 'generated_at', now()->toDateTimeString()) }}
            @if (data_get($meta ?? [], 'filters.label'))
                <span class="pill">Filter: {{ data_get($meta ?? [], 'filters.label') }}</span>
            @endif
        </div>
    </div>

    <table>
        <thead>
        <tr>
            @foreach (($columns ?? []) as $col)
                <th>{{ $col['label'] ?? $col['key'] ?? '' }}</th>
            @endforeach
        </tr>
        </thead>
        <tbody>
        @forelse (($rows ?? []) as $row)
            <tr>
                @foreach (($columns ?? []) as $col)
                    <td>{{ data_get($row, $col['key'] ?? '') }}</td>
                @endforeach
            </tr>
        @empty
            <tr>
                <td colspan="{{ count($columns ?? []) }}">No data</td>
            </tr>
        @endforelse
        </tbody>
    </table>
</body>
</html>

