"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    PlayCircle, FileText, Menu, Loader2, CheckCircle, Code, XCircle, RefreshCcw
} from 'lucide-react';

const safeParse = (data) => {
    if (!data) return [];
    if (typeof data === 'object') return data;
    try { return JSON.parse(data); } catch (e) { return []; }
};

export default function CoursePlayerPage() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState(null);

    // Navigation State
    const [activeItem, setActiveItem] = useState(null);
    const [activeType, setActiveType] = useState('video');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // --- 🔥 NEW: QUIZ STATES ---
    const [quizAnswers, setQuizAnswers] = useState({}); // { questionId: optionIndex }
    const [quizResult, setQuizResult] = useState(null); // { score: 10, total: 20, passed: true }
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!params?.courseId) return;

        async function fetchContent() {
            try {
                const res = await fetch(`/api/student/course-details?id=${params.courseId}`);
                const data = await res.json();

                if (data.course) {
                    setCourseData(data);
                    // Auto-select first item
                    if (data.sections.length > 0) {
                        const firstSec = data.sections[0];
                        if (firstSec.topics.length > 0) handleItemClick(firstSec.topics[0], firstSec.topics[0].type);
                        else if (firstSec.quiz) handleItemClick(firstSec.quiz, 'quiz');
                        else if (firstSec.assignments.length > 0) handleItemClick(firstSec.assignments[0], 'assignment');
                    }
                }
            } catch (err) {
                console.error("Error loading content:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchContent();
    }, [params]);

    const handleItemClick = (item, type) => {
        setActiveItem(item);
        setActiveType(type);

        // Reset Quiz state when switching items
        if (type === 'quiz') {
            setQuizAnswers({});
            setQuizResult(null);
        }

        if (window.innerWidth < 768) setSidebarOpen(false);
    };

    // --- 🔥 NEW: HANDLE ANSWER SELECTION ---
    const handleOptionSelect = (qId, optionIdx) => {
        setQuizAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    };

    // --- 🔥 NEW: HANDLE SUBMIT ---
    const handleQuizSubmit = async () => {
        if (!activeItem || !activeItem.questions) return;

        // Check if all questions answered (Optional)
        if (Object.keys(quizAnswers).length < activeItem.questions.length) {
            if (!confirm("You haven't answered all questions. Submit anyway?")) return;
        }

        setIsSubmitting(true);
        const studentId = localStorage.getItem('userId');

        try {
            const res = await fetch('/api/student/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    quizId: activeItem.id,
                    answers: quizAnswers
                })
            });

            const result = await res.json();
            if (result.success) {
                setQuizResult(result);
            } else {
                alert("Failed to submit: " + result.error);
            }
        } catch (err) {
            alert("Network error submitting quiz");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
    if (!courseData) return <div className="p-10 text-center">Course not found.</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">

            {/* HEADER */}
            <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-slate-50 shrink-0">
                <h2 className="font-bold text-slate-800 line-clamp-1">{courseData.course.title}</h2>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-sm font-bold text-blue-600 flex items-center gap-2 lg:hidden">
                    {sidebarOpen ? 'Hide' : 'Menu'} <Menu size={18} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">

                {/* --- MAIN PLAYER AREA --- */}
                <div className="flex-1 bg-slate-100 overflow-y-auto relative">
                    {activeItem ? (
                        <>
                            {/* 1. VIDEO VIEW */}
                            {activeType === 'video' && (
                                <div className="w-full h-full bg-black flex flex-col">
                                    <div className="flex-1 flex items-center justify-center">
                                        <iframe
                                            src={activeItem.url?.replace('watch?v=', 'embed/')}
                                            className="w-full h-full aspect-video max-h-[80vh]"
                                            allowFullScreen
                                            title="Video"
                                        />
                                    </div>
                                    <div className="p-6 bg-white">
                                        <h1 className="text-xl font-bold text-slate-900">{activeItem.title}</h1>
                                    </div>
                                </div>
                            )}

                            {/* 2. PDF/FILE VIEW */}
                            {activeType === 'pdf' && (
                                <div className="h-full flex flex-col items-center justify-center p-10">
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md text-center">
                                        <FileText size={48} className="text-orange-500 mx-auto mb-4" />
                                        <h2 className="text-lg font-bold mb-2">{activeItem.title}</h2>
                                        <a href={activeItem.url} target="_blank" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Open Resource</a>
                                    </div>
                                </div>
                            )}

                            {/* 3. QUIZ VIEW (UPDATED) */}
                            {activeType === 'quiz' && (
                                <div className="max-w-3xl mx-auto p-6">
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">

                                        {/* RESULT SCREEN */}
                                        {quizResult ? (
                                            <div className="text-center py-10">
                                                {quizResult.passed ? (
                                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <CheckCircle size={40} />
                                                    </div>
                                                ) : (
                                                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <XCircle size={40} />
                                                    </div>
                                                )}
                                                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                                    You Scored {quizResult.score} / {quizResult.totalMarks}
                                                </h2>
                                                <p className={`text-lg font-bold mb-8 ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                                                    {quizResult.passed ? "Congratulations! You Passed." : "You failed. Try again!"}
                                                </p>
                                                <button
                                                    onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                                                    className="flex items-center gap-2 mx-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800"
                                                >
                                                    <RefreshCcw size={18} /> Retake Quiz
                                                </button>
                                            </div>
                                        ) : (
                                            // QUESTION SCREEN
                                            <>
                                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                                    <div>
                                                        <h1 className="text-2xl font-bold text-slate-900">Unit Quiz</h1>
                                                        <p className="text-slate-500">Time Limit: {activeItem.time_limit} mins</p>
                                                    </div>
                                                    <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded text-sm">
                                                        {activeItem.questions?.length || 0} Questions
                                                    </span>
                                                </div>

                                                <div className="space-y-8">
                                                    {activeItem.questions?.map((q, idx) => (
                                                        <div key={q.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                            <p className="font-bold text-slate-800 mb-4">{idx + 1}. {q.text}</p>
                                                            <div className="space-y-2">
                                                                {safeParse(q.options).map((opt, oIdx) => (
                                                                    <label
                                                                        key={oIdx}
                                                                        className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors ${quizAnswers[q.id] === oIdx
                                                                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                                                                : 'bg-white border-slate-200 hover:border-blue-300'
                                                                            }`}
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            name={`q-${q.id}`}
                                                                            className="w-4 h-4 accent-blue-600"
                                                                            checked={quizAnswers[q.id] === oIdx}
                                                                            onChange={() => handleOptionSelect(q.id, oIdx)}
                                                                        />
                                                                        <span className="text-sm text-slate-700">{opt}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={handleQuizSubmit}
                                                    disabled={isSubmitting}
                                                    className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                                                    Submit Quiz
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 4. ASSIGNMENT VIEW */}
                            {activeType === 'assignment' && (
                                <div className="max-w-4xl mx-auto p-6">
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                                <Code size={24} />
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-bold text-slate-900">{activeItem.title}</h1>
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{activeItem.type} Assignment</span>
                                            </div>
                                        </div>

                                        <div className="prose max-w-none bg-slate-50 p-6 rounded-lg border border-slate-100 mb-6">
                                            <h3 className="font-bold text-slate-700">Problem Statement:</h3>
                                            <p className="text-slate-600">{activeItem.problem}</p>
                                        </div>

                                        {activeItem.type === 'coding' && (
                                            <div className="mb-6">
                                                <h3 className="font-bold text-slate-700 mb-2">Test Cases:</h3>
                                                <div className="grid gap-2">
                                                    {safeParse(activeItem.test_cases).map((tc, i) => (
                                                        <div key={i} className="flex gap-4 text-xs font-mono bg-slate-900 text-white p-3 rounded">
                                                            <span>Input: {tc.input}</span>
                                                            <span className="text-slate-500">|</span>
                                                            <span>Output: {tc.output}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700">Upload Solution</button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">Select content to start</div>
                    )}
                </div>

                {/* SIDEBAR */}
                <div className={`
          w-80 bg-white border-l border-slate-200 overflow-y-auto shrink-0 absolute md:static inset-y-0 right-0 z-20 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:border-none'}
        `}>
                    <div className="p-4 border-b border-slate-100 bg-slate-50 sticky top-0">
                        <h3 className="font-bold text-slate-700 text-sm uppercase">Course Content</h3>
                    </div>

                    <div className="p-3 space-y-4">
                        {courseData.sections.map((section, idx) => (
                            <div key={section.id}>
                                <div className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Unit {idx + 1}: {section.title}</div>

                                <div className="space-y-1">
                                    {section.topics.map((topic) => (
                                        <SidebarItem
                                            key={topic.id}
                                            active={activeItem?.id === topic.id}
                                            icon={topic.type === 'video' ? PlayCircle : FileText}
                                            title={topic.title}
                                            onClick={() => handleItemClick(topic, topic.type)}
                                        />
                                    ))}
                                    {section.quiz && (
                                        <SidebarItem
                                            key={'q-' + section.quiz.id}
                                            active={activeItem?.id === section.quiz.id}
                                            icon={CheckCircle}
                                            title="Unit Quiz"
                                            color="text-blue-600"
                                            onClick={() => handleItemClick(section.quiz, 'quiz')}
                                        />
                                    )}
                                    {section.assignments.map((ass) => (
                                        <SidebarItem
                                            key={ass.id}
                                            active={activeItem?.id === ass.id}
                                            icon={Code}
                                            title={ass.title}
                                            color="text-purple-600"
                                            onClick={() => handleItemClick(ass, 'assignment')}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function SidebarItem({ active, icon: Icon, title, onClick, color }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${active
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
        >
            <Icon size={16} className={`shrink-0 ${color || (active ? 'text-slate-900' : 'text-slate-400')}`} />
            <span className="text-sm line-clamp-1">{title}</span>
        </button>
    );
}