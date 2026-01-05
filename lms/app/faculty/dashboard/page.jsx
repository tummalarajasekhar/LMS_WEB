import React from 'react';
import Link from 'next/link';
import { TrendingUp, Users, BookOpen, Clock, ArrowRight, MoreVertical } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-8">

            {/* 1. Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back! Here's what's happening with your courses today.</p>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Students" value="1,240" trend="+12%" color="bg-blue-50 text-blue-600" />
                <StatCard icon={BookOpen} label="Active Courses" value="8" trend="2 New" color="bg-purple-50 text-purple-600" />
                <StatCard icon={Clock} label="Hours Taught" value="142h" color="bg-orange-50 text-orange-600" />
                <StatCard icon={TrendingUp} label="Avg. Rating" value="4.8/5" color="bg-emerald-50 text-emerald-600" />
            </div>

            {/* 3. Recent Courses Table */}
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
                                <th className="px-6 py-4">Students</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Dummy Data Row 1 */}
                            <CourseRow
                                title="Full Stack Web Development"
                                students={450}
                                status="Active"
                                statusColor="bg-green-100 text-green-700"
                            />
                            {/* Dummy Data Row 2 */}
                            <CourseRow
                                title="Data Structures in Java"
                                students={320}
                                status="Draft"
                                statusColor="bg-slate-100 text-slate-600"
                            />
                            {/* Dummy Data Row 3 */}
                            <CourseRow
                                title="Python for Data Science"
                                students={120}
                                status="Active"
                                statusColor="bg-green-100 text-green-700"
                            />
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

// --- Helper Components ---

function StatCard({ icon: Icon, label, value, trend, color }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                {trend && <span className="text-xs font-bold text-green-600 mt-1 block">{trend}</span>}
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} />
            </div>
        </div>
    );
}

function CourseRow({ title, students, status, statusColor }) {
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 font-medium text-slate-800">{title}</td>
            <td className="px-6 py-4 text-slate-600">{students}</td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="text-slate-400 hover:text-slate-600 p-2">
                    <MoreVertical size={18} />
                </button>
            </td>
        </tr>
    );
}