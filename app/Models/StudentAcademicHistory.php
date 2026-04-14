<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAcademicHistory extends Model
{
    public const TYPE_COURSE = 'course';

    public const TYPE_STANDING = 'standing';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'student_id',
        'record_type',
        'title',
        'semester',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Student, $this>
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
