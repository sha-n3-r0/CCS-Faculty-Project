<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AuditLogsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/students', [StudentController::class, 'index'])->name('students');
    Route::get('/students/create', [StudentController::class, 'create'])->name('students.create');
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::get('/students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
    Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::get('/students/{student}', [StudentController::class, 'show'])->name('students.show');

    Route::get('/reports', [ReportsController::class, 'index'])->name('reports');
    Route::post('/reports/preview', [ReportsController::class, 'preview'])->name('reports.preview');
    Route::get('/reports/export.csv', [ReportsController::class, 'exportCsv'])->name('reports.export.csv');
    Route::get('/reports/export.pdf', [ReportsController::class, 'exportPdf'])->name('reports.export.pdf');

    Route::middleware('admin')->group(function () {
        Route::get('/settings', [SettingsController::class, 'show'])->name('settings');
        Route::post('/settings/config', [SettingsController::class, 'updateConfig'])->name('settings.config.update');
        Route::get('/settings/audit-logs', [AuditLogsController::class, 'index'])->name('settings.audit.index');
        Route::post('/settings/admins', [AdminUserController::class, 'store'])->name('settings.admins.store');
        Route::patch('/settings/admins/{user}', [AdminUserController::class, 'update'])->name('settings.admins.update');
        Route::delete('/settings/admins/{user}', [AdminUserController::class, 'destroy'])->name('settings.admins.destroy');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
