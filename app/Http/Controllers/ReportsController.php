<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentViolation;
use App\Services\Reports\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function index(): Response
    {
        $studentsTotal = Student::query()->count();
        $studentsEnrolled = Student::query()->where('enrollment_status', 'Enrolled')->count();

        $violationsTotal = StudentViolation::query()->count();
        $violationsPending = StudentViolation::query()
            ->where('status', '!=', 'Cleared')
            ->count();

        return Inertia::render('Reports', [
            'overview' => [
                'students_total' => $studentsTotal,
                'students_enrolled' => $studentsEnrolled,
                'violations_total' => $violationsTotal,
                'violations_pending' => $violationsPending,
            ],
        ]);
    }

    public function preview(Request $request, ReportService $reports): JsonResponse
    {
        $validated = $request->validate([
            'reportType' => ['required', 'string', 'in:enrollment_by_status,violations_by_status'],
            'filters' => ['sometimes', 'array'],
            'filters.status' => ['sometimes', 'string', 'in:all,pending,cleared'],
        ]);

        $reportType = $validated['reportType'];
        /** @var array<string, mixed> $filters */
        $filters = $validated['filters'] ?? [];

        $result = $reports->generate($reportType, $filters);

        return response()->json(array_merge(
            ['reportType' => $reportType],
            $result
        ));
    }

    public function exportCsv(Request $request, ReportService $reports): StreamedResponse
    {
        $validated = $request->validate([
            'reportType' => ['required', 'string', 'in:enrollment_by_status,violations_by_status'],
            'status' => ['sometimes', 'string', 'in:all,pending,cleared'],
        ]);

        $reportType = $validated['reportType'];
        $filters = [
            'status' => $validated['status'] ?? 'all',
        ];

        $result = $reports->generate($reportType, $filters);
        $columns = $result['columns'];
        $rows = $result['rows'];

        $filename = match ($reportType) {
            'enrollment_by_status' => 'enrollment_by_status.csv',
            'violations_by_status' => 'violations_by_status.csv',
        };

        return response()->streamDownload(function () use ($columns, $rows): void {
            $out = fopen('php://output', 'wb');
            if (! $out) {
                return;
            }

            fputcsv($out, array_map(fn ($c) => (string) ($c['label'] ?? ''), $columns));

            foreach ($rows as $row) {
                fputcsv($out, array_map(
                    fn ($c) => $row[$c['key']] ?? '',
                    $columns
                ));
            }

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function exportPdf(Request $request, ReportService $reports)
    {
        $validated = $request->validate([
            'reportType' => ['required', 'string', 'in:enrollment_by_status,violations_by_status'],
            'status' => ['sometimes', 'string', 'in:all,pending,cleared'],
        ]);

        $reportType = $validated['reportType'];
        $filters = [
            'status' => $validated['status'] ?? 'all',
        ];

        $result = $reports->generate($reportType, $filters);

        $filename = match ($reportType) {
            'enrollment_by_status' => 'enrollment_by_status.pdf',
            'violations_by_status' => 'violations_by_status.pdf',
        };

        /** @var \Barryvdh\DomPDF\PDF $pdf */
        $pdf = app('dompdf.wrapper');
        $pdf->loadView('reports.report-pdf', [
            'title' => $result['title'],
            'columns' => $result['columns'],
            'rows' => $result['rows'],
            'meta' => $result['meta'],
        ]);

        return $pdf->download($filename);
    }
}

