"use client";

import React from 'react';
import { Users, Search, Filter, Mail, UserPlus } from 'lucide-react';

export default function MyStudentsPage() {
    // We are not fetching data because there is no 'enrollment' table yet.
    // This simulates the "Empty State" perfectly.
    const students = [];

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Enrolled Students</h1>
                <p className="text-slate-500">View progress and manage students across your courses.</p>
            </div>

            {/* FILTER BAR (Disabled Look) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 opacity-50 pointer-events-none select-none">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input disabled className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50" placeholder="Search students..." />
                </div>
                <button disabled className="px-4 py-2 border border-slate-200 rounded-lg text-slate-500 flex items-center gap-2">
                    <Filter size={16} /> Filter
                </button>
            </div>

            {/* --- EMPTY STATE (Requested Feature) --- */}
            {students.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">

                    {/* Illustration Container */}
                    <div className="relative mb-6">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                            <Users size={40} className="text-slate-300" />
                        </div>
                        {/* Small floating badge */}
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                            <span className="text-xl">🤷‍♂️</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">No Students Found</h3>
                    <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                        It looks like no students have enrolled in your courses yet.
                        <br />Once they join, they will appear here automatically.
                    </p>

                    <button disabled className="bg-slate-100 text-slate-400 px-6 py-3 rounded-xl font-bold flex items-center gap-2 cursor-not-allowed">
                        <UserPlus size={18} /> Manually Add Student
                    </button>

                    <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-wider font-bold">
                        Waiting for Enrollments...
                    </p>
                </div>
            )}

        </div>
    );
}