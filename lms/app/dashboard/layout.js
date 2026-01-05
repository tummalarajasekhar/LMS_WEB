import Link from 'next/link';
import { BookOpen, LayoutDashboard, Terminal, Users, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-400">CSE Portal</h1>
                    <p className="text-xs text-slate-400 mt-1">College Edition v1.0</p>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" active />
                    <NavItem icon={<BookOpen size={20} />} label="My Courses" href="/dashboard/courses" />
                    <NavItem icon={<Terminal size={20} />} label="Code Playground" href="/dashboard/playground" />
                    <NavItem icon={<Users size={20} />} label="Placement Hub" href="/dashboard/placements" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

// Simple Helper Component for Nav Items
function NavItem({ icon, label, href, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
        >
            {icon}
            <span className="font-medium">{label}</span>
        </Link>
    );
}