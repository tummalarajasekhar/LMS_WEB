"use client";

import React, { useState, useEffect } from 'react';
import { Users, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ students: 0, faculty: 0, courses: 0 });
    const [loading, setLoading] = useState(true);

    // FETCH REAL STATS
    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.students !== undefined) setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-6 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
                <p className="text-slate-500">Live data from your institution.</p>
            </header>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={Users}
                    label="Total Students"
                    value={loading ? "..." : stats.students}
                    color="bg-blue-600"
                />
                <StatCard
                    icon={Users}
                    label="Total Faculty"
                    value={loading ? "..." : stats.faculty}
                    color="bg-purple-600"
                />
                <StatCard
                    icon={FileSpreadsheet}
                    label="Active Courses"
                    value={loading ? "..." : stats.courses}
                    color="bg-emerald-600"
                />
            </div>

            <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl">
                <p>Select "User Management" from the sidebar to manage students.</p>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">{label}</p>
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            </div>
        </div>
    );
}