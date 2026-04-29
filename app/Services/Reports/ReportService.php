<?php

namespace App\Services\Reports;

use App\Models\Student;
use App\Models\StudentViolation;
use Illuminate\Support\Str;

class ReportService
{
    /**
     * @return array{title: string, columns: list<array{key: string, label: string}>, rows: list<array<string, mixed>>, meta: array<string, mixed>}
     */
    public function generate(string $reportType, array $filters = []): array
    {
        return match ($reportType) {
            'enrollment_by_status' => $this->enrollmentByStatus(),
            'violations_by_status' => $this->violationsByStatus($filters),
            default => throw new \InvalidArgumentException('Unknown reportType: '.$reportType),
        };
    }

    /**
     * @return array{title: string, columns: list<array{key: string, label: string}>, rows: list<array<string, mixed>>, meta: array<string, mixed>}
     */
    private function enrollmentByStatus(): array
    {
        $rows = Student::query()
            ->selectRaw('enrollment_status as status, count(*) as total')
            ->groupBy('enrollment_status')
            ->orderBy('enrollment_status')
            ->get()
            ->map(fn ($r) => [
                'id' => 'ENR_'.Str::upper(Str::slug((string) $r->status, '_')),
                'status' => (string) $r->status,
                'total' => (int) $r->total,
            ])
            ->values()
            ->all();

        return [
            'title' => 'Enrollment Statistics (by Status)',
            'columns' => [
                ['key' => 'status', 'label' => 'Enrollment Status'],
                ['key' => 'total', 'label' => 'Total Students'],
            ],
            'rows' => $rows,
            'meta' => [
                'generated_at' => now()->toISOString(),
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array{title: string, columns: list<array{key: string, label: string}>, rows: list<array<string, mixed>>, meta: array<string, mixed>}
     */
    private function violationsByStatus(array $filters): array
    {
        $statusFilter = (string) ($filters['status'] ?? 'all');

        $q = StudentViolation::query();
        $appliedFilter = 'All Violations';

        if ($statusFilter === 'pending') {
            $q->where('status', '!=', 'Cleared');
            $appliedFilter = 'Pending Sanctions';
        } elseif ($statusFilter === 'cleared') {
            $q->where('status', '=', 'Cleared');
            $appliedFilter = 'Cleared';
        }

        $rows = $q
            ->selectRaw('status as status, count(*) as total')
            ->groupBy('status')
            ->orderBy('status')
            ->get()
            ->map(fn ($r) => [
                'id' => 'VIO_'.Str::upper(Str::slug((string) $r->status, '_')),
                'status' => (string) $r->status,
                'total' => (int) $r->total,
            ])
            ->values()
            ->all();

        return [
            'title' => 'Violations Summary (by Status)',
            'columns' => [
                ['key' => 'status', 'label' => 'Violation Status'],
                ['key' => 'total', 'label' => 'Total Violations'],
            ],
            'rows' => $rows,
            'meta' => [
                'generated_at' => now()->toISOString(),
                'filters' => [
                    'status' => $statusFilter,
                    'label' => $appliedFilter,
                ],
            ],
        ];
    }
}

