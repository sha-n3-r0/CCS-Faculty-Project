import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToFeatures = () => {
        document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Head title="Welcome to SPS" />

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Amiko:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=Poppins:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;600;700;800&display=swap');
                html { scroll-behavior: smooth; }
            `}} />

            <div className="w-full min-h-screen relative bg-[#F8FAFC] overflow-x-hidden font-['Montserrat'] selection:bg-orange-500 selection:text-white">

                {/* --- Ambient Backgrounds --- */}
                {/* Fixed Background container so the gradient stays while scrolling */}
                <div className="fixed top-0 left-0 w-full h-[100vh] z-0 pointer-events-none overflow-hidden bg-[#F8FAFC]">
                    {/* First soft orange gradient */}
                    <div className="absolute rounded-full blur-[80px] md:blur-[120px]"
                        style={{
                            width: '130vw', height: '110vh',
                            left: '-15vw', top: '-8vh',
                            background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255, 237, 213, 1) 0%, rgba(248, 250, 252, 0) 100%)'
                        }} />
                    {/* Second lively orange gradient */}
                    <div className="absolute rounded-full blur-[80px] md:blur-[100px] bg-orange-200/40 mix-blend-multiply animate-pulse-slow"
                        style={{
                            width: '140vw', height: '100vh',
                            left: '-20vw', top: '-35vh'
                        }} />
                    {/* Third bright/white gradient */}
                    <div className="absolute rounded-full blur-[60px] md:blur-[100px] bg-white mix-blend-overlay animate-pulse-slow"
                        style={{
                            width: '80vw', height: '60vh',
                            left: '10vw', top: '-25vh',
                            animationDelay: '1s'
                        }} />
                </div>

                {/* Overlay Noise Texture for high-quality depth */}
                <div className="fixed inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

                {/* --- Fixed Navigation Bar --- */}
                <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' : 'bg-transparent py-6'}`}>
                    <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                        {/* Logo Area */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-orange-100 flex items-center justify-center p-0.5 bg-white backdrop-blur-sm shrink-0 shadow-sm">
                                <img src="logo.png" className="w-full h-full rounded-full object-cover bg-white" alt="Logo" />
                            </div>
                            <span className="text-slate-800 font-['Amiko'] tracking-widest text-sm md:text-base font-bold hidden sm:block">CCSF SPS</span>
                        </div>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-8 text-slate-500 text-sm font-semibold tracking-wide">
                            <button onClick={() => window.scrollTo(0, 0)} className="hover:text-orange-500 transition-colors">Home</button>
                            <button onClick={scrollToFeatures} className="hover:text-orange-500 transition-colors">Features</button>
                            <a href="#" className="hover:text-orange-500 transition-colors">About Us</a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3 md:gap-4">
                            <Link href={route('login')} className="text-slate-600 text-sm font-bold tracking-wider hover:text-orange-500 transition-colors px-2">
                                LOGIN
                            </Link>
                            <Link href={route('register')} className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-5 py-2.5 md:px-6 md:py-2.5 rounded-full text-sm font-bold tracking-wider shadow-[0_4px_15px_rgba(249,115,22,0.2)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5 border border-orange-300">
                                REGISTER
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* --- Content Wrapper --- */}
                <div className="relative z-10 w-full flex flex-col">

                    {/* HERO SECTION */}
                    <section className="w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6">
                        {/* Main Hero Container */}
                        <div className="max-w-[1200px] w-full flex flex-col items-center text-center mt-12 animate-slide-up">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex justify-center items-center p-1 backdrop-blur-sm mb-8 bg-white/50">
                                <img src="logo.png" alt="Logo" className="w-full h-full object-cover rounded-full bg-white" />
                            </div>
                            <h1 className="text-slate-800 text-[50px] sm:text-[80px] md:text-[110px] lg:text-[140px] font-black font-['Poppins'] leading-[1.1] drop-shadow-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600">
                                Welcome.
                            </h1>
                            <div className="mt-[-10px] sm:mt-[-20px] md:mt-[-30px] z-20">
                                <span className="text-orange-500 text-2xl sm:text-4xl md:text-5xl lg:text-[60px] font-['DM_Serif_Display'] italic underline decoration-2 drop-shadow-sm">
                                    Dangal ng Bayan
                                </span>
                            </div>

                            <p className="mt-8 md:mt-12 max-w-3xl text-slate-500 text-sm sm:text-lg md:text-xl font-['DM_Serif_Display'] leading-relaxed">
                                This platform provides a clean, simple, and secure way to manage and access student information, supporting efficiency, accuracy, and the spirit of academic excellence.
                            </p>

                            <div className="mt-12 flex gap-4">
                                <Link href={route('login')} className="bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200 text-orange-600 font-bold tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group uppercase text-sm">
                                    Enter System <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Animated Scroll Indicator */}
                        <div className="absolute bottom-12 flex flex-col items-center animate-fade-in" style={{ animationDelay: '1s' }}>
                            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-2">Discover More</span>
                            <button onClick={scrollToFeatures} className="w-8 h-12 rounded-full border-2 border-slate-300 flex justify-center pt-2 hover:border-orange-300 transition-colors bg-white/50 backdrop-blur-sm">
                                <div className="w-1.5 h-3 bg-orange-400 rounded-full animate-bounce"></div>
                            </button>
                        </div>
                    </section>

                    {/* FEATURES SECTION */}
                    <section id="features" className="w-full min-h-screen relative py-24 px-6 lg:px-12 flex flex-col items-center justify-center bg-white/40 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-10px_40px_rgba(0,0,0,0.01)]">
                        <div className="text-center mb-16 animate-slide-up">
                            <h2 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-2">Why Choose SPS</h2>
                            <h3 className="text-slate-800 text-3xl md:text-5xl font-['Poppins'] font-black tracking-tight">A Premium Faculty Experience</h3>
                        </div>

                        <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            {/* Card 1 */}
                            <div className="bg-white border border-slate-100 rounded-[32px] p-10 hover:-translate-y-2 transition-all duration-500 group shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(249,115,22,0.08)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-t-[32px]"></div>
                                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <h4 className="text-slate-800 text-xl font-bold mb-3 font-['Poppins']">Centralized Data</h4>
                                <p className="text-slate-500 leading-relaxed text-sm">Securely store, retrieve, and manage comprehensive student profiles, academic histories, and disciplinary records in one seamless interface.</p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white border border-slate-100 rounded-[32px] p-10 hover:-translate-y-2 transition-all duration-500 group shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(249,115,22,0.08)] relative overflow-hidden delay-100">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-t-[32px]"></div>
                                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <h4 className="text-slate-800 text-xl font-bold mb-3 font-['Poppins']">Dynamic Analytics</h4>
                                <p className="text-slate-500 leading-relaxed text-sm">Gain actionable insights with our interactive dashboard detailing population stats, recent activities, and system health status instantly.</p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white border border-slate-100 rounded-[32px] p-10 hover:-translate-y-2 transition-all duration-500 group shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(249,115,22,0.08)] relative overflow-hidden delay-200">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-t-[32px]"></div>
                                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h4 className="text-slate-800 text-xl font-bold mb-3 font-['Poppins']">Strict Security</h4>
                                <p className="text-slate-500 leading-relaxed text-sm">Built with state-of-the-art authentication protocols ensuring faculty administrative accounts and student files remain strictly private.</p>
                            </div>

                        </div>
                    </section>

                    {/* FOOOTER SECTION */}
                    <footer className="w-full bg-white border-t border-slate-200 pt-16 pb-8 px-6 lg:px-12 relative z-20">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 border-b border-slate-100 pb-12">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src="logo.png" className="w-10 h-10 rounded-full bg-white object-cover border border-slate-200 shadow-sm" alt="Logo" />
                                    <span className="text-slate-800 font-['Amiko'] tracking-widest font-bold">CCSF SPS</span>
                                </div>
                                <p className="text-slate-500 text-sm max-w-sm text-center md:text-left leading-relaxed">
                                    Empowering the College of Computing Studies through intelligent management arrays.
                                </p>
                            </div>

                            <div className="flex gap-16 text-sm text-center md:text-left">
                                <div className="flex flex-col gap-3">
                                    <span className="text-slate-800 font-bold uppercase tracking-wider mb-2 text-[11px]">Platform</span>
                                    <a href="#" className="text-slate-500 hover:text-orange-500 transition-colors font-medium">Login</a>
                                    <a href="#" className="text-slate-500 hover:text-orange-500 transition-colors font-medium">Register</a>
                                    <a href="#" className="text-slate-500 hover:text-orange-500 transition-colors font-medium">Reset Password</a>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <span className="text-slate-800 font-bold uppercase tracking-wider mb-2 text-[11px]">Legal</span>
                                    <a href="#" className="text-slate-500 hover:text-orange-500 transition-colors font-medium">Privacy Policy</a>
                                    <a href="#" className="text-slate-500 hover:text-orange-500 transition-colors font-medium">Terms of Service</a>
                                    <a href="#" className="text-slate-500 hover:text-orange-500 transition-colors font-medium">Contact Support</a>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-bold tracking-wide">
                            <p>&copy; 2026 College of Computing Studies. All rights reserved.</p>
                            <p className="flex items-center gap-1">Designed for Excellence <span className="w-2 h-2 rounded-full bg-orange-400 inline-block ml-1"></span></p>
                        </div>
                    </footer>

                </div>
            </div>
        </>
    );
}
