"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, PlusCircle, BookOpen, Users,
    Settings, LogOut, Menu, X, Bell
} from 'lucide-react';

export default function FacultyLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">

            {/* --- SIDEBAR (Desktop: Visible, Mobile: Hidden unless toggled) --- */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
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
                    <NavItem href="/faculty/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/faculty/course-editor" icon={PlusCircle} label="Create Course" />
                    <NavItem href="/faculty/my-courses" icon={BookOpen} label="My Courses" />
                    <NavItem href="/faculty/students" icon={Users} label="My Students" />
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <NavItem href="/faculty/settings" icon={Settings} label="Settings" />
                    </div>
                </nav>

                {/* User Profile Snippet (Bottom) */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                    <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full">
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
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
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800">Kalyan (Faculty)</p>
                                <p className="text-xs text-slate-500">Computer Science Dept.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                K
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
function NavItem({ href, icon: Icon, label }) {
    const pathname = usePathname();
    const isActive = pathname === href;

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