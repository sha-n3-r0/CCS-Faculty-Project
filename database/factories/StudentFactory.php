<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        $programs = ['BSIT', 'BSCS', 'BSIS'];
        $statuses = ['Enrolled', 'Not Enrolled', 'Leave of Absence', 'Graduated'];

        return [
            'student_number' => null,
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'date_of_birth' => fake()->dateTimeBetween('-25 years', '-17 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['Male', 'Female', 'Other', null]),
            'address' => fake()->address(),
            'academic_program' => fake()->randomElement($programs),
            'year_level' => fake()->randomElement($yearLevels),
            'enrollment_status' => fake()->randomElement($statuses),
            'current_gpa' => fake()->optional(0.7)->randomFloat(2, 1.0, 5.0),
            'photo_path' => null,
        ];
    }
}

