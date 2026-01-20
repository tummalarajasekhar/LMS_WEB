"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, BookOpen, Clock, ArrowRight, MoreVertical, Loader2, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({ activeCourses: 0, totalStudents: 0, recentCourses: [] });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 1. Get Logged In User ID
        const userId = localStorage.getItem('userId') || 'EMP001'; // Fallback for testing
        const userName = localStorage.getItem('userName') || 'Faculty';
        setUser({ name: userName, id: userId });

        // 2. Fetch Stats
        async function fetchDashboard() {
            try {
                const res = await fetch(`/api/faculty/dashboard?id=${userId}`);
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="h-[50vh] flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* 1. Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Hello, {user?.name} 👋</h1>
                <p className="text-slate-500">Here is what is happening with your courses today.</p>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="bg-blue-50 text-blue-600" />
                <StatCard icon={BookOpen} label="My Courses" value={stats.activeCourses} color="bg-purple-50 text-purple-600" />
                <StatCard icon={Clock} label="Hours Taught" value="--" color="bg-orange-50 text-orange-600" />
                <StatCard icon={TrendingUp} label="Avg. Rating" value="4.8/5" color="bg-emerald-50 text-emerald-600" />
            </div>

            {/* 3. Recent Courses Table (Real Data) */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-slate-800">Recent Courses</h2>
                    <Link href="/faculty/my-courses" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">Course Name</th>
                                <th className="px-6 py-4">Short Code</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.recentCourses.length > 0 ? (
                                stats.recentCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-800">{course.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold border border-slate-200">
                                                {course.short_title}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {new Date(course.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 p-2">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle size={24} className="opacity-20" />
                                            <p>No courses found. Create your first course!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    );
}