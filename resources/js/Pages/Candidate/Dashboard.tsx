import { Head } from '@inertiajs/react';
import { AppLayout } from '@/Layouts/AppLayout';

interface DashboardProps {
    stats: {
        profile_completion: number;
        reputation_score: number;
        job_readiness_score: number;
        total_submissions: number;
        accepted_submissions: number;
        pending_applications: number;
    };
    recentSubmissions: Array<{
        id: number;
        challenge_title: string;
        status: string;
        final_score: number | null;
        submitted_at: string;
    }>;
}

export default function CandidateDashboard({ stats, recentSubmissions }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Candidate Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome Back!</h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <p className="text-sm text-gray-600 mb-2">Profile Completion</p>
                            <div className="flex items-center">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: `${stats.profile_completion}%` }}
                                    />
                                </div>
                                <span className="text-lg font-bold">{stats.profile_completion}%</span>
                            </div>
                        </div>

                        <StatCard title="Reputation Score" value={stats.reputation_score} />
                        <StatCard title="Job Readiness" value={`${stats.job_readiness_score}%`} />
                        <StatCard title="Total Submissions" value={stats.total_submissions} />
                        <StatCard title="Accepted" value={stats.accepted_submissions} />
                        <StatCard title="Pending Applications" value={stats.pending_applications} />
                    </div>

                    {/* Recent Submissions */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Submissions</h2>
                        {recentSubmissions.length > 0 ? (
                            <div className="space-y-3">
                                {recentSubmissions.map((sub) => (
                                    <div key={sub.id} className="flex items-center justify-between py-2 border-b">
                                        <div>
                                            <p className="font-medium">{sub.challenge_title}</p>
                                            <p className="text-sm text-gray-500">
                                                Submitted: {new Date(sub.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {sub.final_score && (
                                                <span className="text-sm font-medium">{sub.final_score}/100</span>
                                            )}
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                sub.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    sub.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        sub.status === 'evaluated' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No submissions yet. Start with a challenge!</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
