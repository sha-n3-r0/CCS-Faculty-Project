<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'student_number',
        'name',
        'email',
        'date_of_birth',
        'gender',
        'address',
        'academic_program',
        'year_level',
        'enrollment_status',
        'current_gpa',
        'photo_path',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'current_gpa' => 'decimal:2',
        ];
    }

    /**
     * @return HasMany<StudentAcademicHistory, $this>
     */
    public function academicHistories(): HasMany
    {
        return $this->hasMany(StudentAcademicHistory::class);
    }

    /**
     * @return HasMany<StudentNonAcademicActivity, $this>
     */
    public function nonAcademicActivities(): HasMany
    {
        return $this->hasMany(StudentNonAcademicActivity::class);
    }

    /**
     * @return HasMany<StudentViolation, $this>
     */
    public function violations(): HasMany
    {
        return $this->hasMany(StudentViolation::class);
    }

    /**
     * @return HasMany<StudentSkillAffiliation, $this>
     */
    public function skillAffiliations(): HasMany
    {
        return $this->hasMany(StudentSkillAffiliation::class);
    }
}
