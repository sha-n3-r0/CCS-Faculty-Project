import React, { useState, useRef, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const placeholderStudent = {
    id: '2023-10001',
    name: 'Alexender M. Doe',
    program: 'BS Information Technology',
    year: '3rd Year',
    status: 'Enrolled',
    photo: null,
    gpa: '1.25',
    personal: {
        dob: 'May 14, 2003',
        gender: 'Male',
        contact: '+63 912 345 6789',
        email: 'alex.doe@student.edu.ph',
        address: '123 University Ave. Cityville',
    },
    academic: {
        standing: "Dean's Lister",
        courses: ['Advanced Web Development', 'Data Structures & Algorithms', 'Systems Analysis', 'Mobile App Development'],
    },
    activities: [{ org: 'Tech Innovators Club', role: 'President', duration: '2023 - Present' }],
    violations: [{ date: 'Oct 12, 2023', type: 'Late Library Book', status: 'Cleared', sanction: 'Warning' }],
    skills: ['ReactJS', 'TailwindCSS', 'Node.js', 'UI/UX Design'],
    affiliations: ['Varsity Basketball Team (Point Guard)'],
};

export default function StudentProfile({ studentId, studentRecord }) {
    const { avatarPlaceholderUrl } = usePage().props;
    const [coverImage, setCoverImage] = useState('/images/student_profile_bg.png');
    const [activeTab, setActiveTab] = useState('personal');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCoverImage(url);
        }
    };

    const student = useMemo(() => {
        if (!studentRecord) {
            return {
                ...placeholderStudent,
                id: studentId || placeholderStudent.id,
                photo: avatarPlaceholderUrl,
            };
        }
        return {
            ...placeholderStudent,
            id: studentRecord.student_number,
            name: studentRecord.name,
            program: studentRecord.academic_program,
            year: studentRecord.year_level,
            status: studentRecord.enrollment_status,
            photo: studentRecord.photo_url || avatarPlaceholderUrl,
            gpa: studentRecord.current_gpa,
            personal: {
                ...placeholderStudent.personal,
                dob: studentRecord.date_of_birth_display ?? placeholderStudent.personal.dob,
                gender: studentRecord.gender,
                email: studentRecord.email,
                address: studentRecord.address,
            },
            academic: studentRecord.academic ?? placeholderStudent.academic,
            activities: studentRecord.activities ?? placeholderStudent.activities,
            violations: studentRecord.violations ?? placeholderStudent.violations,
            skills: studentRecord.skills ?? placeholderStudent.skills,
            affiliations: studentRecord.affiliations ?? placeholderStudent.affiliations,
        };
    }, [studentId, studentRecord, avatarPlaceholderUrl]);

    const tabs = [
        { id: 'personal', label: 'Personal Information' },
        { id: 'academic', label: 'Academic History' },
        { id: 'activities', label: 'Non-Academic' },
        { id: 'violations', label: 'Violations' },
        { id: 'skills', label: 'Skills & Affiliations' },
    ];

    return (
        <AdminLayout title="Student Profile" activeTab="students">
            <div className="flex flex-col h-full font-sans relative animate-fade-in w-full pb-8">
                
                {/* Clean Header Navigation Frame */}
                <div className="flex items-center gap-6 mb-6 mt-2">
                    <Link href={route('students')} className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors focus:ring-2 focus:ring-orange-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">Student Profile Record</h2>
                        <p className="text-[12px] font-bold tracking-widest uppercase text-slate-400">Detailed overview of enrollment history and academic standing.</p>
                    </div>
                </div>

                {/* Profile Identity Card - Premium Landscape Banner */}
                <div className="relative w-full rounded-[32px] xl:rounded-[48px] min-h-[320px] shrink-0 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-200/60 mb-8 z-10 group flex items-end">
                    
                    {/* Background Landscape Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden bg-orange-50/30 pointer-events-none">
                        <img 
                            src={coverImage} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            alt="Landscape" 
                        />
                        {/* High-end gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-white/10"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent"></div>
                        {/* Dynamic frost effect */}
                        <div className="absolute inset-0 backdrop-blur-[2px] opacity-40 group-hover:opacity-0 transition-opacity duration-1000"></div>
                    </div>
                    
                    {/* Content Section with Glassmorphism Float */}
                    <div className="relative z-10 w-full p-8 md:p-12 flex flex-col md:flex-row gap-8 md:items-end justify-between animate-slide-up">
                        
                        {/* Glass Identity Card */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-10 bg-white/40 backdrop-blur-3xl p-6 sm:p-8 rounded-[40px] border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.12)] group-hover:bg-white/50 transition-all duration-500 flex-1 max-w-4xl relative">
                            {/* Inner glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 blur-[40px] -z-10 rounded-full"></div>
                            
                            <div className="w-32 h-32 rounded-[32px] border-2 border-white shadow-2xl overflow-hidden bg-white shrink-0 group-hover:scale-105 transition-transform duration-500 relative">
                                <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[32px]"></div>
                            </div>

                            <div className="text-center sm:text-left flex flex-col justify-end pb-1">
                                <div className="flex gap-3 justify-center sm:justify-start items-center mb-4">
                                    <span className="bg-orange-500 text-white border border-orange-400 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-[0.15em] shadow-lg shadow-orange-500/20">{student.status}</span>
                                    <span className="text-slate-900 font-black font-mono tracking-[0.2em] text-[12px] opacity-60">{student.id}</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
                                    {student.name}
                                </h1>
                                <p className="text-slate-800 text-[14px] font-black uppercase tracking-[0.1em] flex flex-wrap justify-center sm:justify-start items-center gap-3">
                                    <span className="opacity-70">{student.program}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> 
                                    <span className="text-orange-600">
                                        {student.year}
                                    </span>
                                </p>
                            </div>
                        </div>
                        
                        {/* Action Buttons Hub */}
                        <div className="flex flex-col md:flex-row gap-3 shrink-0 items-center md:items-end">
                            {/* Customizable Background Trigger */}
                            <div className="mb-2 md:mb-0">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleCoverChange} 
                                    className="hidden" 
                                    accept="image/*"
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white/20 hover:bg-white/40 text-white backdrop-blur-md px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black shadow-lg border border-white/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 group/bg-btn"
                                >
                                    <svg className="w-4 h-4 group-hover/bg-btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Change Cover
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button className="bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md px-6 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-black shadow-xl border border-white transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 group/btn">
                                    <svg className="w-4 h-4 text-orange-500 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    Print
                                </button>
                                <Link
                                    href={studentRecord ? route('students.edit', studentRecord.id) : '#'}
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl text-[11px] uppercase tracking-widest font-black shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 border border-orange-400"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Edit Record
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
                    
                    {/* Tabs Navigation (Vertical on Desktop, Horizontal on Mobile) */}
                    <div className="w-full lg:w-[280px] bg-white rounded-[24px] p-6 flex flex-col gap-2 shrink-0 border border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative z-20">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 mb-2">Record Categories</h3>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-left px-5 py-4 rounded-xl text-[13px] font-bold transition-all relative group overflow-hidden ${activeTab === tab.id ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                            >
                                <span className="relative z-10">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1.5 bg-orange-500 rounded-r-full animate-slide-up shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 w-full bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-200/60 p-8 xl:p-10 min-h-[400px] animate-fade-in relative z-10 overflow-hidden">
                        
                        {/* Tab Content: Personal */}
                        {activeTab === 'personal' && (
                            <div className="animate-slide-up h-full">
                                <h3 className="text-lg font-black tracking-tight text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</p>
                                        <p className="text-[15px] font-black text-slate-800 border-b border-slate-100 pb-2 group-hover:border-orange-200 transition-colors">{student.name}</p>
                                    </div>
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Date of Birth</p>
                                        <p className="text-[15px] font-black text-slate-800 border-b border-slate-100 pb-2 group-hover:border-orange-200 transition-colors">{student.personal.dob}</p>
                                    </div>
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Gender</p>
                                        <p className="text-[15px] font-black text-slate-800 border-b border-slate-100 pb-2 group-hover:border-orange-200 transition-colors">{student.personal.gender}</p>
                                    </div>
                                    <div className="group">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Contact Number</p>
                                        <p className="text-[15px] font-black text-slate-800 border-b border-slate-100 pb-2 group-hover:border-orange-200 transition-colors">{student.personal.contact}</p>
                                    </div>
                                    <div className="group md:col-span-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</p>
                                        <p className="text-[15px] font-black text-orange-600 border-b border-slate-100 pb-2 group-hover:border-orange-200 transition-colors">{student.personal.email}</p>
                                    </div>
                                    <div className="group md:col-span-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Home Address</p>
                                        <p className="text-[15px] font-black text-slate-800 border-b border-slate-100 pb-2 group-hover:border-orange-200 transition-colors">{student.personal.address}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Academic */}
                        {activeTab === 'academic' && (
                            <div className="animate-slide-up">
                                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                                    <h3 className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                                        </div>
                                        Academic Performance
                                    </h3>
                                    <div className="bg-orange-50 text-orange-600 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm border border-orange-100">
                                        GPA: {student.gpa}
                                    </div>
                                </div>
                                
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 flex items-center gap-5 shadow-sm">
                                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center shrink-0 border border-green-200">
                                        <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-green-700">Academic Standing</p>
                                        <p className="text-2xl font-black tracking-tight text-green-700 leading-none mt-1">{student.academic.standing}</p>
                                    </div>
                                </div>

                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Current Courses</h4>
                                <ul className="space-y-3">
                                    {student.academic.courses.map((course, i) => (
                                        <li key={i} className="flex items-center gap-4 px-6 py-4 border border-slate-100 bg-slate-50 rounded-xl hover:shadow-sm transition-all group cursor-default">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 flex items-center justify-center font-black text-xs shrink-0 group-hover:border-orange-300 group-hover:text-orange-500 transition-colors shadow-sm">{i+1}</div>
                                            <span className="font-bold text-[14px] text-slate-800">{course}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tab Content: Non-Academic (Activities) */}
                        {activeTab === 'activities' && (
                            <div className="animate-slide-up h-full">
                                <h3 className="text-lg font-black tracking-tight text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
                                    </div>
                                    Non-Academic Activities
                                </h3>
                                <div className="space-y-4">
                                    {student.activities.map((activity, i) => (
                                        <div key={i} className="group relative bg-white border border-slate-100 rounded-[24px] p-6 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-l-orange-500/30 hover:border-l-orange-500">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{activity.duration}</p>
                                                <h4 className="text-[16px] font-black text-slate-800 mb-1">{activity.org}</h4>
                                                <p className="text-[13px] font-bold text-orange-600 uppercase tracking-widest">{activity.role}</p>
                                            </div>
                                            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group-hover:bg-orange-50 transition-colors">
                                                <span className="text-slate-500 group-hover:text-orange-600 text-[11px] font-bold tracking-widest uppercase">Verified</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Violations */}
                        {activeTab === 'violations' && (
                            <div className="animate-slide-up h-full">
                                <h3 className="text-lg font-black tracking-tight text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    Disciplinary Records
                                </h3>
                                <div className="space-y-4">
                                    {student.violations.length > 0 ? (
                                        student.violations.map((violation, i) => (
                                            <div key={i} className="group bg-white border border-slate-100 rounded-[24px] p-6 hover:shadow-[0_10px_30px_rgba(239,68,68,0.04)] transition-all">
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{violation.date}</span>
                                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${violation.status === 'Cleared' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                                {violation.status}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-[17px] font-black text-slate-800 leading-tight">{violation.type}</h4>
                                                    </div>
                                                    <div className="text-right sm:text-right w-full sm:w-auto">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sanction</p>
                                                        <p className="text-[14px] font-black text-red-500 mb-1">{violation.sanction}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-100 border-dashed rounded-[24px] p-10 flex flex-col items-center text-center">
                                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-inner">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <p className="text-slate-800 font-black tracking-tight text-xl mb-1">No Disciplinary Records</p>
                                            <p className="text-[13px] font-bold uppercase tracking-widest text-slate-400">Student maintains a clean standing.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Skills & Affiliations */}
                        {activeTab === 'skills' && (
                            <div className="animate-slide-up h-full">
                                <h3 className="text-lg font-black tracking-tight text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                    </div>
                                    Skills & Memberships
                                </h3>
                                
                                <div className="mb-10">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Technical Competencies</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {student.skills.map((skill, i) => (
                                            <div key={i} className="bg-white border border-slate-200 px-5 py-3 rounded-2xl text-[13px] font-black text-slate-700 shadow-sm hover:border-orange-500 hover:text-orange-600 transition-all cursor-default flex items-center gap-2 group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:animate-ping"></div>
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Institutional Affiliations</h4>
                                    <div className="space-y-4">
                                        {student.affiliations.map((affiliation, i) => (
                                            <div key={i} className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:bg-white hover:shadow-lg transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-orange-500 transition-colors">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-4 6h4" /></svg>
                                                    </div>
                                                    <span className="font-black text-slate-800 text-[15px]">{affiliation}</span>
                                                </div>
                                                <div className="bg-white px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 group-hover:text-orange-600 group-hover:border-orange-100 transition-colors">Active Member</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Delete Confirmation Modal Overlay */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in p-4">
                        <div className="bg-white p-10 rounded-[32px] shadow-2xl max-w-sm w-full mx-4 animate-slide-up border border-slate-100">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl border border-red-100 shadow-sm flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-2xl font-black text-center text-slate-800 tracking-tight mb-2">Delete Student?</h3>
                            <p className="text-center text-slate-500 font-medium text-[13px] mb-8 leading-relaxed">This action cannot be undone. All records for <strong className="text-slate-700">{student.name}</strong> will be permanently removed.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-sm">Cancel</button>
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-[0_4px_14px_rgba(239,68,68,0.3)] transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{__html:`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 30px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
            `}} />
        </AdminLayout>
    );
}
