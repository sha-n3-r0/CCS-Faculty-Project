import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const [showStatus, setShowStatus] = useState(Boolean(status));

    useEffect(() => {
        setShowStatus(Boolean(status));
        if (!status) return;
        const t = window.setTimeout(() => setShowStatus(false), 4500);
        return () => window.clearTimeout(t);
    }, [status]);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes float-slow {
                    0% { transform: translateY(0px) rotate(0deg) scale(1); }
                    33% { transform: translateY(-30px) rotate(5deg) scale(1.05); }
                    66% { transform: translateY(15px) rotate(-5deg) scale(0.95); }
                    100% { transform: translateY(0px) rotate(0deg) scale(1); }
                }
                .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
                .animate-float-delayed { animation: float-slow 18s ease-in-out infinite; animation-delay: 2s; }
            `}} />

            <div className="relative min-h-screen overflow-hidden flex flex-col justify-between items-center font-sans bg-[#F8FAFC]">
                
                {/* Advanced Light Mode Floating Orb Backgrounds */}
                <div className="absolute inset-0 w-[100vw] h-[100vh] fixed bg-[#F8FAFC] z-0 pointer-events-none"></div>
                <div className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-orange-200/60 rounded-full blur-[100px] animate-float-slow z-0 pointer-events-none mix-blend-multiply"></div>
                <div className="absolute bottom-[5%] right-[10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-yellow-200/50 rounded-full blur-[120px] animate-float-delayed z-0 pointer-events-none mix-blend-multiply"></div>
                
                {/* Overlay Noise Texture for high-quality depth */}
                <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>

                {/* Embedded Navbar */}
                <nav className={`w-full z-20 py-6 absolute top-0 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full border border-orange-100 flex items-center justify-center p-0.5 bg-white backdrop-blur-sm group-hover:scale-110 group-hover:border-orange-300 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                                <img src="/logo.png" className="w-full h-full rounded-full object-cover bg-white" alt="Logo" />
                            </div>
                            <span className="text-slate-800 tracking-widest text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">SPS</span>
                        </Link>
                        <Link href={route('register')} className="text-orange-600 text-[11px] font-bold tracking-widest hover:text-white hover:bg-orange-500 transition-colors bg-white px-6 py-3 rounded-full border border-orange-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(249,115,22,0.2)]">
                            REGISTER ACCOUNT
                        </Link>
                    </div>
                </nav>
                
                {/* Header Logo Area */}
                <div className="mt-20 md:mt-24 flex flex-col items-center select-none text-center transform relative z-10 w-full" style={{ transitionDuration: '1s' }}>
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white flex items-center justify-center p-1 bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden scale-90 hover:scale-100 transition-all duration-500">
                        <img src="logo.png" className="w-full h-full rounded-full object-cover bg-white" alt="Logo" />
                    </div>
                    <div className="mt-5 text-center px-4">
                        <h1 className="text-slate-800 font-bold text-sm md:text-base tracking-[0.25em] leading-tight uppercase drop-shadow-sm">
                            College of Computing<br/>Studies
                        </h1>
                    </div>
                </div>

                {/* Login Glassmorphism Card */}
                <main className="flex-grow flex items-center justify-center w-full px-4 z-10 my-8">
                    {/* Staggered load effect */}
                    <div className={`w-full max-w-[460px] rounded-[32px] bg-white/80 backdrop-blur-xl border border-white p-10 md:p-12 relative overflow-hidden group shadow-[0_10px_40px_0_rgba(0,0,0,0.06)] hover:shadow-[0_15px_50px_0_rgba(0,0,0,0.1)] transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
                        
                        <h2 className="text-slate-800 text-center text-3xl font-black mb-10 tracking-tight inline-block w-full">
                            System Access
                        </h2>

                        <form onSubmit={submit} className="flex flex-col gap-5 relative z-10">
                            {/* Email Field - Cinematic entrance delay 0.2s */}
                            <div className={`transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '0.2s' }}>
                                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1" htmlFor="email">
                                    Identity Email
                                </label>
                                <div className="relative group/input">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-inner"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2 text-[#EF4444] text-xs font-bold" />
                            </div>

                            {/* Password Field - Cinematic entrance delay 0.4s */}
                            <div className={`transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '0.4s' }}>
                                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1" htmlFor="password">
                                    Secure Key
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-inner"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2 text-[#EF4444] text-xs font-bold" />
                            </div>

                            {/* Submit Button & Links - Cinematic delay 0.6s */}
                            <div className={`mt-6 flex flex-col items-center gap-5 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '0.6s' }}>
                                <button
                                    disabled={processing}
                                    className="w-full relative overflow-hidden bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-widest px-12 py-4 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)] transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed group/btn"
                                    type="submit"
                                >
                                    <span className="relative z-10">{processing ? 'AUTHENTICATING...' : 'AUTHORIZE LOGIN'}</span>
                                    {/* Swiping shine effect */}
                                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-white opacity-20 group-hover/btn:animate-[swipe_1s_ease-out]"></div>
                                </button>
                                
                                <span className="text-slate-400 text-[11px] font-medium tracking-wide">
                                    System Access Unlisted?{' '}
                                    <Link href={route('register')} className="text-orange-500 font-bold hover:text-orange-600 transition-colors ml-1 uppercase tracking-wider text-[10px]">
                                        Request Entry
                                    </Link>
                                </span>
                            </div>
                        </form>
                    </div>
                </main>

                {showStatus && status && (
                    <div className="fixed top-5 right-5 z-[99999] w-[92vw] max-w-sm animate-slide-up pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-xl border border-emerald-200 shadow-[0_16px_60px_rgba(0,0,0,0.12)] rounded-2xl px-4 py-3 flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-black tracking-widest uppercase text-emerald-700">
                                    Session ended
                                </p>
                                <p className="text-[13px] font-semibold text-slate-700 mt-0.5">
                                    {status}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowStatus(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors pointer-events-auto"
                                aria-label="Dismiss message"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <footer className={`w-full flex justify-center pb-8 z-10 relative transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase mix-blend-multiply">
                        Secure Environment &nbsp;|&nbsp; End-To-End Encrypted
                    </div>
                </footer>
            </div>
            
            <style dangerouslySetInnerHTML={{__html:`
                 @keyframes swipe { 0% { left: -100% } 100% { left: 200% } }
            `}} />
        </>
    );
}
