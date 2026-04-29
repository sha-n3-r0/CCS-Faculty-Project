import AdminLayout from '@/Layouts/AdminLayout';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function AuditLogs({ logs = null, filters = null }) {
    const rows = Array.isArray(logs) ? logs : (logs?.data ?? []);
    const links = Array.isArray(logs?.links) ? logs.links : [];

    const initial = useMemo(() => {
        const f = filters || {};
        return {
            q: f.q ?? '',
            action: f.action ?? '',
        };
    }, [filters]);

    const [q, setQ] = useState(initial.q);
    const [action, setAction] = useState(initial.action);

    useEffect(() => {
        setQ(initial.q);
        setAction(initial.action);
    }, [initial.q, initial.action]);

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                route('settings.audit.index'),
                { q: q || undefined, action: action || undefined },
                { preserveScroll: true, preserveState: true, replace: true }
            );
        }, 350);
        return () => clearTimeout(t);
    }, [q, action]);

    const fmtDate = (iso) => {
        if (!iso) return '—';
        try {
            return new Date(iso).toLocaleString();
        } catch {
            return iso;
        }
    };

    return (
        <AdminLayout title="Audit Logs" activeTab="settings">
            <div className="flex flex-col h-full font-sans animate-fade-in relative z-10 w-full mb-8">
                <div className="flex items-end justify-between gap-6 mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">Audit Logs</h2>
                        <p className="text-sm font-medium text-slate-500 tracking-wide">Review administrative actions recorded by the system.</p>
                    </div>
                    <Link
                        href={route('settings')}
                        className="text-[11px] uppercase tracking-widest font-bold bg-white border border-slate-200 px-5 py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 text-slate-600 shadow-sm transition-all"
                    >
                        Back to Settings
                    </Link>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-[24px] p-6 mb-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Search</label>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                type="text"
                                placeholder="Search by action, entity type, IP..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm shadow-inner focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Action</label>
                            <input
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                type="text"
                                placeholder="e.g. admin.update"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm shadow-inner focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200/60 rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                                    <th className="px-8 py-5 w-[16%]">Date</th>
                                    <th className="px-8 py-5 w-[18%]">Action</th>
                                    <th className="px-8 py-5 w-[14%]">User ID</th>
                                    <th className="px-8 py-5 w-[22%]">Entity</th>
                                    <th className="px-8 py-5 w-[14%]">IP</th>
                                    <th className="px-8 py-5 w-[16%]">Entity ID</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-10 text-center text-[11px] font-bold tracking-widest uppercase text-slate-400">
                                            No logs yet
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((r) => (
                                        <tr key={r.id} className="border-b border-slate-100/50 hover:bg-orange-50/30 transition-colors">
                                            <td className="px-8 py-5 text-[12px] font-bold text-slate-600">{fmtDate(r.created_at)}</td>
                                            <td className="px-8 py-5 text-[12px] font-black text-slate-800">{r.action}</td>
                                            <td className="px-8 py-5 text-[12px] font-mono font-bold text-slate-500">{r.user_id ?? '—'}</td>
                                            <td className="px-8 py-5 text-[12px] font-semibold text-slate-600">{r.entity_type ?? '—'}</td>
                                            <td className="px-8 py-5 text-[12px] font-mono font-bold text-slate-500">{r.ip_address ?? '—'}</td>
                                            <td className="px-8 py-5 text-[12px] font-mono font-bold text-slate-500">{r.entity_id ?? '—'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {links.length > 0 && (
                    <div className="mt-6 flex items-center justify-center">
                        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white border border-slate-200/60 rounded-2xl px-4 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                            {links.map((l, idx) => {
                                const isDisabled = !l.url;
                                const isActive = !!l.active;
                                const label = String(l.label ?? '').replace('&laquo;', '«').replace('&raquo;', '»');

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
        </AdminLayout>
    );
}

