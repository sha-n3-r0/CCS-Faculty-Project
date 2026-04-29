import React, { useEffect, useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { createPortal } from 'react-dom';

export default function LogoutButton({ className = '', children = 'Log Out', ...props }) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const labelText = useMemo(() => {
        if (typeof children === 'string') return children;
        return 'Sign out';
    }, [children]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    const confirmLogout = () => {
        if (submitting) return;
        setSubmitting(true);
        router.post(route('logout'), {}, {
            onFinish: () => {
                setSubmitting(false);
                setOpen(false);
            },
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={className}
                {...props}
            >
                {children}
            </button>

            {open && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
                        onClick={() => !submitting && setOpen(false)}
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Sign out confirmation"
                        className="relative w-full max-w-md rounded-[28px] bg-white border border-white shadow-2xl overflow-hidden animate-slide-up"
                    >
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-red-100 blur-3xl opacity-70" />
                            <div className="absolute -bottom-28 -left-28 w-64 h-64 rounded-full bg-orange-100 blur-3xl opacity-60" />
                        </div>

                        <div className="relative p-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center shadow-sm shrink-0">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <h3 className="text-lg font-black tracking-tight text-slate-800">
                                        Confirm sign out
                                    </h3>
                                    <p className="mt-1 text-[13px] font-semibold text-slate-500 tracking-wide">
                                        You’re about to end your session. You can sign back in anytime.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => setOpen(false)}
                                    className="px-5 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={confirmLogout}
                                    className="px-6 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase text-white bg-red-500 hover:bg-red-600 shadow-[0_8px_24px_rgba(239,68,68,0.25)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Signing out…' : labelText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
}
