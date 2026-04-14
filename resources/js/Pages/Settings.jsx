import InputError from '@/Components/InputError';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function Settings({ adminUsers = [] }) {
    const { errors } = usePage().props;
    const [activeMenu, setActiveMenu] = useState('users');
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const createForm = useForm({ name: '', email: '' });
    const editForm = useForm({ name: '', email: '', is_active: true });

    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [configSaveMsg, setConfigSaveMsg] = useState('');

    const menus = [
        { id: 'users', label: 'User Management' },
        { id: 'config', label: 'System Configuration' },
        { id: 'audit', label: 'Audit Logs Viewer' },
        { id: 'data', label: 'Data Import/Export' },
        { id: 'backup', label: 'Backup & Restore' },
    ];

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setIsUserModalOpen(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('settings.admins.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsUserModalOpen(false);
                createForm.reset();
            },
        });
    };

    const openEditModal = (user) => {
        editForm.clearErrors();
        editForm.setData({
            name: user.name,
            email: user.email,
            is_active: user.status === 'Active',
        });
        setEditingUser(user);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.patch(route('settings.admins.update', editingUser.id), {
            preserveScroll: true,
            onSuccess: () => setEditingUser(null),
        });
    };

    const revokeAdmin = (user) => {
        if (!window.confirm(`Revoke administrator access for ${user.name}?`)) {
            return;
        }
        router.delete(route('settings.admins.destroy', user.id), {
            preserveScroll: true,
        });
    };

    const handleConfigToggle = () => {
        setMaintenanceMode(!maintenanceMode);
        setConfigSaveMsg('Saving configuration...');
        setTimeout(() => setConfigSaveMsg('Changes saved successfully!'), 800);
        setTimeout(() => setConfigSaveMsg(''), 3000);
    };

    return (
        <AdminLayout title="System Settings" activeTab="settings">
            <div className="flex h-full w-full font-['Montserrat'] animate-fade-in relative z-10 gap-6">
                <div className="w-[280px] bg-white rounded-[24px] xl:rounded-[32px] p-6 flex flex-col gap-2 shrink-0 border border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                    <h2 className="text-[10px] font-black text-slate-400 px-4 uppercase tracking-[0.2em] mb-4">Admin Tools</h2>

                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            type="button"
                            onClick={() => setActiveMenu(menu.id)}
                            className={`text-left px-5 py-4 rounded-xl text-[13px] transition-all relative overflow-hidden group ${activeMenu === menu.id ? 'bg-orange-50 font-black text-orange-600 shadow-sm' : 'font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                        >
                            <span className="relative z-10">{menu.label}</span>
                            {activeMenu === menu.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1.5 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.4)] animate-slide-up"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto relative bg-transparent pr-4">
                    <div className="relative z-10 animate-fade-in" key={activeMenu}>
                        <div className="flex justify-between items-end mb-8 pt-4 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">
                                    {menus.find((m) => m.id === activeMenu).label}
                                </h2>
                                <p className="text-sm font-medium text-slate-500 tracking-wide">
                                    {activeMenu === 'users'
                                        ? 'Administer account delegations and role-based clearance.'
                                        : activeMenu === 'config'
                                          ? 'Modify global environment states.'
                                          : 'Module integration pending connection.'}
                                </p>
                            </div>
                        </div>

                        {activeMenu === 'users' && (
                            <div className="bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 overflow-hidden mb-6 animate-slide-up">
                                <div className="p-6 md:px-8 border-b border-slate-100 flex justify-between items-center bg-white shadow-sm z-10 relative">
                                    <h3 className="font-black text-slate-800 text-[14px]">System Administrators</h3>
                                    <button
                                        type="button"
                                        onClick={openCreateModal}
                                        className="text-[11px] tracking-widest uppercase bg-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] hover:bg-orange-600 transition-all hover:-translate-y-0.5 active:scale-95"
                                    >
                                        + Add New Admin
                                    </button>
                                </div>
                                {errors.revoke && (
                                    <div className="px-6 md:px-8 pt-4">
                                        <InputError message={errors.revoke} className="text-[11px] font-bold" />
                                    </div>
                                )}
                                <div className="p-0 bg-white">
                                    {adminUsers.length === 0 ? (
                                        <div className="p-10 text-center text-sm font-bold text-slate-400 tracking-wide">
                                            No administrator accounts yet. Add one to grant access.
                                        </div>
                                    ) : (
                                        adminUsers.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:px-8 border-b border-slate-100/60 last:border-0 hover:bg-orange-50/30 transition-colors group"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors shadow-sm">
                                                        <span className="text-orange-500 font-black text-xl group-hover:text-white transition-colors">
                                                            {user.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-slate-800 group-hover:text-orange-600 transition-colors">{user.name}</p>
                                                        <div className="flex gap-2 items-center mt-1 flex-wrap">
                                                            <p className="text-xs font-bold text-slate-400">{user.email}</p>
                                                            <span className="w-1 h-1 rounded-full bg-slate-200 hidden sm:block"></span>
                                                            <span
                                                                className={`text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md shadow-sm border ${user.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                                                            >
                                                                {user.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 mt-4 md:mt-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(user)}
                                                        className="px-5 py-2.5 text-[11px] tracking-widest uppercase font-bold text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-all shadow-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => revokeAdmin(user)}
                                                        className="px-5 py-2.5 text-[11px] tracking-widest uppercase font-bold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all shadow-sm"
                                                    >
                                                        Revoke
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeMenu === 'config' && (
                            <div className="bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 p-8 xl:p-10 animate-slide-up space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-black text-xl tracking-tight text-slate-800 mb-2">Maintenance Mode</h3>
                                        <p className="text-sm font-medium text-slate-500 max-w-md">When enabled, the system will prevent students and faculty from logging in.</p>
                                    </div>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 border shadow-inner ${maintenanceMode ? 'bg-orange-500 border-orange-600' : 'bg-slate-200 border-slate-300'}`}
                                        onClick={handleConfigToggle}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleConfigToggle();
                                            }
                                        }}
                                    >
                                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${maintenanceMode ? 'translate-x-8' : ''}`}></div>
                                    </div>
                                </div>
                                <hr className="border-slate-100" />
                                <div>
                                    <h3 className="font-black text-lg tracking-tight text-slate-800 mb-4">Semester Control</h3>
                                    <select className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all cursor-pointer">
                                        <option>2026 - First Semester</option>
                                        <option>2026 - Second Semester</option>
                                    </select>
                                </div>

                                {configSaveMsg && (
                                    <div className="fixed bottom-10 right-10 bg-slate-800 text-white px-6 py-4 rounded-xl shadow-2xl font-bold text-sm tracking-wide animate-slide-up flex items-center gap-4 z-50">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse border border-green-200"></div>
                                        {configSaveMsg}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeMenu !== 'users' && activeMenu !== 'config' && (
                            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[24px] xl:rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-200 animate-slide-up border-dashed opacity-80 hover:opacity-100 transition-opacity">
                                <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-slate-800 font-black tracking-tight text-xl mb-2">{menus.find((m) => m.id === activeMenu).label}</p>
                                <p className="text-sm font-bold tracking-widest uppercase text-slate-400">Currently awaiting backend data link integration.</p>
                            </div>
                        )}
                    </div>
                </div>

                {isUserModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" onClick={() => !createForm.processing && setIsUserModalOpen(false)}></div>
                        <div className="bg-white rounded-[32px] shadow-2xl border border-white w-full max-w-md p-10 relative z-10 animate-slide-up font-['Montserrat']">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Issue Admin Account</h3>
                            <p className="text-[13px] font-medium text-slate-500 mb-8 tracking-wide">Creates the account (or grants access if the email already exists).</p>

                            <form onSubmit={submitCreate} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-inner"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                    />
                                    <InputError message={createForm.errors.name} className="mt-2 ml-2 text-[11px] font-bold" />
                                </div>
                                <div className="pb-4">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-inner"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                    />
                                    <InputError message={createForm.errors.email} className="mt-2 ml-2 text-[11px] font-bold" />
                                </div>

                                <div className="flex gap-4 justify-end pt-4">
                                    <button
                                        type="button"
                                        disabled={createForm.processing}
                                        onClick={() => setIsUserModalOpen(false)}
                                        className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={createForm.processing}
                                        type="submit"
                                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-[11px] tracking-widest uppercase font-bold rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50"
                                    >
                                        {createForm.processing ? 'Processing...' : 'Create Admin'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md" onClick={() => !editForm.processing && setEditingUser(null)}></div>
                        <div className="bg-white rounded-[32px] shadow-2xl border border-white w-full max-w-md p-10 relative z-10 animate-slide-up font-['Montserrat']">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Edit Administrator</h3>
                            <p className="text-[13px] font-medium text-slate-500 mb-8 tracking-wide">Update profile and account status.</p>

                            <form onSubmit={submitEdit} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-inner"
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                    />
                                    <InputError message={editForm.errors.name} className="mt-2 ml-2 text-[11px] font-bold" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-2">Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition-all shadow-inner"
                                        value={editForm.data.email}
                                        onChange={(e) => editForm.setData('email', e.target.value)}
                                    />
                                    <InputError message={editForm.errors.email} className="mt-2 ml-2 text-[11px] font-bold" />
                                </div>
                                <div className="flex items-center gap-3 pb-2">
                                    <input
                                        id="edit-is-active"
                                        type="checkbox"
                                        className="rounded border-slate-300 text-orange-500 shadow-sm focus:ring-orange-200"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                    />
                                    <label htmlFor="edit-is-active" className="text-sm font-bold text-slate-600">
                                        Active account
                                    </label>
                                </div>

                                <div className="flex gap-4 justify-end pt-4">
                                    <button
                                        type="button"
                                        disabled={editForm.processing}
                                        onClick={() => setEditingUser(null)}
                                        className="px-6 py-3 text-[11px] uppercase tracking-widest font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={editForm.processing}
                                        type="submit"
                                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-[11px] tracking-widest uppercase font-bold rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
