<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\StudentAcademicHistory;
use App\Models\StudentNonAcademicActivity;
use App\Models\StudentSkillAffiliation;
use App\Models\StudentViolation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'program' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:255'],
        ]);

        $q = trim((string) ($validated['q'] ?? ''));
        $program = trim((string) ($validated['program'] ?? ''));
        $year = trim((string) ($validated['year'] ?? ''));
        $status = trim((string) ($validated['status'] ?? ''));

        $students = Student::query()
            ->when($q !== '', function ($query) use ($q) {
                $like = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $q).'%';

                $query->where(function ($sub) use ($q, $like) {
                    $sub->where('name', 'like', $like)
                        ->orWhere('email', 'like', $like)
                        ->orWhere('student_number', 'like', $like);

                    if (ctype_digit($q)) {
                        $sub->orWhere('id', '=', (int) $q);
                    }
                });
            })
            ->when($program !== '' && ! Str::contains($program, ': All'), fn ($query) => $query->where('academic_program', $program))
            ->when($year !== '' && ! Str::contains($year, ': All'), fn ($query) => $query->where('year_level', $year))
            ->when($status !== '' && ! Str::contains($status, ': All'), fn ($query) => $query->where('enrollment_status', $status))
            ->orderByDesc('created_at')
            ->paginate(50)
            ->withQueryString()
            ->through(fn (Student $s) => [
                'id' => $s->id,
                'student_number' => $s->student_number,
                'name' => $s->name,
                'program' => $s->academic_program,
                'year' => $s->year_level,
                'gpa' => $s->current_gpa !== null
                    ? number_format((float) $s->current_gpa, 2)
                    : '—',
                'status' => $s->enrollment_status,
                'photo_url' => $s->photo_path && Storage::disk('public')->exists($s->photo_path)
                    ? asset('storage/'.$s->photo_path)
                    : null,
            ]);

        return Inertia::render('StudentList', [
            'students' => $students,
            'filters' => [
                'q' => $q,
                'program' => $program,
                'year' => $year,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new student.
     */
    public function create(): Response
    {
        return Inertia::render('StudentForm', [
            'isEdit' => false,
        ]);
    }

    /**
     * Store a newly created student in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->prepareStudentRequest($request);
        $this->mergeExtensionDefaults($request);

        $validated = $request->validate(array_merge(
            $this->coreStudentRules(null),
            $this->extensionStudentRules()
        ));

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('students', 'public');
        }

        $core = Arr::only($validated, [
            'name', 'email', 'date_of_birth', 'gender', 'address',
            'academic_program', 'year_level', 'enrollment_status', 'current_gpa',
        ]);

        $student = Student::create(array_merge($core, [
            'photo_path' => $photoPath,
        ]));

        $student->update([
            'student_number' => sprintf('%d-%05d', now()->year, $student->id),
        ]);

        $this->syncExtensionTables($student, $validated);

        return redirect()
            ->route('students.show', $student)
            ->with('success', 'Student enrolled successfully.');
    }

    /**
     * Display the specified student.
     */
    public function show(Student $student): Response
    {
        $student->load($this->extensionRelations());

        return Inertia::render('StudentProfile', [
            'studentId' => $student->student_number ?? (string) $student->id,
            'studentRecord' => $this->studentRecordPayload($student),
        ]);
    }

    /**
     * Show the form for editing the specified student.
     */
    public function edit(Student $student): Response
    {
        $student->load($this->extensionRelations());

        return Inertia::render('StudentForm', [
            'isEdit' => true,
            'studentId' => $student->id,
            'student' => $this->studentFormPayload($student),
        ]);
    }

    /**
     * Update the specified student in storage.
     */
    public function update(Request $request, Student $student): RedirectResponse
    {
        $this->prepareStudentRequest($request);
        $this->mergeExtensionDefaults($request);

        $validated = $request->validate(array_merge(
            $this->coreStudentRules($student->id),
            $this->extensionStudentRules()
        ));

        $data = Arr::only($validated, [
            'name', 'email', 'date_of_birth', 'gender', 'address',
            'academic_program', 'year_level', 'enrollment_status', 'current_gpa',
        ]);

        if ($request->hasFile('photo')) {
            if ($student->photo_path) {
                Storage::disk('public')->delete($student->photo_path);
            }
            $data['photo_path'] = $request->file('photo')->store('students', 'public');
        }

        $student->update($data);

        $this->syncExtensionTables($student, $validated);

        return redirect()
            ->route('students.show', $student)
            ->with('success', 'Student record updated.');
    }

    /**
     * @return list<string>
     */
    private function extensionRelations(): array
    {
        return [
            'academicHistories',
            'nonAcademicActivities',
            'violations',
            'skillAffiliations',
        ];
    }

    private function mergeExtensionDefaults(Request $request): void
    {
        $request->mergeIfMissing([
            'academic_courses' => [],
            'non_academic_activities' => [],
            'violations' => [],
            'skills' => [],
            'affiliations' => [],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function coreStudentRules(?int $ignoreStudentId): array
    {
        $emailRule = ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:students,email'];
        if ($ignoreStudentId !== null) {
            $emailRule = ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:students,email,'.$ignoreStudentId];
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => $emailRule,
            'date_of_birth' => ['required', 'date'],
            'gender' => ['nullable', 'string', 'in:Male,Female,Other'],
            'address' => ['required', 'string'],
            'academic_program' => ['required', 'string', 'max:255'],
            'year_level' => ['required', 'string', 'max:255'],
            'enrollment_status' => ['required', 'string', 'max:255'],
            'current_gpa' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function extensionStudentRules(): array
    {
        return [
            'academic_standing' => ['nullable', 'string', 'max:255'],
            'academic_courses' => ['nullable', 'array', 'max:50'],
            'academic_courses.*' => ['nullable', 'string', 'max:255'],
            'non_academic_activities' => ['nullable', 'array', 'max:30'],
            'non_academic_activities.*.organization_name' => ['nullable', 'string', 'max:255'],
            'non_academic_activities.*.role' => ['nullable', 'string', 'max:255'],
            'non_academic_activities.*.duration' => ['nullable', 'string', 'max:255'],
            'non_academic_activities.*.is_verified' => ['nullable', 'boolean'],
            'violations' => ['nullable', 'array', 'max:30'],
            'violations.*.occurred_on' => ['nullable', 'date'],
            'violations.*.violation_type' => ['nullable', 'string', 'max:255'],
            'violations.*.status' => ['nullable', 'string', 'max:64'],
            'violations.*.sanction' => ['nullable', 'string', 'max:255'],
            'violations.*.notes' => ['nullable', 'string', 'max:2000'],
            'skills' => ['nullable', 'array', 'max:50'],
            'skills.*' => ['nullable', 'string', 'max:255'],
            'affiliations' => ['nullable', 'array', 'max:30'],
            'affiliations.*' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    private function syncExtensionTables(Student $student, array $validated): void
    {
        DB::transaction(function () use ($student, $validated): void {
            $student->academicHistories()->delete();

            $standing = trim((string) ($validated['academic_standing'] ?? ''));
            if ($standing !== '') {
                $student->academicHistories()->create([
                    'record_type' => StudentAcademicHistory::TYPE_STANDING,
                    'title' => $standing,
                    'semester' => null,
                    'sort_order' => 0,
                ]);
            }

            $order = 0;
            foreach ($this->normalizedStringList($validated['academic_courses'] ?? []) as $title) {
                $student->academicHistories()->create([
                    'record_type' => StudentAcademicHistory::TYPE_COURSE,
                    'title' => $title,
                    'semester' => null,
                    'sort_order' => $order++,
                ]);
            }

            $student->nonAcademicActivities()->delete();
            $order = 0;
            foreach ($this->normalizedActivities($validated['non_academic_activities'] ?? []) as $row) {
                $student->nonAcademicActivities()->create([
                    'organization_name' => $row['organization_name'],
                    'role' => $row['role'],
                    'duration' => $row['duration'] ?: null,
                    'is_verified' => (bool) ($row['is_verified'] ?? false),
                    'sort_order' => $order++,
                ]);
            }

            $student->violations()->delete();
            $order = 0;
            foreach ($this->normalizedViolations($validated['violations'] ?? []) as $row) {
                $student->violations()->create([
                    'occurred_on' => $row['occurred_on'],
                    'violation_type' => $row['violation_type'],
                    'status' => $row['status'],
                    'sanction' => $row['sanction'],
                    'notes' => $row['notes'] ?: null,
                    'sort_order' => $order++,
                ]);
            }

            $student->skillAffiliations()->delete();
            $order = 0;
            foreach ($this->normalizedStringList($validated['skills'] ?? []) as $name) {
                $student->skillAffiliations()->create([
                    'entry_type' => StudentSkillAffiliation::TYPE_SKILL,
                    'name' => $name,
                    'sort_order' => $order++,
                ]);
            }
            $order = 0;
            foreach ($this->normalizedStringList($validated['affiliations'] ?? []) as $name) {
                $student->skillAffiliations()->create([
                    'entry_type' => StudentSkillAffiliation::TYPE_AFFILIATION,
                    'name' => $name,
                    'sort_order' => $order++,
                ]);
            }
        });
    }

    /**
     * @param  list<mixed>  $rows
     * @return list<string>
     */
    private function normalizedStringList(array $rows): array
    {
        return collect($rows)
            ->map(fn ($v) => is_string($v) ? trim($v) : '')
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @param  list<mixed>  $rows
     * @return list<array{organization_name: string, role: string, duration: string, is_verified: bool}>
     */
    private function normalizedActivities(array $rows): array
    {
        $out = [];
        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }
            $org = trim((string) ($row['organization_name'] ?? ''));
            $role = trim((string) ($row['role'] ?? ''));
            if ($org === '' || $role === '') {
                continue;
            }
            $out[] = [
                'organization_name' => $org,
                'role' => $role,
                'duration' => trim((string) ($row['duration'] ?? '')),
                'is_verified' => (bool) ($row['is_verified'] ?? false),
            ];
        }

        return $out;
    }

    /**
     * @param  list<mixed>  $rows
     * @return list<array{occurred_on: string, violation_type: string, status: string, sanction: string, notes: string}>
     */
    private function normalizedViolations(array $rows): array
    {
        $out = [];
        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }
            $on = $row['occurred_on'] ?? null;
            $type = trim((string) ($row['violation_type'] ?? ''));
            $status = trim((string) ($row['status'] ?? ''));
            $sanction = trim((string) ($row['sanction'] ?? ''));
            if ($on === null || $on === '' || $type === '' || $status === '' || $sanction === '') {
                continue;
            }
            $out[] = [
                'occurred_on' => (string) $on,
                'violation_type' => $type,
                'status' => $status,
                'sanction' => $sanction,
                'notes' => trim((string) ($row['notes'] ?? '')),
            ];
        }

        return $out;
    }

    /**
     * @return array<string, mixed>
     */
    private function studentFormPayload(Student $student): array
    {
        $standing = $student->academicHistories
            ->where('record_type', StudentAcademicHistory::TYPE_STANDING)
            ->sortByDesc('id')
            ->first();

        $courses = $student->academicHistories
            ->where('record_type', StudentAcademicHistory::TYPE_COURSE)
            ->sortBy('sort_order')
            ->map(fn (StudentAcademicHistory $h) => $h->title)
            ->values()
            ->all();

        $activities = $student->nonAcademicActivities
            ->sortBy('sort_order')
            ->map(fn (StudentNonAcademicActivity $a) => [
                'organization_name' => $a->organization_name,
                'role' => $a->role,
                'duration' => $a->duration ?? '',
                'is_verified' => $a->is_verified,
            ])
            ->values()
            ->all();

        $violations = $student->violations
            ->sortBy('sort_order')
            ->map(fn (StudentViolation $v) => [
                'occurred_on' => $v->occurred_on->format('Y-m-d'),
                'violation_type' => $v->violation_type,
                'status' => $v->status,
                'sanction' => $v->sanction,
                'notes' => $v->notes ?? '',
            ])
            ->values()
            ->all();

        $skills = $student->skillAffiliations
            ->where('entry_type', StudentSkillAffiliation::TYPE_SKILL)
            ->sortBy('sort_order')
            ->pluck('name')
            ->all();

        $affiliations = $student->skillAffiliations
            ->where('entry_type', StudentSkillAffiliation::TYPE_AFFILIATION)
            ->sortBy('sort_order')
            ->pluck('name')
            ->all();

        return [
            'id' => $student->id,
            'name' => $student->name,
            'email' => $student->email,
            'date_of_birth' => $student->date_of_birth?->format('Y-m-d'),
            'gender' => $student->gender ?? '',
            'address' => $student->address,
            'academic_program' => $student->academic_program,
            'year_level' => $student->year_level,
            'enrollment_status' => $student->enrollment_status,
            'current_gpa' => $student->current_gpa !== null ? (string) $student->current_gpa : '',
            'photo_url' => $student->photo_path && Storage::disk('public')->exists($student->photo_path)
                ? asset('storage/'.$student->photo_path)
                : null,
            'academic_standing' => $standing?->title ?? '',
            'academic_courses' => count($courses) > 0 ? $courses : [''],
            'non_academic_activities' => count($activities) > 0 ? $activities : [
                ['organization_name' => '', 'role' => '', 'duration' => '', 'is_verified' => false],
            ],
            'violations' => count($violations) > 0 ? $violations : [
                ['occurred_on' => '', 'violation_type' => '', 'status' => '', 'sanction' => '', 'notes' => ''],
            ],
            'skills' => count($skills) > 0 ? $skills : [''],
            'affiliations' => count($affiliations) > 0 ? $affiliations : [''],
        ];
    }

    private function prepareStudentRequest(Request $request): void
    {
        if ($request->input('gender') === '') {
            $request->merge(['gender' => null]);
        }

        $gpa = $request->input('current_gpa');
        if ($gpa === '' || $gpa === null) {
            $request->merge(['current_gpa' => null]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function studentRecordPayload(Student $student): array
    {
        $photo = $student->photo_path
            && Storage::disk('public')->exists($student->photo_path)
            ? asset('storage/'.$student->photo_path)
            : asset('images/avatar-placeholder.svg');

        $standing = $student->academicHistories
            ->where('record_type', StudentAcademicHistory::TYPE_STANDING)
            ->sortByDesc('id')
            ->first();

        $courses = $student->academicHistories
            ->where('record_type', StudentAcademicHistory::TYPE_COURSE)
            ->sortBy('sort_order')
            ->map(fn (StudentAcademicHistory $h) => $h->title)
            ->values()
            ->all();

        $activities = $student->nonAcademicActivities
            ->sortBy('sort_order')
            ->map(fn (StudentNonAcademicActivity $a) => [
                'org' => $a->organization_name,
                'role' => $a->role,
                'duration' => $a->duration ?? '',
            ])
            ->values()
            ->all();

        $violations = $student->violations
            ->sortBy('sort_order')
            ->map(fn (StudentViolation $v) => [
                'date' => $v->occurred_on->format('M j, Y'),
                'type' => $v->violation_type,
                'status' => $v->status,
                'sanction' => $v->sanction,
            ])
            ->values()
            ->all();

        $skills = $student->skillAffiliations
            ->where('entry_type', StudentSkillAffiliation::TYPE_SKILL)
            ->sortBy('sort_order')
            ->pluck('name')
            ->values()
            ->all();

        $affiliations = $student->skillAffiliations
            ->where('entry_type', StudentSkillAffiliation::TYPE_AFFILIATION)
            ->sortBy('sort_order')
            ->pluck('name')
            ->values()
            ->all();

        return [
            'id' => $student->id,
            'student_number' => $student->student_number ?? (string) $student->id,
            'name' => $student->name,
            'email' => $student->email,
            'date_of_birth_display' => $student->date_of_birth?->format('M j, Y'),
            'gender' => $student->gender ?? '—',
            'address' => $student->address,
            'academic_program' => $student->academic_program,
            'year_level' => $student->year_level,
            'enrollment_status' => $student->enrollment_status,
            'current_gpa' => $student->current_gpa !== null
                ? number_format((float) $student->current_gpa, 2)
                : '—',
            'photo_url' => $photo,
            'academic' => [
                'standing' => $standing?->title ?? '—',
                'courses' => count($courses) > 0 ? $courses : [],
            ],
            'activities' => $activities,
            'violations' => $violations,
            'skills' => $skills,
            'affiliations' => $affiliations,
        ];
    }
}
