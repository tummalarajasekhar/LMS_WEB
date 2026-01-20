"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, BookOpen, Trophy, Calendar,
    LogOut, Menu, X, Bell, User, GraduationCap
} from 'lucide-react';

export default function StudentLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState({ name: 'Student', id: '...' });
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Load student name from login session
        const storedName = localStorage.getItem('userName');
        const storedId = localStorage.getItem('userId');
        if (storedName) setUser({ name: storedName, id: storedId });
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            localStorage.clear();
            router.push('/login');
        } catch (err) {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">

            {/* SIDEBAR */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="text-blue-400" size={24} />
                        <span className="text-lg font-bold tracking-tight text-white">Student <span className="text-blue-400">Hub</span></span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white"><X size={24} /></button>
                </div>

                <nav className="p-4 space-y-2 mt-4">
                    <NavItem href="/student/dashboard" icon={LayoutDashboard} label="Dashboard" isActive={pathname === '/student/dashboard'} />
                    <NavItem href="/student/courses" icon={BookOpen} label="My Courses" isActive={pathname === '/student/courses'} />
                    <NavItem href="/student/achievements" icon={Trophy} label="Achievements" isActive={pathname === '/student/achievements'} />
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full px-2">
                        <LogOut size={20} /> <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 md:ml-64 flex flex-col">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-slate-600"><Menu size={24} /></button>
                    <div className="flex items-center gap-6 ml-auto">
                        <button className="relative text-slate-500 hover:text-blue-600"><Bell size={20} /></button>
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
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
            </div>
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        </div>
    );
}

function NavItem({ href, icon: Icon, label, isActive }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Icon size={20} /> <span>{label}</span>
        </Link>
    );
}