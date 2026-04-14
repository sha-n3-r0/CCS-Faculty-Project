<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_number')->nullable()->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->date('date_of_birth');
            $table->string('gender')->nullable();
            $table->text('address');
            $table->string('academic_program');
            $table->string('year_level');
            $table->string('enrollment_status');
            $table->decimal('current_gpa', 4, 2)->nullable();
            $table->string('photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
