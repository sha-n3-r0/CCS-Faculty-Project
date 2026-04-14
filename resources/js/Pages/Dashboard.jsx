import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard() {
    const { auth } = usePage().props;
    const userName = auth?.user?.name || "Admin John Doe";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Stagger utility for animation delays
    const animDelay = (index) => ({ animationDelay: mounted ? `${index * 0.1}s` : '0s' });

    return (
        <AdminLayout title="System Analytics" activeTab="dashboard">
            
            {/* Direct Grid wrapper to sit natively in AdminLayout */}
            <div className="flex-1 w-full h-full font-['Montserrat'] relative z-10 grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-5 lg:gap-6 animate-fade-in pb-4">
                
                {/* Welcome Banner Card (Row 1, Col 1-2) */}
                <div className="md:col-span-2 row-span-1 bg-white border border-slate-200/60 rounded-[24px] xl:rounded-[32px] p-6 lg:p-8 flex flex-col justify-end relative overflow-hidden group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-500 animate-slide-up" style={animDelay(1)}>
                    {/* Gentle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                    
                    {/* Interactive glow effect */}
                    <div className="absolute top-0 right-0 w-[150%] h-full bg-gradient-to-l from-orange-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -skew-x-12 mix-blend-multiply"></div>
                    
                    <div className="flex justify-between items-start mb-auto relative z-10">
                        <div className="px-3 py-1 bg-green-50 rounded-full border border-green-200 text-[10px] font-bold text-green-700 tracking-widest uppercase flex items-center gap-2 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            SYSTEM ONLINE
                        </div>
                        <svg className="w-8 h-8 text-slate-300 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    
                    <div className="relative z-10 pt-4">
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-800 mb-1 lg:mb-2 leading-tight tracking-tight">Welcome, {userName}.</h2>
                        <p className="text-[13px] font-medium text-slate-500 tracking-wide">Live administrative metrics and intelligence gathering.</p>
                    </div>
                </div>

                {/* Metric 1 (Row 1, Col 3) */}
                <div className="md:col-span-1 row-span-1 bg-white border border-slate-200/60 rounded-[24px] xl:rounded-[32px] p-6 lg:p-8 flex flex-col relative group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(249,115,22,0.1)] hover:border-orange-200 transition-all duration-300 animate-slide-up" style={animDelay(2)}>
                    <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-auto">Total Population</h3>
                    <div className="flex items-end justify-between mt-8 relative z-10">
                        <span className="text-4xl lg:text-5xl font-black text-slate-800 group-hover:text-orange-500 transition-colors tracking-tighter">1,204</span>
                        <div className="flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            4.2%
                        </div>
                    </div>
                    {/* Clean mini graph */}
                    <div className="absolute bottom-0 left-0 w-full h-[35%] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none overflow-hidden rounded-b-[24px] xl:rounded-b-[32px]">
                        <svg className="w-full h-full text-orange-500" viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0,30 L0,15 L10,20 L20,10 L30,22 L40,5 L50,18 L60,8 L70,25 L80,12 L90,28 L100,20 L100,30 Z" fill="currentColor"/></svg>
                    </div>
                </div>

                {/* Metric 2 (Row 1, Col 4) */}
                <div className="md:col-span-1 row-span-1 bg-white border border-slate-200/60 rounded-[24px] xl:rounded-[32px] p-6 lg:p-8 flex flex-col relative group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(239,68,68,0.1)] hover:border-red-200 transition-all duration-300 animate-slide-up" style={animDelay(3)}>
                    <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-auto flex justify-between">
                        Pending Alerts
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    </h3>
                    <div className="flex items-end justify-between mt-8 relative z-10">
                        <span className="text-4xl lg:text-5xl font-black text-slate-800 group-hover:text-red-500 transition-colors tracking-tighter">12</span>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">Action Req</span>
                    </div>
                </div>

                {/* Live Processing Feed (Row 2-3, Col 1) */}
                <div className="md:col-span-1 md:row-span-2 bg-white border border-slate-200/60 rounded-[24px] xl:rounded-[32px] p-6 lg:p-8 flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] animate-slide-up hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all" style={animDelay(4)}>
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4 shrink-0">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Live Activity Feed</h3>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-3 lg:gap-4 overflow-hidden relative">
                        {/* Gradient mask for fading out bottom list items */}
                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
                        
                        {[1,2,3,4,5].map((i) => (
                            <div key={i} className="flex gap-3 lg:gap-4 items-start group hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-all cursor-pointer">
                                <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] text-orange-600 font-bold">0x{i}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold text-slate-700 group-hover:text-orange-600 transition-colors truncate">Access Granted</p>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">SEC_AUTH_{Math.floor(Math.random()*9999)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Analytics Chart Area (Row 2-3, Col 2-3) */}
                <div className="md:col-span-2 md:row-span-2 bg-white border border-slate-200/60 rounded-[24px] xl:rounded-[32px] p-6 lg:p-8 flex flex-col shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] animate-slide-up group hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all" style={animDelay(5)}>
                    <div className="flex justify-between items-center mb-6 lg:mb-8 border-b border-slate-100 pb-4 shrink-0">
                        <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Network Traffic & Logins</h3>
                        <div className="flex gap-2">
                            <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 cursor-pointer transition-colors shadow-sm">24H</span>
                            <span className="bg-orange-50 text-orange-600 font-bold border border-orange-300 text-[10px] px-3 py-1.5 rounded-full shadow-sm cursor-pointer border-b-2">7D</span>
                        </div>
                    </div>

                    {/* Clean Animated Bar Chart Simulation */}
                    <div className="flex-1 flex items-end justify-between gap-3 md:gap-5 relative px-2 pt-6 pb-2 min-h-[140px]">
                        {/* Chart Grid Lines */}
                        <div className="absolute inset-x-2 top-0 bottom-2 flex flex-col justify-between pointer-events-none">
                            <div className="w-full h-[1px] bg-slate-100"></div>
                            <div className="w-full h-[1px] bg-slate-100"></div>
                            <div className="w-full h-[1px] bg-slate-100"></div>
                            <div className="w-full h-[1px] bg-slate-200"></div>
                        </div>
                        
                        {/* Bars */}
                        {[35, 65, 40, 85, 55, 90, 75].map((height, i) => (
                            <div key={i} className="relative w-full group/bar h-full flex items-end cursor-pointer">
                                {/* Tooltip */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity z-20 pointer-events-none mb-2">
                                    {height}
                                </div>
                                
                                {/* Bar Fill */}
                                <div 
                                    className="w-full bg-orange-100/80 border-t-[3px] border-orange-400 rounded-t-lg group-hover/bar:bg-orange-300 group-hover/bar:border-orange-500 transition-all duration-300 relative overflow-hidden"
                                    style={{ height: mounted ? `${height}%` : '0%', transition: 'height 1s cubic-bezier(0.2, 0.8, 0.2, 1)', transitionDelay: `${i*0.08}s` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sub-Metric / Tech Readout (Row 2, Col 4) */}
                <div className="md:col-span-1 row-span-1 bg-white border border-slate-200/60 rounded-[24px] xl:rounded-[32px] p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] animate-slide-up flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-all" style={animDelay(6)}>
                     <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-4 absolute top-6 left-6">System Health</h3>
                     {/* Clean radar mock */}
                     <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-slate-50 flex items-center justify-center mt-3 shadow-inner">
                         <div className="absolute inset-0 rounded-full border border-dashed border-slate-300 animate-[spin_8s_linear_infinite]"></div>
                         <div className="absolute inset-2 rounded-full border border-green-300 animate-[spin_4s_linear_infinite_reverse]"></div>
                         <span className="text-green-600 font-bold text-lg font-['Montserrat']">OK</span>
                     </div>
                </div>

                {/* Sub-Metric / Storage Readout (Row 3, Col 4) */}
                <div className="md:col-span-1 row-span-1 bg-white border border-slate-200/60 rounded-[24px] xl:rounded-[32px] p-6 lg:p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] animate-slide-up hover:shadow-md transition-all" style={animDelay(7)}>
                    <h3 className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Database Capacity</h3>
                    <div className="mt-4">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-black text-slate-800 tracking-tighter">68%</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">120 TB</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 w-[68%] rounded-full relative">
                                <div className="absolute top-0 right-0 w-2 h-full bg-white/60 rounded-full blur-[1px]"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
        </AdminLayout>
    );
}
