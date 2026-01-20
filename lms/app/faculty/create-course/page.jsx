"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    BookOpen, Code, Trash2, Plus, ChevronDown, ChevronUp,
    Save, CheckCircle, MonitorPlay, File, Loader2, Layout
} from 'lucide-react';

// --- CONSTANTS ---
const MAX_SECTIONS = 10;
const MAX_TOPICS_PER_SECTION = 15;
const COURSE_COLORS = [
    'bg-blue-600', 'bg-indigo-600', 'bg-purple-600',
    'bg-rose-600', 'bg-emerald-600', 'bg-orange-600'
];

export default function CourseEditorPage() {
    const router = useRouter();

    // --- STATE ---
    const [activeTab, setActiveTab] = useState('curriculum');
    const [isSaving, setIsSaving] = useState(false);

    // 1. Course Basics (Matches 'courses' table)
    const [basics, setBasics] = useState({
        title: 'Complete Data Structures & Algorithms',
        shortTitle: 'JAVA DSA',
        description: '',
        color: 'bg-blue-600'
    });

    // 2. Sections Data (Matches 'sections', 'topics', 'quizzes', 'assignments' tables)
    const [sections, setSections] = useState([
        {
            id: 1,
            title: 'Unit 1: Introduction',
            topics: [],
            quiz: {
                enabled: false,
                timeLimit: 30,
                retakes: 1,
                questions: []
            },
            assignments: []
        }
    ]);

    // --- HELPERS ---
    const getNextId = (arr) => arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1;

    // --- SECTION ACTIONS ---
    const addSection = () => {
        if (sections.length >= MAX_SECTIONS) return alert(`Max ${MAX_SECTIONS} units allowed.`);

        setSections([...sections, {
            id: getNextId(sections),
            title: `Unit ${sections.length + 1}: New Unit`,
            topics: [],
            quiz: { enabled: false, timeLimit: 30, retakes: 1, questions: [] },
            assignments: []
        }]);
    };

    const deleteSection = (id) => setSections(sections.filter(s => s.id !== id));

    const updateSectionTitle = (id, val) => {
        setSections(sections.map(s => s.id === id ? { ...s, title: val } : s));
    };

    // --- TOPIC ACTIONS ---
    const addTopic = (sectionId, type) => {
        setSections(sections.map(s => {
            if (s.id === sectionId) {
                if (s.topics.length >= MAX_TOPICS_PER_SECTION) return s;
                return {
                    ...s,
                    topics: [...s.topics, { id: Date.now(), title: '', type, url: '' }]
                };
            }
            return s;
        }));
    };

    const updateTopic = (sectionId, topicId, field, val) => {
        setSections(sections.map(s => {
            if (s.id === sectionId) {
                return {
                    ...s,
                    topics: s.topics.map(t => t.id === topicId ? { ...t, [field]: val } : t)
                };
            }
            return s;
        }));
    };

    // --- QUIZ & ASSIGNMENT UPDATERS ---
    const updateSectionQuiz = (sectionId, newQuizData) => {
        setSections(sections.map(s => s.id === sectionId ? { ...s, quiz: newQuizData } : s));
    };

    const updateSectionAssignments = (sectionId, newAssignments) => {
        setSections(sections.map(s => s.id === sectionId ? { ...s, assignments: newAssignments } : s));
    };

    // --- 🔥 API SAVE FUNCTION ---
    const handleSave = async () => {
        if (!basics.title || !basics.shortTitle) {
            alert("Please enter a Full Title and a Logo Text (Short Title).");
            return;
        }

        // 🔥 NEW: Get the logged-in Faculty ID
        const instructorId = localStorage.getItem('userId');

        // Optional safety check
        if (!instructorId) {
            alert("You appear to be logged out. Please log in again.");
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch('/api/courses/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    basics: basics,
                    sections: sections,
                    instructorId: instructorId // 🔥 SEND IT HERE
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert("✅ Course Published Successfully!");
                router.push('/faculty/dashboard'); // Redirect to dashboard
            } else {
                alert(`❌ Error: ${data.error || "Failed to save."}`);
            }
        } catch (error) {
            console.error("Save Error:", error);
            alert("❌ Network Error. Check console.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">

            {/* --- HEADER & SMART THUMBNAIL --- */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-6xl mx-auto p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* 1. THUMBNAIL CARD (Visual Editor) */}
                        <div className="group relative shrink-0 w-full lg:w-80 aspect-video rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
                            <div className={`absolute inset-0 ${basics.color} transition-colors duration-500`}></div>
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <div className="relative w-full">
                                    <input
                                        value={basics.shortTitle}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 15) setBasics({ ...basics, shortTitle: e.target.value.toUpperCase() })
                                        }}
                                        className="w-full bg-transparent text-center text-white font-black text-4xl uppercase tracking-tighter outline-none border-b-2 border-transparent focus:border-white/50 placeholder:text-white/30 transition-all"
                                        placeholder="LOGO TEXT"
                                    />
                                    <div className="text-[10px] font-bold text-white/60 mt-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        {basics.shortTitle.length} / 15 Chars
                                    </div>
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {COURSE_COLORS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setBasics({ ...basics, color: c })}
                                        className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${c} hover:scale-110 transition-transform`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 2. COURSE DETAILS FORM */}
                        <div className="flex-1 w-full space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Course Title</label>
                                <input
                                    value={basics.title}
                                    onChange={(e) => e.target.value.length <= 60 && setBasics({ ...basics, title: e.target.value })}
                                    className="w-full text-xl md:text-2xl font-bold text-slate-900 border-b border-slate-200 focus:border-blue-600 outline-none py-2 bg-transparent placeholder:text-slate-300"
                                    placeholder="e.g. Master React JS 2024"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Description</label>
                                <textarea
                                    value={basics.description}
                                    onChange={(e) => setBasics({ ...basics, description: e.target.value })}
                                    className="w-full text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-100 min-h-[120px] resize-none"
                                    placeholder="Briefly explain what students will learn..."
                                />
                            </div>
                        </div>

                        {/* 3. SAVE BUTTON */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} /> Save Course
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- CONTENT TABS --- */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">

                {/* Tab Buttons */}
                <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full md:w-fit mb-6 overflow-x-auto">
                    <TabButton id="curriculum" icon={BookOpen} label="Curriculum" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="quizzes" icon={CheckCircle} label="Quizzes" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton id="assignments" icon={Code} label="Assignments" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* Tab Content Areas */}
                <div className="space-y-6">

                    {/* 1. CURRICULUM EDITOR */}
                    {activeTab === 'curriculum' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            {sections.map((section, idx) => (
                                <div key={section.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
                                        <span className="font-mono text-xs font-bold text-slate-400">UNIT {idx + 1}</span>
                                        <input
                                            value={section.title}
                                            onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                            className="flex-1 font-bold text-slate-900 bg-transparent outline-none focus:bg-white px-2 rounded"
                                        />
                                        <button onClick={() => deleteSection(section.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        {section.topics.map((topic, tIdx) => (
                                            <div key={topic.id} className="flex items-center gap-3 pl-4 border-l-2 border-slate-100 group">
                                                {topic.type === 'video' ? <MonitorPlay size={16} className="text-blue-500 shrink-0" /> : <File size={16} className="text-orange-500 shrink-0" />}

                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    <input
                                                        placeholder="Topic Title (e.g. Introduction to React)"
                                                        value={topic.title}
                                                        onChange={(e) => updateTopic(section.id, topic.id, 'title', e.target.value)}
                                                        className="text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:border-blue-400 outline-none"
                                                    />
                                                    <input
                                                        placeholder={topic.type === 'video' ? "Video URL (YouTube/MP4)" : "File URL (PDF/Drive)"}
                                                        value={topic.url}
                                                        onChange={(e) => updateTopic(section.id, topic.id, 'url', e.target.value)}
                                                        className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:border-blue-400 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {section.topics.length < MAX_TOPICS_PER_SECTION ? (
                                            <div className="flex gap-2 mt-4 pt-2 border-t border-slate-50">
                                                <button onClick={() => addTopic(section.id, 'video')} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded"><Plus size={14} /> Add Video</button>
                                                <button onClick={() => addTopic(section.id, 'pdf')} className="text-xs font-bold text-orange-600 flex items-center gap-1 hover:bg-orange-50 px-3 py-1.5 rounded"><Plus size={14} /> Add Resource</button>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-red-500 text-center py-2 bg-red-50 rounded">Max topics reached.</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button onClick={addSection} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 transition-colors">
                                + Add New Unit
                            </button>
                        </div>
                    )}

                    {/* 2. QUIZ EDITOR */}
                    {activeTab === 'quizzes' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            {sections.map((section) => (
                                <QuizEditor key={section.id} section={section} onUpdate={(data) => updateSectionQuiz(section.id, data)} />
                            ))}
                        </div>
                    )}

                    {/* 3. ASSIGNMENT EDITOR */}
                    {activeTab === 'assignments' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            {sections.map((section) => (
                                <AssignmentEditor key={section.id} section={section} onUpdate={(data) => updateSectionAssignments(section.id, data)} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS (Keep logic separate) ---

function TabButton({ id, icon: Icon, label, activeTab, setActiveTab }) {
    return (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeTab === id
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
        >
            <Icon size={18} /> {label}
        </button>
    );
}

function QuizEditor({ section, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);

    const addQuestion = () => {
        const newQ = { id: Date.now(), text: '', marks: 1, options: ['', '', '', ''], correct: 0 };
        onUpdate({ ...section.quiz, questions: [...section.quiz.questions, newQ] });
    };

    const updateQuestion = (qId, field, val) => {
        const updatedQs = section.quiz.questions.map(q => q.id === qId ? { ...q, [field]: val } : q);
        onUpdate({ ...section.quiz, questions: updatedQs });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-700 font-bold text-xs">UNIT {section.id}</div>
                    <h3 className="font-bold text-slate-900">{section.title} - Quiz</h3>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </div>

            {isOpen && (
                <div className="p-6 border-t border-slate-100 space-y-6">
                    <div className="flex flex-wrap gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Time (Mins)</label>
                            <input type="number" value={section.quiz.timeLimit} onChange={(e) => onUpdate({ ...section.quiz, timeLimit: e.target.value })} className="w-20 p-1.5 rounded border border-slate-300 text-sm font-bold text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Retakes</label>
                            <select value={section.quiz.retakes} onChange={(e) => onUpdate({ ...section.quiz, retakes: e.target.value })} className="p-1.5 rounded border border-slate-300 text-sm text-slate-900 font-bold">
                                <option value={1}>1 Attempt</option>
                                <option value={3}>3 Attempts</option>
                                <option value={999}>Unlimited</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {section.quiz.questions.map((q, idx) => (
                            <div key={q.id} className="border border-slate-200 rounded-lg p-4 relative bg-slate-50/50">
                                <button onClick={() => onUpdate({ ...section.quiz, questions: section.quiz.questions.filter(qi => qi.id !== q.id) })} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                <div className="flex gap-4 mb-3">
                                    <span className="text-slate-400 font-bold mt-1">Q{idx + 1}</span>
                                    <input className="flex-1 font-medium text-slate-900 bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none pb-1" placeholder="Question Text..." value={q.text} onChange={(e) => updateQuestion(q.id, 'text', e.target.value)} />
                                    <input className="w-12 text-center text-sm border rounded text-slate-900 font-bold" value={q.marks} onChange={(e) => updateQuestion(q.id, 'marks', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-8">
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex items-center gap-2">
                                            <input type="radio" name={`q-${q.id}`} checked={q.correct === oIdx} onChange={() => updateQuestion(q.id, 'correct', oIdx)} className="accent-blue-600 w-4 h-4" />
                                            <input className="flex-1 text-sm bg-white border border-slate-200 rounded px-2 py-1.5 text-slate-900" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => { const newOpts = [...q.options]; newOpts[oIdx] = e.target.value; updateQuestion(q.id, 'options', newOpts); }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addQuestion} className="w-full py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50">+ Add MCQ Question</button>
                </div>
            )}
        </div>
    );
}

function AssignmentEditor({ section, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);

    const addAssignment = (type) => {
        onUpdate([...section.assignments, { id: Date.now(), title: 'New Problem', type: type, problem: '', marks: 10, testCases: [{ input: '', output: '' }] }]);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-700 font-bold text-xs">UNIT {section.id}</div>
                    <h3 className="font-bold text-slate-900">{section.title} - Assignments</h3>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </div>

            {isOpen && (
                <div className="p-6 border-t border-slate-100 space-y-6">
                    {section.assignments.map((ass) => (
                        <div key={ass.id} className="border border-purple-100 bg-purple-50/20 rounded-lg p-5">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded">{ass.type} Challenge</span>
                                <button onClick={() => onUpdate(section.assignments.filter(a => a.id !== ass.id))} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                            <div className="space-y-4">
                                <input className="w-full font-bold text-lg bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400" placeholder="Assignment Title" value={ass.title} onChange={(e) => onUpdate(section.assignments.map(a => a.id === ass.id ? { ...a, title: e.target.value } : a))} />
                                <textarea className="w-full text-sm bg-white border border-purple-200 rounded p-3 text-slate-900 outline-none focus:ring-2 focus:ring-purple-200" rows="3" placeholder="Problem Statement..." value={ass.problem} onChange={(e) => onUpdate(section.assignments.map(a => a.id === ass.id ? { ...a, problem: e.target.value } : a))} />

                                {ass.type === 'coding' && (
                                    <div className="bg-white p-4 rounded border border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase">Test Cases</h4>
                                        {ass.testCases.map((tc, tcIdx) => (
                                            <div key={tcIdx} className="flex gap-2 mb-2">
                                                <input placeholder="Input" className="flex-1 text-xs font-mono bg-slate-50 border border-slate-200 p-2 rounded text-slate-900" value={tc.input} onChange={(e) => { const newTC = [...ass.testCases]; newTC[tcIdx].input = e.target.value; onUpdate(section.assignments.map(a => a.id === ass.id ? { ...a, testCases: newTC } : a)); }} />
                                                <input placeholder="Output" className="flex-1 text-xs font-mono bg-slate-50 border border-slate-200 p-2 rounded text-slate-900" value={tc.output} onChange={(e) => { const newTC = [...ass.testCases]; newTC[tcIdx].output = e.target.value; onUpdate(section.assignments.map(a => a.id === ass.id ? { ...a, testCases: newTC } : a)); }} />
                                            </div>
                                        ))}
                                        <button onClick={() => { const newTC = [...ass.testCases, { input: '', output: '' }]; onUpdate(section.assignments.map(a => a.id === ass.id ? { ...a, testCases: newTC } : a)); }} className="text-xs text-purple-600 font-bold hover:underline">+ Add Test Case</button>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-600">Total Marks:</span>
                                    <input type="number" className="w-16 p-1 border border-slate-300 rounded text-slate-900 font-bold" value={ass.marks} onChange={(e) => onUpdate(section.assignments.map(a => a.id === ass.id ? { ...a, marks: e.target.value } : a))} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex gap-2">
                        <button onClick={() => addAssignment('coding')} className="flex-1 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800">+ Add Coding Problem</button>
                        <button onClick={() => addAssignment('theory')} className="flex-1 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50">+ Add Theory/File</button>
                    </div>
                </div>
            )}
        </div>
    );
}