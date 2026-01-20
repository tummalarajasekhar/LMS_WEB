"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen, MoreVertical, Plus, Calendar,
    Users, Edit, Trash2, Loader2, Search
} from 'lucide-react';

export default function MyCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem('userId') || 'EMP001';

        async function fetchCourses() {
            try {
                const res = await fetch(`/api/faculty/courses?id=${userId}`);
                const data = await res.json();
                if (Array.isArray(data)) setCourses(data);
            } catch (err) {
                console.error("Failed to load courses");
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Courses</h1>
                    <p className="text-slate-500">Manage your curriculum and content.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <Link href="/faculty/create-course" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <Plus size={20} /> <span className="hidden sm:inline">Create New</span>
                    </Link>
                </div>
            </div>

            {/* CONTENT AREA */}
            {loading ? (
                <div className="h-64 flex items-center justify-center text-slate-400 gap-2">
                    <Loader2 className="animate-spin" /> Loading Library...
                </div>
            ) : filteredCourses.length === 0 ? (
                // EMPTY STATE
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                        <BookOpen size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No Courses Yet</h3>
                    <p className="text-slate-500 max-w-sm mt-2 mb-6">You haven't created any courses yet. Start building your curriculum today.</p>
                    <Link href="/faculty/course-editor" className="text-blue-600 font-bold hover:underline">
                        + Create First Course
                    </Link>
                </div>
            ) : (
                // GRID LAYOUT
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                            {/* Thumbnail Area */}
                            <div className={`h-32 ${course.color || 'bg-blue-600'} relative p-6 flex flex-col justify-between`}>
                                <div className="flex justify-between items-start">
                                    <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                                        PUBLISHED
                                    </span>
                                    <button className="text-white/70 hover:text-white"><MoreVertical size={20} /></button>
                                </div>
                                <h3 className="text-white font-bold text-2xl tracking-tight truncate opacity-90">
                                    {course.short_title}
                                </h3>
                            </div>

                            {/* Content Area */}
                            <div className="p-5">
                                <h4 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{course.title}</h4>
                                <p className="text-slate-500 text-sm line-clamp-2 h-10 mb-4">
                                    {course.description || "No description provided."}
                                </p>

                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6">
                                    <div className="flex items-center gap-1">
                                        <Users size={14} /> 0 Students
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} /> {new Date(course.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-slate-100 pt-4">
                                    <button className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-2">
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button className="w-10 flex items-center justify-center rounded-lg border border-red-100 text-red-500 hover:bg-red-50">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}