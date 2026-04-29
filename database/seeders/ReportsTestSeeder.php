<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\StudentViolation;
use Illuminate\Database\Seeder;

class ReportsTestSeeder extends Seeder
{
    public function run(): void
    {
        // Create a mix of students across enrollment_status values.
        $students = Student::factory()->count(40)->create();

        // Create violations for ~60% of students; mixed statuses for filtering.
        $students->shuffle()->take((int) round($students->count() * 0.6))->each(function (Student $s): void {
            StudentViolation::factory()
                ->count(fake()->numberBetween(1, 4))
                ->create([
                    'student_id' => $s->id,
                ]);
        });

        // Ensure we have some guaranteed rows for each key status.
        $sample = $students->first();
        if ($sample) {
            StudentViolation::factory()->create([
                'student_id' => $sample->id,
                'status' => 'Cleared',
            ]);
            StudentViolation::factory()->create([
                'student_id' => $sample->id,
                'status' => 'Pending',
            ]);
            StudentViolation::factory()->create([
                'student_id' => $sample->id,
                'status' => 'Under Review',
            ]);
        }
    }
}

