"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayCircle, Clock, Award, ArrowRight, BookOpen, Loader2 } from 'lucide-react';

export default function StudentDashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ name: 'Student' });

    useEffect(() => {
        setUser({ name: localStorage.getItem('userName') || 'Student' });

        async function fetchCourses() {
            try {
                const res = await fetch('/api/student/courses');
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (err) {
                console.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* 1. HERO HEADER */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 🚀</h1>
                    <p className="text-slate-300 mb-6">Ready to continue your learning journey?</p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <Clock size={18} className="text-blue-400" /> <span className="font-bold">0h Spent</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. AVAILABLE COURSES GRID */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Available Courses</h2>
                    <Link href="/student/courses" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
                </div>

                {loading ? (
                    <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-400" /></div>
                ) : courses.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl border border-slate-200 text-slate-500">No courses available yet.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link href={`/student/courses/${course.id}`} key={course.id}>
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col">
                                    <div className={`h-28 ${course.color || 'bg-blue-600'} flex items-center justify-center`}>
                                        <h3 className="text-white font-black text-3xl tracking-tighter opacity-80 group-hover:scale-110 transition-transform">{course.short_title}</h3>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h4 className="font-bold text-slate-900 mb-1 truncate">{course.title}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">{course.description || "No description."}</p>
                                        <button className="w-full py-2.5 rounded-lg bg-slate-50 text-slate-700 font-bold text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                                            Start Learning <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}