import React, { useRef, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const defaultData = {
    name: '',
    email: '',
    date_of_birth: '',
    gender: '',
    address: '',
    academic_program: 'BS Information Technology',
    year_level: '1st Year',
    enrollment_status: 'Enrolled',
    current_gpa: '',
    photo: null,
    academic_standing: '',
    academic_courses: [''],
    non_academic_activities: [
        { organization_name: '', role: '', duration: '', is_verified: false },
    ],
    violations: [
        { occurred_on: '', violation_type: '', status: '', sanction: '', notes: '' },
    ],
    skills: [''],
    affiliations: [''],
};

function buildFormData(student) {
    if (!student) {
        return { ...defaultData };
    }
    return {
        name: student.name ?? '',
        email: student.email ?? '',
        date_of_birth: student.date_of_birth ?? '',
        gender: student.gender ?? '',
        address: student.address ?? '',
        academic_program: student.academic_program ?? defaultData.academic_program,
        year_level: student.year_level ?? defaultData.year_level,
        enrollment_status: student.enrollment_status ?? defaultData.enrollment_status,
        current_gpa: student.current_gpa ?? '',
        photo: null,
        academic_standing: student.academic_standing ?? '',
        academic_courses: Array.isArray(student.academic_courses) ? student.academic_courses : [''],
        non_academic_activities: Array.isArray(student.non_academic_activities)
            ? student.non_academic_activities
            : defaultData.non_academic_activities,
        violations: Array.isArray(student.violations) ? student.violations : defaultData.violations,
        skills: Array.isArray(student.skills) ? student.skills : [''],
        affiliations: Array.isArray(student.affiliations) ? student.affiliations : [''],
    };
}

export default function StudentForm({ isEdit, studentId, student }) {
    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(student?.photo_url ?? null);

    const { data, setData, post, processing, errors, transform } = useForm(buildFormData(student));

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const useMultipart = data.photo instanceof File;
        if (isEdit && student?.id) {
            transform((formData) => ({ ...formData, _method: 'put' }));
            post(route('students.update', student.id), {
                forceFormData: useMultipart,
                onFinish: () => transform((d) => d),
            });
        } else {
            post(route('students.store'), { forceFormData: useMultipart });
        }
    };

    const fieldClass =
        'w-full bg-slate-50 border border-slate-200 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 rounded-xl px-5 py-3 text-[14px] font-semibold text-slate-700 outline-none transition-all shadow-inner';
    const err = (name) =>
        errors[name] ? (
            <p className="text-[11px] font-bold text-red-500 mt-1 ml-2">{errors[name]}</p>
        ) : null;

    const addCourse = () => setData('academic_courses', [...data.academic_courses, '']);
    const removeCourse = (index) => {
        const next = data.academic_courses.filter((_, i) => i !== index);
        setData('academic_courses', next.length ? next : ['']);
    };

    const addActivity = () =>
        setData('non_academic_activities', [
            ...data.non_academic_activities,
            { organization_name: '', role: '', duration: '', is_verified: false },
        ]);
    const removeActivity = (index) => {
        const next = data.non_academic_activities.filter((_, i) => i !== index);
        setData('non_academic_activities', next.length ? next : defaultData.non_academic_activities);
    };

    const addViolation = () =>
        setData('violations', [
            ...data.violations,
            { occurred_on: '', violation_type: '', status: '', sanction: '', notes: '' },
        ]);
    const removeViolation = (index) => {
        const next = data.violations.filter((_, i) => i !== index);
        setData('violations', next.length ? next : defaultData.violations);
    };

    const addSkill = () => setData('skills', [...data.skills, '']);
    const removeSkill = (index) => {
        const next = data.skills.filter((_, i) => i !== index);
        setData('skills', next.length ? next : ['']);
    };

    const addAffiliation = () => setData('affiliations', [...data.affiliations, '']);
    const removeAffiliation = (index) => {
        const next = data.affiliations.filter((_, i) => i !== index);
        setData('affiliations', next.length ? next : ['']);
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Student Profile' : 'Add New Student'} activeTab="students">
            <div className="flex flex-col h-full font-['Montserrat'] relative animate-fade-in pb-12 w-full max-w-4xl mx-auto">
                <div className="flex items-center gap-6 mb-8 mt-2">
                    <Link
                        href={route('students')}
                        className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors focus:ring-2 focus:ring-orange-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">
                            {isEdit ? 'Edit Student Profile' : 'New Student Enrollment'}
                        </h2>
                        <p className="text-[13px] font-bold tracking-widest uppercase text-slate-400">
                            {isEdit
                                ? `Updating records for student ${studentId}`
                                : 'Enter new student information into the system.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <div className="bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-8 xl:p-10 animate-slide-up relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-300 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                        <h3 className="text-lg font-black tracking-tight text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                            Personal Information
                        </h3>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 mb-8 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 group/upload">
                            <div className="w-[100px] h-[100px] rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm relative cursor-pointer transition-all hover:border-orange-300 group-hover/upload:shadow-md">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <svg
                                        className="w-8 h-8 text-slate-300 group-hover/upload:text-orange-400 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                )}
                                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                    <span className="text-white text-[10px] font-black tracking-widest uppercase">UPLOAD</span>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="photo"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-[14px] font-black text-slate-800">Student Profile Photo</h4>
                                <p className="text-[12px] font-medium text-slate-500 mt-1 max-w-sm">
                                    Upload a high-resolution 2x2 or passport style photo. PNG or JPG, max 5MB.
                                </p>
                                <button
                                    type="button"
                                    className="mt-4 px-6 py-2.5 bg-white border border-slate-200 hover:border-orange-300 hover:text-orange-600 rounded-xl text-[11px] font-bold tracking-widest uppercase text-slate-600 shadow-sm transition-colors focus:ring-2 focus:ring-orange-100"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Choose File
                                </button>
                            </div>
                        </div>
                        {err('photo')}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={fieldClass}
                                    placeholder="E.g., John Doe"
                                    required
                                />
                                {err('name')}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={fieldClass}
                                    placeholder="student@edu.ph"
                                    required
                                />
                                {err('email')}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className={fieldClass}
                                    required
                                />
                                {err('date_of_birth')}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Gender</label>
                                <select
                                    name="gender"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className={fieldClass + ' cursor-pointer'}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {err('gender')}
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Home Address</label>
                                <textarea
                                    name="address"
                                    rows="2"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className={fieldClass + ' resize-none'}
                                    placeholder="Provide full address..."
                                    required
                                />
                                {err('address')}
                            </div>
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-8 xl:p-10 animate-slide-up relative overflow-hidden group"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-300 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

                        <h3 className="text-lg font-black tracking-tight text-slate-800 mb-6 flex items-center gap-2 relative z-10">Academic History</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Academic Program</label>
                                <select
                                    name="academic_program"
                                    value={data.academic_program}
                                    onChange={(e) => setData('academic_program', e.target.value)}
                                    className={fieldClass + ' cursor-pointer'}
                                >
                                    <option value="BS Information Technology">BS Information Technology</option>
                                    <option value="BS Computer Science">BS Computer Science</option>
                                    <option value="BS Information Systems">BS Information Systems</option>
                                </select>
                                {err('academic_program')}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Year Level</label>
                                <select
                                    name="year_level"
                                    value={data.year_level}
                                    onChange={(e) => setData('year_level', e.target.value)}
                                    className={fieldClass + ' cursor-pointer'}
                                >
                                    <option value="1st Year">1st Year</option>
                                    <option value="2nd Year">2nd Year</option>
                                    <option value="3rd Year">3rd Year</option>
                                    <option value="4th Year">4th Year</option>
                                </select>
                                {err('year_level')}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Enrollment Status</label>
                                <select
                                    name="enrollment_status"
                                    value={data.enrollment_status}
                                    onChange={(e) => setData('enrollment_status', e.target.value)}
                                    className={fieldClass + ' cursor-pointer'}
                                >
                                    <option value="Enrolled">Enrolled</option>
                                    <option value="Not Enrolled">Not Enrolled</option>
                                    <option value="Leave of Absence">Leave of Absence</option>
                                    <option value="Graduated">Graduated</option>
                                </select>
                                {err('enrollment_status')}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Current GPA</label>
                                <input
                                    type="text"
                                    name="current_gpa"
                                    inputMode="decimal"
                                    value={data.current_gpa}
                                    onChange={(e) => setData('current_gpa', e.target.value)}
                                    className={fieldClass + ' text-green-600'}
                                    placeholder="e.g. 1.25"
                                />
                                {err('current_gpa')}
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Academic standing</label>
                                <input
                                    type="text"
                                    value={data.academic_standing}
                                    onChange={(e) => setData('academic_standing', e.target.value)}
                                    className={fieldClass}
                                    placeholder="e.g., Dean's Lister"
                                />
                                {err('academic_standing')}
                            </div>
                        </div>

                        <div className="mt-8 space-y-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Current courses</label>
                                <button
                                    type="button"
                                    onClick={addCourse}
                                    className="text-orange-500 font-bold text-[11px] uppercase tracking-widest hover:text-orange-600"
                                >
                                    + Add course
                                </button>
                            </div>
                            {data.academic_courses.map((course, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <input
                                        type="text"
                                        value={course}
                                        onChange={(e) => {
                                            const next = [...data.academic_courses];
                                            next[index] = e.target.value;
                                            setData('academic_courses', next);
                                        }}
                                        className={fieldClass}
                                        placeholder="Course title"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeCourse(index)}
                                        className="shrink-0 px-3 py-3 text-[11px] font-bold uppercase text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {err('academic_courses')}
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-8 xl:p-10 animate-slide-up relative overflow-hidden group"
                        style={{ animationDelay: '0.15s' }}
                    >
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-300 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black tracking-tight text-slate-800">Non-academic activities</h3>
                            <button
                                type="button"
                                onClick={addActivity}
                                className="text-orange-500 font-bold text-[11px] uppercase tracking-widest hover:text-orange-600"
                            >
                                + Add activity
                            </button>
                        </div>
                        <div className="space-y-5">
                            {data.non_academic_activities.map((row, index) => (
                                <div key={index} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/80 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Organization</label>
                                            <input
                                                type="text"
                                                value={row.organization_name}
                                                onChange={(e) => {
                                                    const next = [...data.non_academic_activities];
                                                    next[index] = { ...row, organization_name: e.target.value };
                                                    setData('non_academic_activities', next);
                                                }}
                                                className={fieldClass}
                                                placeholder="Club or organization"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Role</label>
                                            <input
                                                type="text"
                                                value={row.role}
                                                onChange={(e) => {
                                                    const next = [...data.non_academic_activities];
                                                    next[index] = { ...row, role: e.target.value };
                                                    setData('non_academic_activities', next);
                                                }}
                                                className={fieldClass}
                                                placeholder="e.g., President"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Duration</label>
                                            <input
                                                type="text"
                                                value={row.duration}
                                                onChange={(e) => {
                                                    const next = [...data.non_academic_activities];
                                                    next[index] = { ...row, duration: e.target.value };
                                                    setData('non_academic_activities', next);
                                                }}
                                                className={fieldClass}
                                                placeholder="e.g., 2023 - Present"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                        <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(row.is_verified)}
                                                onChange={(e) => {
                                                    const next = [...data.non_academic_activities];
                                                    next[index] = { ...row, is_verified: e.target.checked };
                                                    setData('non_academic_activities', next);
                                                }}
                                                className="rounded border-slate-300 text-orange-500 focus:ring-orange-200"
                                            />
                                            Verified
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeActivity(index)}
                                            className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500"
                                        >
                                            Remove row
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-8 xl:p-10 animate-slide-up relative overflow-hidden group"
                        style={{ animationDelay: '0.18s' }}
                    >
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-200 to-orange-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black tracking-tight text-slate-800">Violations</h3>
                            <button
                                type="button"
                                onClick={addViolation}
                                className="text-orange-500 font-bold text-[11px] uppercase tracking-widest hover:text-orange-600"
                            >
                                + Add record
                            </button>
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 mb-5">Leave rows blank to skip. All fields in a row must be filled to save that record.</p>
                        <div className="space-y-5">
                            {data.violations.map((row, index) => (
                                <div key={index} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/80 space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Date</label>
                                            <input
                                                type="date"
                                                value={row.occurred_on}
                                                onChange={(e) => {
                                                    const next = [...data.violations];
                                                    next[index] = { ...row, occurred_on: e.target.value };
                                                    setData('violations', next);
                                                }}
                                                className={fieldClass}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Status</label>
                                            <select
                                                value={row.status}
                                                onChange={(e) => {
                                                    const next = [...data.violations];
                                                    next[index] = { ...row, status: e.target.value };
                                                    setData('violations', next);
                                                }}
                                                className={fieldClass + ' cursor-pointer'}
                                            >
                                                <option value="">Select status</option>
                                                <option value="Cleared">Cleared</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Under review">Under review</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Violation type</label>
                                            <input
                                                type="text"
                                                value={row.violation_type}
                                                onChange={(e) => {
                                                    const next = [...data.violations];
                                                    next[index] = { ...row, violation_type: e.target.value };
                                                    setData('violations', next);
                                                }}
                                                className={fieldClass}
                                                placeholder="Short description"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Sanction</label>
                                            <input
                                                type="text"
                                                value={row.sanction}
                                                onChange={(e) => {
                                                    const next = [...data.violations];
                                                    next[index] = { ...row, sanction: e.target.value };
                                                    setData('violations', next);
                                                }}
                                                className={fieldClass}
                                                placeholder="e.g., Warning"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Notes (optional)</label>
                                            <textarea
                                                rows={2}
                                                value={row.notes}
                                                onChange={(e) => {
                                                    const next = [...data.violations];
                                                    next[index] = { ...row, notes: e.target.value };
                                                    setData('violations', next);
                                                }}
                                                className={fieldClass + ' resize-none'}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeViolation(index)}
                                        className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500"
                                    >
                                        Remove row
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-8 xl:p-10 animate-slide-up relative overflow-hidden group"
                        style={{ animationDelay: '0.2s' }}
                    >
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-300 to-orange-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-lg font-black tracking-tight text-slate-800 mb-6">Skills & affiliations</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Skills</label>
                                    <button
                                        type="button"
                                        onClick={addSkill}
                                        className="text-orange-500 font-bold text-[11px] uppercase tracking-widest hover:text-orange-600"
                                    >
                                        + Add skill
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.skills.map((skill, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => {
                                                    const next = [...data.skills];
                                                    next[index] = e.target.value;
                                                    setData('skills', next);
                                                }}
                                                className={fieldClass}
                                                placeholder="e.g., React"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(index)}
                                                className="shrink-0 px-3 py-3 text-[11px] font-bold uppercase text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Affiliations</label>
                                    <button
                                        type="button"
                                        onClick={addAffiliation}
                                        className="text-orange-500 font-bold text-[11px] uppercase tracking-widest hover:text-orange-600"
                                    >
                                        + Add affiliation
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.affiliations.map((line, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={line}
                                                onChange={(e) => {
                                                    const next = [...data.affiliations];
                                                    next[index] = e.target.value;
                                                    setData('affiliations', next);
                                                }}
                                                className={fieldClass}
                                                placeholder="e.g., Varsity team (role)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAffiliation(index)}
                                                className="shrink-0 px-3 py-3 text-[11px] font-bold uppercase text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center justify-end animate-slide-up mt-8" style={{ animationDelay: '0.3s' }}>
                        <Link
                            href={route('students')}
                            className="px-6 py-3.5 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl font-bold shadow-sm transition-colors text-[11px] uppercase tracking-widest"
                        >
                            Cancel
                        </Link>
                        <button
                            disabled={processing}
                            type="submit"
                            className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all active:scale-95 text-[11px] uppercase tracking-widest disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Processing Payload...' : isEdit ? 'Save Changes' : '+ Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
