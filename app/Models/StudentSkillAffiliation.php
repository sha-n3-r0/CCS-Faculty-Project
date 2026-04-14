<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSkillAffiliation extends Model
{
    public const TYPE_SKILL = 'skill';

    public const TYPE_AFFILIATION = 'affiliation';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'student_id',
        'entry_type',
        'name',
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
