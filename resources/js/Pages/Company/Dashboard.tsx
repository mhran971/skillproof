import CompanyLayout from '@/Components/Layout/CompanyLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, FileText, Clock, CheckCircle, Star, 
  TrendingUp, AlertCircle, Eye, ArrowRight, Users 
} from 'lucide-react';

interface Stats {
  total_challenges: number;
  published_challenges: number;
  total_submissions: number;
  pending_review: number;
  under_review: number;
  accepted_count: number;
  average_score: number;
}

interface RecentSubmission {
  id: number;
  title: string;
  candidate_name: string;
  candidate_avatar: string | null;
  challenge_title: string;
  challenge_slug: string;
  status: string;
  status_label: string;
  submitted_at: string | null;
}

interface TopChallenge {
  id: number;
  title: string;
  slug: string;
  submissions_count: number;
  is_published: boolean;
}

interface Props {
  stats: Stats;
  recentSubmissions: RecentSubmission[];
  topChallenges: TopChallenge[];
  company: { id: number; name: string; logo: string | null };
}

export default function Dashboard({ stats, recentSubmissions, topChallenges, company }: Props) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      evaluated: 'bg-purple-100 text-purple-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const cards = [
    { label: t('company.stats.challenges'), value: stats.total_challenges, icon: Trophy, color: 'bg-indigo-500' },
    { label: t('company.stats.submissions'), value: stats.total_submissions, icon: FileText, color: 'bg-blue-500' },
    { label: t('company.stats.pending'), value: stats.pending_review, icon: Clock, color: 'bg-yellow-500' },
    { label: t('company.stats.accepted'), value: stats.accepted_count, icon: CheckCircle, color: 'bg-green-500' },
  ];

  return (
    <CompanyLayout>
      <Head title={t('company.dashboard')} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('company.dashboard')}</h1>
        <p className="text-gray-500 mt-2">{t('company.welcome_back', { name: company.name })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold mt-2">{card.value.toLocaleString()}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={20} className="text-indigo-600" />
              {t('company.recent_submissions')}
            </h2>
            <Link href="/company/submissions" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              {t('common.view_all')} <ArrowRight size={16} />
            </Link>
          </div>
          {recentSubmissions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 overflow-hidden">
                    {sub.candidate_avatar ? (
                      <img src={sub.candidate_avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      sub.candidate_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{sub.candidate_name}</p>
                    <p className="text-sm text-gray-500 truncate">{sub.challenge_title}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                    {sub.status_label}
                  </span>
                  <Link href={`/company/submissions/${sub.id}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    {t('common.view')}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
              <p>{t('company.no_submissions_yet')}</p>
            </div>
          )}
        </div>

        {/* Top Challenges & Quick Actions */}
        <div className="space-y-6">
          {/* Top Challenges */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600" />
              {t('company.top_challenges')}
            </h2>
            {topChallenges.length > 0 ? (
              <div className="space-y-3">
                {topChallenges.map((ch) => (
                  <div key={ch.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">{ch.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${ch.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {ch.is_published ? t('company.published') : t('company.draft')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users size={14} />
                      {ch.submissions_count}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">{t('company.no_challenges')}</p>
            )}
            <Link href="/company/challenges" className="block w-full mt-4 text-center py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
              {t('company.manage_challenges')}
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">{t('company.quick_actions')}</h2>
            <div className="space-y-3">
              <Link href="/company/challenges/create" className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium">
                <Trophy size={18} />
                {t('company.create_challenge')}
              </Link>
              <Link href="/company/submissions" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors font-medium">
                <Eye size={18} />
                {t('company.review_submissions')}
              </Link>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star size={20} className="text-yellow-500" />
              {t('company.avg_score')}
            </h2>
            <div className="text-center py-2">
              <p className="text-4xl font-bold text-gray-900">{stats.average_score > 0 ? stats.average_score : '-'}</p>
              <p className="text-sm text-gray-500 mt-1">{t('company.across_all_evaluations')}</p>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}