import { Head } from '@inertiajs/react';
import AdminLayout from '@/Components/Layout/AdminLayout';


interface DashboardProps {
    stats: {
        total_users: number;
        total_candidates: number;
        total_companies: number;
        total_challenges: number;
        total_jobs: number;
        pending_submissions: number;
        pending_evaluations: number;
        fraud_alerts: number;
        new_users_today: number;
        new_users_this_week: number;
    };
    recentUsers: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        is_active: boolean;
        created_at: string;
    }>;
    recentSubmissions: Array<{
        id: number;
        challenge_title: string;
        candidate_name: string;
        status: string;
        submitted_at: string;
    }>;
}

export default function AdminDashboard({ stats, recentUsers, recentSubmissions }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard title="Total Users" value={stats.total_users} color="blue" />
                        <StatCard title="Candidates" value={stats.total_candidates} color="green" />
                        <StatCard title="Companies" value={stats.total_companies} color="purple" />
                        <StatCard title="Challenges" value={stats.total_challenges} color="orange" />
                        <StatCard title="Pending Submissions" value={stats.pending_submissions} color="red" />
                        <StatCard title="Pending Evaluations" value={stats.pending_evaluations} color="yellow" />
                        <StatCard title="Fraud Alerts" value={stats.fraud_alerts} color="red" />
                        <StatCard title="New Today" value={stats.new_users_today} color="indigo" />
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
                            <div className="space-y-3">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between py-2 border-b">
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'candidate' ? 'bg-green-100 text-green-800' :
                                                    user.role === 'company' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-blue-100 text-blue-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
                            <div className="space-y-3">
                                {recentSubmissions.map((sub) => (
                                    <div key={sub.id} className="flex items-center justify-between py-2 border-b">
                                        <div>
                                            <p className="font-medium">{sub.challenge_title}</p>
                                            <p className="text-sm text-gray-500">by {sub.candidate_name}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            sub.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    sub.status === 'evaluated' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
    const colors: Record<string, string> = {
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-green-50 border-green-200',
        purple: 'bg-purple-50 border-purple-200',
        orange: 'bg-orange-50 border-orange-200',
        red: 'bg-red-50 border-red-200',
        yellow: 'bg-yellow-50 border-yellow-200',
        indigo: 'bg-indigo-50 border-indigo-200',
    };

    return (
        <div className={`${colors[color] || colors.blue} border rounded-lg p-4`}>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
