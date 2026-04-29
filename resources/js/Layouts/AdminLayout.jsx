import LogoutButton from '@/Components/LogoutButton';
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

// Common SVG Icons
const DashboardIcon = () => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
const UserIcon = () => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
const DocumentIcon = () => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);
const SettingsIcon = () => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const SearchIcon = () => (
    <svg className="w-[18px] h-[18px] text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const BellIcon = () => (
    <svg className="w-5 h-5 text-slate-400 hover:text-orange-500 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
);

export default function AdminLayout({ children, title, activeTab }) {
    const { auth, avatarPlaceholderUrl } = usePage().props;
    const userName = auth?.user?.name || 'John Doe';
    const isAdmin = Boolean(auth?.user?.is_admin);

    // Unboxed, pristine active states utilizing soft orange accent bars
    const navLinkClass = (tabId) => 
        tabId === activeTab 
        ? "flex items-center gap-4 px-6 py-3.5 mx-3 mb-1 rounded-2xl bg-orange-50/50 text-orange-600 font-bold transition-all relative overflow-hidden group" 
        : "flex items-center gap-4 px-6 py-3.5 mx-3 mb-1 rounded-2xl text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-800 transition-all hover:translate-x-1 group";

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-orange-500 selection:text-white overflow-hidden p-2 md:p-4">
            <Head title={title || "Admin Sandbox"} />

            {/* Premium Sidebar Frame */}
            <aside className="w-[280px] bg-white rounded-[24px] xl:rounded-[32px] flex flex-col justify-between overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-200/50 z-10 shrink-0">
                
                <div className="flex flex-col h-full relative">
                    
                    {/* Logo area */}
                    <div className="flex items-center gap-4 px-7 pt-9 pb-8 mb-2">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm border border-slate-100 shrink-0">
                            <img src="/logo.png" className="w-full h-full rounded-full object-cover" alt="Logo" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <span className="text-slate-800 font-black text-sm leading-tight tracking-tight uppercase">System Portal</span>
                            <span className="text-orange-500 font-bold text-[10px] uppercase tracking-widest mt-0.5">Admin Role</span>
                        </div>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex flex-col flex-1 mt-2 overflow-y-auto w-full styled-scrollbar">
                        <Link href={route('dashboard')} className={navLinkClass('dashboard')}>
                            {activeTab === 'dashboard' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>}
                            <span className="opacity-90 group-hover:scale-110 transition-transform"><DashboardIcon /></span>
                            <span className="text-[14px]">Overview</span>
                        </Link>
                        
                        <Link href={route('students')} className={navLinkClass('students')}>
                            {activeTab === 'students' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>}
                            <span className="opacity-90 group-hover:scale-110 transition-transform"><UserIcon /></span>
                            <span className="text-[14px]">Students</span>
                        </Link>
                        
                        <Link href={route('reports')} className={navLinkClass('reports')}>
                            {activeTab === 'reports' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>}
                            <span className="opacity-90 group-hover:scale-110 transition-transform"><DocumentIcon /></span>
                            <span className="text-[14px]">Reports</span>
                        </Link>
                        
                        {isAdmin && (
                            <Link href={route('settings')} className={navLinkClass('settings')}>
                                {activeTab === 'settings' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>}
                                <span className="opacity-90 group-hover:scale-110 transition-transform"><SettingsIcon /></span>
                                <span className="text-[14px]">Settings</span>
                            </Link>
                        )}
                    </nav>

                    <div className="mt-auto p-6 bg-white">
                        <LogoutButton className="w-full py-3.5 flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-2xl font-bold text-[11px] tracking-widest uppercase transition-all shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Execute Sign Out
                        </LogoutButton>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col pl-4 lg:pl-6 max-h-screen relative overflow-hidden">
                
                {/* Header Navbar */}
                <header className="h-[80px] bg-white/60 backdrop-blur-xl rounded-[24px] flex items-center justify-between px-6 lg:px-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-slate-200/50 shrink-0 z-10 sticky top-0 mt-0">
                    
                    <div className="flex items-center gap-4 flex-1 max-w-sm"></div>
                    
                    <div className="flex items-center gap-6 pl-4 object-right">
                        <div className="relative group cursor-pointer hover:-translate-y-0.5 transition-transform">
                            <div className="p-2 bg-white rounded-full border border-slate-200 shadow-sm group-hover:border-orange-200 transition-colors">
                                <BellIcon />
                            </div>
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200"></div>
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="flex flex-col text-right">
                                <span className="text-[13px] font-black text-slate-800 leading-tight group-hover:text-orange-500 transition-colors">{userName}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight mt-1">Global Admin</span>
                            </div>
                            <img src={avatarPlaceholderUrl} className="w-[42px] h-[42px] rounded-[14px] object-cover border-2 border-slate-100 shadow-sm group-hover:shadow-md transition-all group-hover:border-orange-200" alt="User" />
                        </div>
                    </div>
                </header>

                {/* Main Content Sub-Wrapper */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto mt-4 px-1 pb-4">
                     {children}
                </main>
            </div>
        </div>
    );
}
