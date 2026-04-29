<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentViolation;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $studentsTotal = Student::query()->count();
        $studentsEnrolled = Student::query()->where('enrollment_status', 'Enrolled')->count();

        $violationsTotal = StudentViolation::query()->count();
        $violationsPending = StudentViolation::query()
            ->where('status', '!=', 'Cleared')
            ->count();

        $studentsEnrolledRate = $studentsTotal > 0
            ? (int) round(($studentsEnrolled / $studentsTotal) * 100)
            : null;

        $chartBars = [];
        if ($studentsTotal > 0 || $violationsTotal > 0) {
            $statusCounts = [
                'Enrolled' => Student::query()->where('enrollment_status', 'Enrolled')->count(),
                'Not Enrolled' => Student::query()->where('enrollment_status', 'Not Enrolled')->count(),
                'Leave of Absence' => Student::query()->where('enrollment_status', 'Leave of Absence')->count(),
                'Graduated' => Student::query()->where('enrollment_status', 'Graduated')->count(),
            ];

            $enrolledPct = (int) round(($statusCounts['Enrolled'] / max($studentsTotal, 1)) * 100);
            $notEnrolledPct = (int) round(($statusCounts['Not Enrolled'] / max($studentsTotal, 1)) * 100);
            $loaPct = (int) round(($statusCounts['Leave of Absence'] / max($studentsTotal, 1)) * 100);
            $graduatedPct = (int) round(($statusCounts['Graduated'] / max($studentsTotal, 1)) * 100);

            $pendingPct = (int) round(($violationsPending / max($studentsTotal, 1)) * 100);
            $violationsPct = (int) round(($violationsTotal / max($studentsTotal, 1)) * 100);

            $chartBars = [
                min(100, max(0, $enrolledPct)),
                min(100, max(0, $notEnrolledPct)),
                min(100, max(0, $loaPct)),
                min(100, max(0, $graduatedPct)),
                min(100, max(0, $pendingPct)),
                min(100, max(0, $violationsPct)),
                min(100, max(0, $enrolledPct)),
            ];
        }

        $recentFeed = $this->recentFeed();

        return Inertia::render('Dashboard', [
            'overview' => [
                'students_total' => $studentsTotal,
                'students_enrolled' => $studentsEnrolled,
                'students_enrolled_rate' => $studentsEnrolledRate,
                'violations_total' => $violationsTotal,
                'violations_pending' => $violationsPending,
                'health_ok' => $studentsTotal > 0,
                'chart_bars' => $chartBars,
                'recent_feed' => $recentFeed,
            ],
        ]);
    }

    /**
     * @return list<array{title: string, subtitle: string}>
     */
    private function recentFeed(): array
    {
        $latestStudents = Student::query()
            ->latest('created_at')
            ->limit(5)
            ->get(['name', 'student_number', 'created_at'])
            ->map(fn (Student $s) => [
                'title' => 'Student added',
                'subtitle' => trim(($s->student_number ? $s->student_number.' • ' : '').$s->name),
                'created_at' => $s->created_at?->toISOString(),
            ]);

        $latestViolations = StudentViolation::query()
            ->with('student:id,name,student_number')
            ->latest('occurred_on')
            ->limit(5)
            ->get()
            ->map(fn (StudentViolation $v) => [
                'title' => 'Violation recorded',
                'subtitle' => trim(
                    (($v->student?->student_number ? $v->student->student_number.' • ' : '').
                        ($v->student?->name ?? '')).
                        ($v->violation_type ? ' — '.$v->violation_type : '')
                ),
                'created_at' => $v->created_at?->toISOString(),
            ]);

        /** @var Collection<int, array{title: string, subtitle: string, created_at: ?string}> $merged */
        $merged = $latestStudents
            ->concat($latestViolations)
            ->sortByDesc(fn (array $row) => $row['created_at'] ?? '')
            ->values()
            ->take(5);

        return $merged
            ->map(fn (array $row) => [
                'title' => $row['title'],
                'subtitle' => $row['subtitle'],
            ])
            ->all();
    }
}

