"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Users, FileSpreadsheet, Settings,
    LogOut, Menu, X, ShieldAlert
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        // In a real app, you would clear cookies/tokens here
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">

            {/* --- SIDEBAR --- */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="text-red-500" size={24} />
                        <span className="text-lg font-bold tracking-tight text-white">ADMIN <span className="text-red-500">PANEL</span></span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-2 mt-4">
                    <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Overview" />
                    <NavItem href="/admin/users" icon={Users} label="User Management" />
                    <NavItem href="/admin/courses" icon={FileSpreadsheet} label="All Courses" />

                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <NavItem href="/admin/settings" icon={Settings} label="System Settings" />
                    </div>
                </nav>

                {/* Admin Profile Snippet (Bottom) */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center font-bold text-white text-xs">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">System Admin</p>
                            <p className="text-[10px] text-slate-400">Super User</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors w-full px-2"
                    >
                        <LogOut size={18} />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className="flex-1 md:ml-64 flex flex-col">

                {/* Top Navbar (Mobile Only mostly) */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30 md:hidden">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600">
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-slate-700">Admin Portal</span>
                    </div>
                </header>

                {/* Page Content Injection */}
                <main className="flex-1 overflow-y-auto">
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
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </Link>
    );
}