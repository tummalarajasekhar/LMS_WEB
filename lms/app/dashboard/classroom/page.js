import { TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Welcome back, Kalyan! 👋</h1>
                    <p className="text-slate-500">Computer Science • Year 3 • Sem 2</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-slate-500">Global Rank</p>
                    <p className="text-2xl font-bold text-blue-600">#42</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<TrendingUp className="text-green-600" />}
                    title="Attendance"
                    value="85%"
                    sub="You are safe!"
                    color="bg-green-50"
                />
                <StatCard
                    icon={<Clock className="text-orange-600" />}
                    title="Hours Spent"
                    value="12h 30m"
                    sub="This week"
                    color="bg-orange-50"
                />
                <StatCard
                    icon={<CheckCircle className="text-blue-600" />}
                    title="Assignments"
                    value="12/15"
                    sub="3 Pending"
                    color="bg-blue-50"
                />
            </div>

            {/* Continue Learning Section */}
            <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Continue Learning</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex gap-6 items-center">
                    <div className="h-32 w-48 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                        {/* Thumbnail Placeholder */}
                        <span className="text-xs">React Basics Module</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold text-lg">Full Stack Web Development</h3>
                            <span className="text-sm text-blue-600 font-medium">65% Complete</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-4">Chapter 4: Understanding useEffect Hooks</p>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full w-[65%]"></div>
                        </div>
                        <button className="mt-4 px-6 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800">
                            Resume Learning
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatCard({ icon, title, value, sub, color }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${color}`}>
                {icon}
            </div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <div className="flex items-end gap-2">
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                <span className="text-xs text-slate-400 mb-1">{sub}</span>
            </div>
        </div>
    );
}