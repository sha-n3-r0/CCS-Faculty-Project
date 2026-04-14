<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/students', [StudentController::class, 'index'])->name('students');
    Route::get('/students/create', [StudentController::class, 'create'])->name('students.create');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::get('/students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::get('/students/{student}', [StudentController::class, 'show'])->name('students.show');

    Route::get('/reports', function () {
        return Inertia::render('Reports');
    })->name('reports');

    Route::middleware('admin')->group(function () {
        Route::get('/settings', [SettingsController::class, 'show'])->name('settings');
        Route::post('/settings/admins', [AdminUserController::class, 'store'])->name('settings.admins.store');
        Route::patch('/settings/admins/{user}', [AdminUserController::class, 'update'])->name('settings.admins.update');
        Route::delete('/settings/admins/{user}', [AdminUserController::class, 'destroy'])->name('settings.admins.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
