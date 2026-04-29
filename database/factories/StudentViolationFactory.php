<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentViolation>
 */
class StudentViolationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = [
            'Uniform Violation',
            'Late Attendance',
            'Misconduct',
            'Academic Dishonesty',
        ];

        $statuses = [
            'Pending',
            'Under Review',
            'Cleared',
        ];

        $sanctions = [
            'Warning',
            'Community Service',
            'Suspension',
        ];

        return [
            'student_id' => Student::factory(),
            'occurred_on' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'violation_type' => fake()->randomElement($types),
            'status' => fake()->randomElement($statuses),
            'sanction' => fake()->randomElement($sanctions),
            'notes' => fake()->optional(0.6)->sentence(10),
            'sort_order' => 0,
        ];
    }
}

