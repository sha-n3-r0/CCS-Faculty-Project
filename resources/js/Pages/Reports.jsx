import React, { useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Reports({ overview = null }) {
    const [generating, setGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [reportType, setReportType] = useState('Enrollment Statistics');
    const [violationStatusFilter, setViolationStatusFilter] = useState('all'); // all | pending | cleared

    const [preview, setPreview] = useState({
        title: '',
        columns: [],
        rows: [],
        meta: null,
        reportTypeKey: null,
    });

    const fmtInt = (v) => {
        if (v === 0) return '';
        if (v === null || v === undefined) return '';
        try {
            return Number(v).toLocaleString();
        } catch {
            return String(v);
        }
    };

    const csrf = useMemo(() => {
        const el = document.querySelector('meta[name="csrf-token"]');
        return el ? el.getAttribute('content') : null;
    }, []);

    const reportTypeKey = useMemo(() => {
        return reportType === 'Violations Summary' ? 'violations_by_status' : 'enrollment_by_status';
    }, [reportType]);

    const previewRows = preview?.rows ?? [];
    const previewColumns = preview?.columns ?? [];

    const handleGenerate = async (type) => {
        setReportType(type);
        setGenerating(true);
        setReportReady(false);

        const nextReportTypeKey = type === 'Violations Summary' ? 'violations_by_status' : 'enrollment_by_status';
        const payload = {
            reportType: nextReportTypeKey,
            filters: nextReportTypeKey === 'violations_by_status' ? { status: violationStatusFilter } : {},
        };

        try {
            const res = await fetch('/reports/preview', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Preview failed (${res.status})`);
            }

            const data = await res.json();
            setPreview({
                title: data?.title ?? '',
                columns: Array.isArray(data?.columns) ? data.columns : [],
                rows: Array.isArray(data?.rows) ? data.rows : [],
                meta: data?.meta ?? null,
                reportTypeKey: data?.reportType ?? nextReportTypeKey,
            });
            setReportReady(true);
        } catch (e) {
            // Keep UI stable; user can retry.
            setPreview({ title: '', columns: [], rows: [], meta: null, reportTypeKey: null });
            setReportReady(false);
            // eslint-disable-next-line no-alert
            alert('Failed to generate report preview. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const exportUrl = (format) => {
        const key = preview?.reportTypeKey ?? reportTypeKey;
        const qp = new URLSearchParams();
        qp.set('reportType', key);
        if (key === 'violations_by_status') {
            qp.set('status', violationStatusFilter);
        }
        return `/reports/export.${format}?${qp.toString()}`;
    };

    return (
        <AdminLayout title="Reports" activeTab="reports">
            {/* The Main Light-Mode Canvas area */}
            <div className="flex-1 w-full h-full font-sans relative z-10 flex flex-col gap-6 animate-fade-in pb-4">
                
                {generating && (
                    <div className="absolute inset-x-0 -inset-y-4 bg-[#F8FAFC]/80 backdrop-blur-md z-50 flex flex-col items-center justify-center animate-fade-in rounded-3xl">
                        <div className="w-20 h-20 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-6 shadow-[0_4px_20px_rgba(249,115,22,0.2)]"></div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Generating Report</h3>
                        <p className="text-sm font-bold tracking-widest uppercase text-slate-400 mt-2">Running aggregate queries across matrices...</p>
                    </div>
                )}

                {!reportReady ? (
                    <>
                        <div className="shrink-0 flex justify-between items-end mb-2">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">Reports Module</h2>
                                <p className="text-sm font-medium text-slate-500 tracking-wide">Select and configure parameters to generate system reports.</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-start">
                            {/* Card 1 */}
                            <div className="bg-white rounded-[24px] xl:rounded-[32px] p-8 flex flex-col gap-6 border border-slate-200/60 hover:shadow-[0_8px_30px_-4px_rgba(249,115,22,0.08)] hover:border-orange-200 transition-all duration-300 group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-orange-300 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-[20px] bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors group-hover:scale-110">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-800 tracking-tight">Enrollment Statistics</h3>
                                        <p className="text-sm text-slate-500 font-medium">Active students and demographics.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-5 shadow-inner flex-1">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
                                        <select className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[13px] font-semibold outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-slate-700 cursor-pointer shadow-sm transition-shadow">
                                            <option>2026 - 2027</option>
                                            <option>2025 - 2026</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Semester</label>
                                        <select className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[13px] font-semibold outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-slate-700 cursor-pointer shadow-sm transition-shadow">
                                            <option>First Semester</option>
                                            <option>Second Semester</option>
                                        </select>
                                    </div>
                                </div>
                                <button onClick={() => handleGenerate('Enrollment Statistics')} className="py-4 bg-orange-500 hover:bg-orange-600 rounded-xl text-white text-sm font-bold tracking-widest uppercase shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all w-full active:scale-[0.98]">
                                    Generate Logic
                                </button>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white rounded-[24px] xl:rounded-[32px] p-8 flex flex-col gap-6 border border-slate-200/60 hover:shadow-[0_8px_30px_-4px_rgba(239,68,68,0.08)] hover:border-red-200 transition-all duration-300 group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-300 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-[20px] bg-red-50 flex items-center justify-center text-red-500 border border-red-100 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-colors group-hover:scale-110">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-800 tracking-tight">Violations Summary</h3>
                                        <p className="text-sm text-slate-500 font-medium">Disciplinary logs and sanctions.</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-5 shadow-inner flex-1">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status Filter</label>
                                        <select
                                            value={violationStatusFilter}
                                            onChange={(e) => setViolationStatusFilter(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-[13px] font-semibold outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-slate-700 cursor-pointer shadow-sm transition-shadow"
                                        >
                                            <option value="all">All Violations</option>
                                            <option value="pending">Pending Sanctions</option>
                                            <option value="cleared">Cleared</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date Range</label>
                                        <input type="month" className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-[13px] font-semibold outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-slate-700 shadow-sm transition-shadow" />
                                    </div>
                                </div>
                                <button onClick={() => handleGenerate('Violations Summary')} className="py-4 bg-slate-800 hover:bg-red-500 rounded-xl text-white text-sm font-bold tracking-widest uppercase shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] transition-all w-full active:scale-[0.98]">
                                    Generate Logic
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    // Generated Report view
                    <div className="flex-1 flex flex-col animate-fade-in relative z-10 w-full h-full bg-white rounded-[24px] xl:rounded-[32px] border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="flex items-center justify-between p-6 lg:p-8 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setReportReady(false)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm focus:ring-2 focus:ring-slate-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Preview: {preview?.title || reportType}</h2>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                        Generated on {preview?.meta?.generated_at ? new Date(preview.meta.generated_at).toLocaleString() : new Date().toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => (window.location.href = exportUrl('csv'))}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-[11px] tracking-widest uppercase font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                                >
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Export CSV
                                </button>
                                <button
                                    onClick={() => (window.location.href = exportUrl('pdf'))}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-[11px] tracking-widest uppercase font-bold text-white shadow-md transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    Export PDF
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 bg-white overflow-hidden flex flex-col border-t border-slate-200/50">
                            {/* Mock Data Table */}
                            <div className="p-4 px-8 bg-slate-50 flex items-center justify-between border-b border-slate-100 shrink-0">
                                <span className="text-[11px] font-black tracking-widest uppercase text-slate-500">
                                    {previewRows.length > 0 ? `Total Entries: ${previewRows.length}` : ''}
                                </span>
                                <div className="flex gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-0 pb-8 styled-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
                                        <tr className="text-[10px] text-slate-400 tracking-widest uppercase font-black">
                                            {previewColumns.map((c, idx) => (
                                                <th
                                                    key={c.key || idx}
                                                    className={`px-8 py-5 ${idx < previewColumns.length - 1 ? 'border-r border-slate-100/50' : ''}`}
                                                >
                                                    {c.label || c.key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {previewRows.length > 0 ? (
                                            previewRows.map((row, i) => (
                                                <tr key={row.id ?? i} className="border-b border-slate-100/50 hover:bg-orange-50/30 transition-colors">
                                                    {previewColumns.map((c, idx) => (
                                                        <td
                                                            key={`${row.id ?? i}-${c.key ?? idx}`}
                                                            className={`px-8 py-5 text-[13px] ${idx < previewColumns.length - 1 ? 'border-r border-slate-50' : ''} ${typeof row?.[c.key] === 'number' ? 'font-mono text-slate-400 font-bold' : 'font-semibold text-slate-600'}`}
                                                        >
                                                            {typeof row?.[c.key] === 'number' ? fmtInt(row[c.key]) : String(row?.[c.key] ?? '')}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={Math.max(previewColumns.length, 1)} className="px-8 py-10 text-center text-[11px] font-bold tracking-widest uppercase text-slate-400">
                                                    No data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
