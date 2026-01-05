"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
    Users, Search, Filter, Plus, Upload,
    Trash2, CheckCircle, X, Loader2
} from 'lucide-react';

export default function UserManagementPage() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('student');
    const [filterBranch, setFilterBranch] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef(null);

    // REAL DATA STATE
    const [users, setUsers] = useState([]); // Empty initially
    const [isLoading, setIsLoading] = useState(true);

    const [newUser, setNewUser] = useState({ name: '', userId: '', branch: 'CSE' });

    // --- FETCH USERS ON LOAD ---
    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            alert("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    }

    // --- FILTER LOGIC ---
    const filteredUsers = users.filter(user => {
        const matchesRole = user.role === activeTab;
        const matchesBranch = filterBranch === 'ALL' || user.branch === filterBranch;
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.user_id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesBranch && matchesSearch;
    });

    // --- HANDLERS ---

    // 1. Manual Add (Saves to DB)
    const handleManualAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newUser, role: activeTab })
            });

            if (res.ok) {
                const createdUser = await res.json();
                setUsers([createdUser, ...users]); // Add to local list instantly
                setIsModalOpen(false);
                setNewUser({ name: '', userId: '', branch: 'CSE' });
                alert("User Added Successfully!");
            } else {
                alert("Error: User ID might already exist.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 2. Delete User (Removes from DB)
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            setUsers(users.filter(u => u.id !== id)); // Remove locally
        } catch (err) {
            alert("Failed to delete");
        }
    };

    // 3. Bulk Upload (Loops through Excel and calls API)

    // 3. Bulk Upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                if (data.length === 0) {
                    alert("The Excel sheet seems empty or lacks headers.");
                    return;
                }

                alert(`Found ${data.length} records. Uploading...`);

                let successCount = 0;
                let failCount = 0;

                for (const row of data) {
                    // Normalize keys (handle mixed case headers like 'password', 'Password')
                    const normalizedRow = Object.keys(row).reduce((acc, key) => {
                        acc[key.toLowerCase()] = row[key];
                        return acc;
                    }, {});

                    // Robust ID check
                    const id = normalizedRow.rollno || normalizedRow['roll no'] || normalizedRow.empid || normalizedRow.id;

                    if (!id) continue;

                    const userData = {
                        userId: String(id),
                        name: row.Name || row.name || "Unknown",
                        branch: row.Branch || row.branch || 'CSE',

                        // 🔥 READ PASSWORD FROM EXCEL (Look for 'Password' or 'password')
                        password: row.Password || row.password || "",

                        role: activeTab
                    };

                    const res = await fetch('/api/admin/users', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });

                    if (res.ok) successCount++;
                    else failCount++;
                }

                alert(`Process Complete!\n✅ Success: ${successCount}\n❌ Failed: ${failCount}`);
                fetchUsers();

            } catch (error) {
                console.error("Upload Logic Error:", error);
                alert("Critical Error processing file.");
            }
        };

        reader.readAsBinaryString(file);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 font-sans">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage authentic users from Database.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800">
                        <Plus size={18} /> Add Manually
                    </button>
                    <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
                        <Upload size={18} /> Bulk Upload
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx, .csv" />
                </div>
            </div>

            {/* CONTROLS */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('student')} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Students</button>
                    <button onClick={() => setActiveTab('faculty')} className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'faculty' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}>Faculty</button>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none bg-white">
                            <option value="ALL">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                            <option value="CIVIL">CIVIL</option>
                        </select>
                    </div>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input placeholder={`Search ${activeTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                </div>
            </div>

            {/* DATA TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-48 text-slate-400 gap-2">
                        <Loader2 className="animate-spin" /> Loading Data...
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">ID / Roll No</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Branch</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700">{user.user_id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold border border-slate-200">{user.branch}</span></td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{user.role}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(user.id)} className="text-slate-400 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users size={32} className="opacity-20" />
                                            <p>No users found matching filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL (Manual Add) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">Add New {activeTab === 'student' ? 'Student' : 'Faculty'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleManualAdd} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">{activeTab === 'student' ? 'Roll Number' : 'Employee ID'}</label>
                                <input required value={newUser.userId} onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg outline-none font-mono text-sm" placeholder={activeTab === 'student' ? 'e.g. 218W1A0542' : 'e.g. EMP001'} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                                <input required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg outline-none text-sm" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Branch</label>
                                <select value={newUser.branch} onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })} className="w-full p-2 border border-slate-300 rounded-lg outline-none text-sm bg-white">
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                </select>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
                                    <CheckCircle size={18} /> Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}