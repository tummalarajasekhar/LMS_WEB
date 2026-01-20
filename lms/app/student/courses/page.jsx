"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Search } from 'lucide-react';

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch('/api/student/courses');
                if (res.ok) setCourses(await res.json());
            } catch (err) { } finally { setLoading(false); }
        }
        fetchCourses();
    }, []);

    const filtered = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800">Course Library</h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filtered.map((course) => (
                        <Link href={`/student/courses/${course.id}`} key={course.id}>
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group h-full">
                                <div className={`h-32 ${course.color || 'bg-blue-600'} flex items-center justify-center`}>
                                    <span className="text-white font-black text-4xl opacity-50">{course.short_title}</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                                    <div className="mt-4 flex justify-end">
                                        <span className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Open Player <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}