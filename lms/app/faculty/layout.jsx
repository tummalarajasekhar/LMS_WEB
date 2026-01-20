"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, PlusCircle, BookOpen, Users,
    Settings, LogOut, Menu, X, Bell, User
} from 'lucide-react';

export default function FacultyLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState({ name: 'Faculty', id: 'EMP...' });
    const router = useRouter();
    const pathname = usePathname();

    // 1. Load User Info on Mount (For Display Only)
    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedId = localStorage.getItem('userId');

        if (storedName) {
            setUser({
                name: storedName,
                id: storedId || 'EMP...'
            });
        }
    }, []);

    // 2. Secure Logout Handler
    const handleLogout = async () => {
        try {
            // A. Call API to delete the Secure Cookie
            await fetch('/api/auth/logout', { method: 'POST' });

            // B. Clear UI State
            localStorage.clear();

            // C. Redirect
            router.push('/login');
        } catch (err) {
            console.error("Logout failed", err);
            // Force redirect even if API fails
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">

            {/* --- SIDEBAR --- */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <span className="text-xl font-bold tracking-tight text-blue-400">TPRCS <span className="text-white">LMS</span></span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-2 mt-4">
                    <NavItem href="/faculty/dashboard" icon={LayoutDashboard} label="Dashboard" isActive={pathname === '/faculty/dashboard'} />
                    <NavItem href="/faculty/create-course" icon={PlusCircle} label="Create Course" isActive={pathname === '/faculty/course-editor'} />
                    <NavItem href="/faculty/my-courses" icon={BookOpen} label="My Courses" isActive={pathname === '/faculty/my-courses'} />
                    <NavItem href="/faculty/students" icon={Users} label="My Students" isActive={pathname === '/faculty/students'} />

                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <NavItem href="/faculty/settings" icon={Settings} label="Settings" isActive={pathname === '/faculty/settings'} />
                    </div>
                </nav>

                {/* User Profile & Logout (Bottom) */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full px-2"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 md:ml-64 flex flex-col">

                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-600">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-semibold text-slate-700 hidden md:block">Faculty Portal</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
                            <Bell size={20} />
                            {/* Notification Dot */}
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.id}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content Injection */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>

            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}

// Helper Component for Sidebar Links
function NavItem({ href, icon: Icon, label, isActive }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );
}