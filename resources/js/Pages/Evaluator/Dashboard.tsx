import { Head } from '@inertiajs/react';
import { AppLayout } from '@/Layouts/AppLayout';

interface DashboardProps {
    stats: {
        pending_reviews: number;
        my_reviews: number;
    };
}

export default function EvaluatorDashboard({ stats }: DashboardProps) {
    return (
        <AppLayout>
            <Head title="Evaluator Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Evaluator Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white shadow rounded-lg p-6">
                            <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.pending_reviews}</p>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6">
                            <p className="text-sm text-gray-600 mb-1">My Reviews</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.my_reviews}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
