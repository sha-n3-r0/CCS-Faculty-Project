import React, { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function Register({ canRegister = true }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />
            
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap');
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                
                @keyframes float-slow {
                    0% { transform: translateY(0px) rotate(0deg) scale(1); }
                    33% { transform: translateY(-30px) rotate(-5deg) scale(1.05); }
                    66% { transform: translateY(15px) rotate(5deg) scale(0.95); }
                    100% { transform: translateY(0px) rotate(0deg) scale(1); }
                }
                .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
                .animate-float-delayed { animation: float-slow 18s ease-in-out infinite; animation-delay: 2s; }
            `}} />

            <div className="relative min-h-screen overflow-x-hidden flex flex-col justify-between items-center font-montserrat bg-[#F8FAFC]">
                
                {/* Advanced Light Mode Floating Orb Backgrounds */}
                <div className="absolute inset-0 w-[100vw] h-[100vh] fixed bg-[#F8FAFC] z-0 pointer-events-none"></div>
                <div className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-red-200/50 rounded-full blur-[100px] animate-float-slow z-0 pointer-events-none mix-blend-multiply"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-orange-300/40 rounded-full blur-[120px] animate-float-delayed z-0 pointer-events-none mix-blend-multiply"></div>
                
                {/* Overlay Noise Texture for high-quality depth */}
                <div className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none fixed" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>

                {/* Embedded Navbar */}
                <nav className={`w-full z-20 py-6 absolute top-0 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full border border-orange-100 flex items-center justify-center p-0.5 bg-white backdrop-blur-sm group-hover:scale-110 group-hover:border-orange-300 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                                <img src="/logo.png" className="w-full h-full rounded-full object-cover bg-white" alt="Logo" />
                            </div>
                            <span className="text-slate-800 tracking-widest text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">SPS</span>
                        </Link>
                        <Link href={route('login')} className="text-orange-600 text-[11px] font-bold tracking-widest hover:text-white hover:bg-orange-500 transition-colors bg-white px-6 py-3 rounded-full border border-orange-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(249,115,22,0.2)]">
                            LOGIN
                        </Link>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-grow flex items-center justify-center w-full px-4 z-10 py-24 pb-32">
                    {/* Staggered load effect */}
                    <div className={`w-full max-w-[500px] rounded-[32px] bg-white/80 backdrop-blur-xl border border-white p-10 md:p-12 relative overflow-hidden group shadow-[0_10px_40px_0_rgba(0,0,0,0.06)] hover:shadow-[0_15px_50px_0_rgba(0,0,0,0.1)] transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}>
                        
                        <div className="mb-8 text-center" style={{ transitionDelay: '0.2s' }}>
                            <h2 className="text-slate-800 text-2xl md:text-3xl font-black drop-shadow-sm mb-2 tracking-tight">Create Clearance</h2>
                            <p className="text-slate-400 text-[11px] font-bold tracking-widest uppercase">College of Computing Studies</p>
                        </div>

                        {!canRegister && (
                            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-center text-sm text-amber-900">
                                <p className="font-bold tracking-tight">This system already has an account.</p>
                                <p className="mt-2 text-xs text-amber-800/90">
                                    Use <strong>Login</strong> with the email you registered. This app only allows one user.
                                </p>
                                <Link
                                    href={route('login')}
                                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition hover:bg-orange-600"
                                >
                                    Go to login
                                </Link>
                            </div>
                        )}

                        <form onSubmit={submit} className={`flex flex-col gap-5 relative z-10 ${!canRegister ? 'pointer-events-none opacity-40' : ''}`}>
                            
                            {/* Name Field */}
                            <div className={`transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
                                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1" htmlFor="name">
                                    Full ID Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-2xl px-5 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-inner"
                                    placeholder="John Doe"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-[#EF4444] text-xs font-bold" />
                            </div>

                            {/* Email Field */}
                            <div className={`transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.4s' }}>
                                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1" htmlFor="email">
                                    Identity Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-2xl px-5 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-inner"
                                    placeholder="stu@edu.ph"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2 text-[#EF4444] text-xs font-bold" />
                            </div>

                            {/* Password Field */}
                            <div className={`transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.5s' }}>
                                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1" htmlFor="password">
                                    Secure Key
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-2xl px-5 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-inner"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2 text-[#EF4444] text-xs font-bold" />
                            </div>

                            {/* Confirm Password Field */}
                            <div className={`transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.6s' }}>
                                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 ml-1" htmlFor="password_confirmation">
                                    Verify Secure Key
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-400 rounded-2xl px-5 py-3 text-slate-800 placeholder-slate-400 text-sm outline-none transition-all shadow-inner"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2 text-[#EF4444] text-xs font-bold" />
                            </div>

                            {/* Submit Form Area */}
                            <div className={`mt-6 flex flex-col items-center gap-5 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '0.7s' }}>
                                <button
                                    disabled={processing || !canRegister}
                                    className="w-full relative overflow-hidden bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-widest px-12 py-4 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)] transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed group/btn"
                                    type="submit"
                                >
                                    <span className="relative z-10">{processing ? 'PROCESSING...' : 'INITIALIZE REGISTRATION'}</span>
                                    {/* Cool swipe effect on button hover */}
                                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-white opacity-20 group-hover/btn:animate-[swipe_1s_ease-out]"></div>
                                </button>
                                
                                <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mt-2">
                                    Already have clearance?{' '}
                                    <Link href={route('login')} className="text-orange-500 font-bold hover:text-orange-600 transition-colors ml-1 pb-0.5">
                                        Authenticate
                                    </Link>
                                </span>
                            </div>
                        </form>
                    </div>
                </main>
                
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
