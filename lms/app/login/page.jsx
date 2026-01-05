"use client";

import React, { useState } from 'react';
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    // --- STATE ---
    const [formData, setFormData] = useState({ id: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // --- HANDLERS ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // CALL REAL API
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: formData.id,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                // Show error from backend (e.g., "Invalid credentials")
                setError(data.error || "Login failed");
                setIsLoading(false);
                return;
            }

            // SUCCESS: Redirect based on Role from DB
            const role = data.role; // 'admin', 'student', or 'faculty'
            console.log(`Login Success! Role: ${role}`);

            if (role === 'admin') {
                router.push('/admin/dashboard');
            } else if (role === 'student') {
                router.push('/student/dashboard');
            } else {
                router.push('/faculty/dashboard');
            }

        } catch (err) {
            console.error("Login Network Error:", err);
            setError("Network error. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">

            {/* LEFT SIDE: BRANDING (Professional & Static) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">

                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px]"></div>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight text-white">TPRCS <span className="text-blue-400">LMS</span></h1>
                    <p className="mt-2 text-slate-400 text-sm tracking-wide uppercase">Official Digital Campus</p>
                </div>

                {/* Central Text */}
                <div className="relative z-10 space-y-6">
                    <h2 className="text-5xl font-bold leading-tight">
                        One Portal,<br />
                        <span className="text-blue-400">Endless Possibilities.</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                        Seamlessly access your curriculum, track real-time progress, and manage academic records securely.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700`}></div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-300">Used by 1,200+ Students & Faculty</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-xs text-slate-600 flex justify-between items-center w-full">
                    <span>© 2025 TPRCS Education.</span>
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:text-white">Help</span>
                        <span className="cursor-pointer hover:text-white">Privacy</span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: LOGIN FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="mt-2 text-slate-500">Please enter your credentials to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 mt-8">

                        {/* ID Input */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-slate-700">User ID</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-400"
                                    placeholder="Roll Number, Employee ID or 'admin'"
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-slate-700">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="flex justify-end pt-1">
                                <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                        </div>

                        {/* Error Message Area (Hidden by default) */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-lg shadow-slate-900/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Secure Badge */}
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs mt-8">
                        <ShieldCheck size={14} />
                        <span>256-bit SSL Encrypted Connection</span>
                    </div>

                </div>
            </div>
        </div>
    );
}