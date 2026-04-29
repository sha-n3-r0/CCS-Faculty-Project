import React, { useEffect, useMemo, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function StudentList({ students = [], filters = null }) {
    const { avatarPlaceholderUrl } = usePage().props;
    const [viewMode, setViewMode] = useState('table');
    const rows = Array.isArray(students) ? students : (students?.data ?? []);
    const links = Array.isArray(students?.links) ? students.links : [];

    const initial = useMemo(() => {
        const f = filters || {};
        return {
            q: f.q ?? '',
            program: f.program ?? '',
            year: f.year ?? '',
            status: f.status ?? '',
        };
    }, [filters]);

    const [q, setQ] = useState(initial.q);
    const [program, setProgram] = useState(initial.program);
    const [year, setYear] = useState(initial.year);
    const [status, setStatus] = useState(initial.status);

    // Keep local state aligned when navigating back/forward (or pagination changes).
    useEffect(() => {
        setQ(initial.q);
        setProgram(initial.program);
        setYear(initial.year);
        setStatus(initial.status);
    }, [initial.q, initial.program, initial.year, initial.status]);

    // Debounced search + filters (server-side).
    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route('students'),
                {
                    q: q || undefined,
                    program: program || undefined,
                    year: year || undefined,
                    status: status || undefined,
                },
                { preserveScroll: true, preserveState: true, replace: true }
            );
        }, 350);
        return () => clearTimeout(t);
    }, [q, program, year, status]);

    return (
        <AdminLayout title="Student List" activeTab="students">
            <div className="flex flex-col h-full font-sans animate-fade-in relative z-10 w-full mb-8">
                
                {/* Header & Controls Section (Unboxed, floating over the canvas) */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">Student Profiles</h2>
                        <p className="text-sm font-medium text-slate-500 tracking-wide">Manage and view all enrolled student records in the system.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Quick View Toggles */}
                        <div className="flex items-center p-1 bg-white border border-slate-200/60 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]">
                            <button 
                                onClick={() => setViewMode('table')} 
                                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-800'}`}
                            >
                                Table
                            </button>
                            <button 
                                onClick={() => setViewMode('cards')} 
                                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'cards' ? 'bg-orange-50 text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-800'}`}
                            >
                                Cards
                            </button>
                        </div>
                        
                        <Link href={route('students.create')} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all transform active:scale-95 whitespace-nowrap text-center flex items-center justify-center relative overflow-hidden group">
                           <span className="relative z-10">+ New Student</span>
                           <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-white opacity-20 group-hover:animate-[swipe_1s_ease-out]"></div>
                        </Link>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 mb-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1 relative group">
                            <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            <input 
                                type="text" 
                                placeholder="Search by Student ID, Name, or Email..." 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm shadow-inner focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white text-slate-800 placeholder-slate-400 transition-all" 
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                         <select className="bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 text-slate-600 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer transition-all hover:bg-slate-100">
                             <option>Skills: All</option>
                             <option>Programming</option>
                             <option>Basketball</option>
                             <option>Design</option>
                         </select>
                         <select
                             value={program}
                             onChange={(e) => setProgram(e.target.value)}
                             className="bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 text-slate-600 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer transition-all hover:bg-slate-100"
                         >
                             <option value="">Program: All</option>
                             <option value="BSIT">BSIT</option>
                             <option value="BSCS">BSCS</option>
                             <option value="BSIS">BSIS</option>
                         </select>
                         <select
                             value={year}
                             onChange={(e) => setYear(e.target.value)}
                             className="bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 text-slate-600 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer transition-all hover:bg-slate-100"
                         >
                             <option value="">Year Level: All</option>
                             <option value="1st Year">1st Year</option>
                             <option value="2nd Year">2nd Year</option>
                             <option value="3rd Year">3rd Year</option>
                             <option value="4th Year">4th Year</option>
                         </select>
                         <select
                             value={status}
                             onChange={(e) => setStatus(e.target.value)}
                             className="bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 text-slate-600 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer transition-all hover:bg-slate-100"
                         >
                             <option value="">Status: All</option>
                             <option value="Enrolled">Enrolled</option>
                             <option value="Not Enrolled">Not Enrolled</option>
                             <option value="Leave of Absence">Leave of Absence</option>
                             <option value="Graduated">Graduated</option>
                         </select>
                         <select className="bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 text-slate-600 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer transition-all hover:bg-slate-100">
                             <option>Affiliations: All</option>
                             <option>Varsity</option>
                             <option>Student Council</option>
                         </select>
                         <select className="bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 text-slate-600 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer transition-all hover:bg-slate-100">
                             <option>Violations: Any</option>
                             <option>With Pending</option>
                             <option>Cleared</option>
                         </select>
                    </div>
                </div>
                
                {/* Content Section */}
                <div className="flex-1 relative">
                    {rows.length === 0 ? (
                        <div className="bg-white border border-slate-200/60 rounded-[24px] p-12 text-center shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                            <p className="text-slate-600 font-bold mb-4">No students enrolled yet.</p>
                            <Link
                                href={route('students.create')}
                                className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-widest uppercase shadow-[0_4px_14px_rgba(249,115,22,0.3)] transition-all"
                            >
                                + Add your first student
                            </Link>
                        </div>
                    ) : viewMode === 'table' ? (
                        <div className="bg-white border border-slate-200/60 rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[800px] animate-fade-in">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                            <th className="px-8 py-5 w-[15%]">Student ID</th>
                                            <th className="px-8 py-5 w-[25%]">Full Name</th>
                                            <th className="px-8 py-5 w-[25%]">Program</th>
                                            <th className="px-8 py-5 w-[15%]">Year Level</th>
                                            <th className="px-8 py-5 w-[10%] text-center">GPA</th>
                                            <th className="px-8 py-5 text-right w-[10%]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {rows.map((student, i) => (
                                            <tr key={student.id} className="border-b border-slate-100/50 hover:bg-orange-50/30 transition-colors group animate-slide-up" style={{animationDelay: `${i * 0.05}s`}}>
                                                <td className="px-8 py-5 text-[13px] font-bold text-slate-500 font-mono tracking-tight">{student.student_number ?? '—'}</td>
                                                <td className="px-8 py-5 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 p-0.5 shadow-sm shrink-0 overflow-hidden group-hover:border-orange-400 group-hover:scale-110 transition-transform">
                                                        <img
                                                            src={student.photo_url || avatarPlaceholderUrl}
                                                            alt=""
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-[14px] font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{student.name}</span>
                                                </td>
                                                <td className="px-8 py-5 text-[13px] font-semibold text-slate-600">{student.program}</td>
                                                <td className="px-8 py-5 text-[13px] font-semibold text-slate-600">{student.year}</td>
                                                <td className="px-8 py-5 text-[13px] font-black text-green-600 text-center">{student.gpa}</td>
                                                <td className="px-8 py-5 text-right flex justify-end gap-3 items-center h-full">
                                                    <Link href={route('students.show', student.id)} className="text-[11px] uppercase tracking-widest font-bold bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 hover:border-slate-300 text-slate-600 shadow-sm transition-all focus:ring-2 focus:ring-slate-200">View</Link>
                                                    <Link href={route('students.edit', student.id)} className="text-[11px] uppercase tracking-widest font-bold bg-orange-50 text-orange-600 px-4 py-2 rounded-xl border border-orange-100 hover:bg-orange-100 hover:border-orange-200 shadow-sm transition-all">Edit</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in pb-8">
                            {rows.map((student, i) => (
                                <div key={student.id} className="bg-white rounded-[24px] border border-slate-200/60 p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(249,115,22,0.08)] transition-all duration-300 group hover:-translate-y-1 animate-slide-up relative overflow-hidden" style={{animationDelay: `${i * 0.05}s`}}>
                                    
                                    {/* Delicate top gradient bar */}
                                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-300 to-orange-500 opacity-60 group-hover:opacity-100 transition-opacity z-0"></div>
                                    
                                    <div className="relative z-10 flex flex-col items-center mt-2">
                                        <div className="w-[84px] h-[84px] rounded-full border border-slate-100 p-1 shadow-sm shrink-0 overflow-hidden mb-4 bg-white group-hover:scale-110 group-hover:border-orange-200 transition-all">
                                            <img
                                                src={student.photo_url || avatarPlaceholderUrl}
                                                alt=""
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-[16px] font-black tracking-tight text-slate-800 group-hover:text-orange-600 transition-colors">{student.name}</h3>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 text-slate-400 border border-slate-200 rounded-full mt-2 font-mono">{student.student_number ?? '—'}</span>
                                        
                                        <div className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">PROGRAM</span>
                                                <span className="text-[11px] font-black text-slate-700 text-right w-3/5 truncate">{student.program}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">YEAR</span>
                                                <span className="text-[11px] font-black text-slate-700">{student.year}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-slate-50 px-2 py-1 -mx-2 rounded-lg">
                                                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">GPA</span>
                                                <span className="text-[12px] font-black text-green-600">{student.gpa}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="w-full flex gap-3 mt-6">
                                            <Link href={route('students.show', student.id)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-center py-2.5 rounded-xl text-[11px] tracking-widest uppercase font-bold text-slate-600 transition-colors shadow-sm">
                                                Profile
                                            </Link>
                                            <Link href={route('students.edit', student.id)} className="flex-1 bg-orange-50 border border-orange-100 hover:bg-orange-100 hover:border-orange-200 text-center py-2.5 rounded-xl text-[11px] tracking-widest uppercase font-bold text-orange-600 transition-colors shadow-sm">
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {links.length > 0 && (
                        <div className="mt-6 flex items-center justify-center">
                            <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white border border-slate-200/60 rounded-2xl px-4 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                                {links.map((l, idx) => {
                                    const isDisabled = !l.url;
                                    const isActive = !!l.active;
                                    const label = String(l.label ?? '')
                                        .replace('&laquo;', '«')
                                        .replace('&raquo;', '»');

                                    return (
                                        <Link
                                            key={`${l.label}-${idx}`}
                                            href={l.url || '#'}
                                            preserveScroll
                                            className={[
                                                'px-3 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all select-none',
                                                isActive ? 'bg-orange-500 text-white shadow-[0_6px_18px_rgba(249,115,22,0.25)]' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
                                                isDisabled ? 'pointer-events-none opacity-40' : '',
                                            ].join(' ')}
                                            dangerouslySetInnerHTML={{ __html: label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html:`
                 @keyframes swipe { 0% { left: -100% } 100% { left: 200% } }
            `}} />
        </AdminLayout>
    );
}
