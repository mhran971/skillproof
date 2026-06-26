import CompanyLayout from '@/Components/Layout/CompanyLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, Search, Filter, Eye, Star, Clock, 
  CheckCircle, XCircle, AlertCircle, ArrowRight 
} from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Submission {
  id: number;
  title: string;
  status: string;
  status_label: string;
  submitted_at: string | null;
  candidate: {
    name: string;
    email: string;
    avatar: string | null;
    headline: string | null;
  };
  challenge: {
    id: number;
    title: string;
  };
  overall_score: number | null;
}

interface ChallengeOption {
  id: number;
  title: string;
}

interface Props {
  submissions: {
    data: Submission[];
    links: any[];
    meta: { current_page: number; last_page: number; total: number };
  };
  filters: { challenge?: string; status?: string; search?: string };
  challenges: ChallengeOption[];
  statuses: string[];
}

export default function Index({ submissions, filters, challenges, statuses }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [challengeFilter, setChallengeFilter] = useState(filters.challenge || '');

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    router.get('/company/submissions', { challenge: challengeFilter, status: statusFilter, search }, { preserveState: true });
  };

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

  return (
    <CompanyLayout>
      <Head title={t('company.submissions')} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('company.submissions')}</h1>
        <p className="text-gray-500 mt-2">{t('company.submissions_desc')}</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleFilter} className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('company.search_candidates')} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
        </div>
        <div className="relative w-full lg:w-48">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={challengeFilter} onChange={(e) => setChallengeFilter(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm appearance-none bg-white">
            <option value="">{t('company.all_challenges')}</option>
            {challenges.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
          </select>
        </div>
        <div className="relative w-full lg:w-40">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm appearance-none bg-white">
            <option value="">{t('company.all_statuses')}</option>
            {statuses.map((s) => (<option key={s} value={s}>{s.replace('_', ' ')}</option>))}
          </select>
        </div>
        <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 w-full lg:w-auto">
          {t('common.filter')}
        </button>
        {(statusFilter || challengeFilter || search) && (
          <button type="button" onClick={() => { setStatusFilter(''); setChallengeFilter(''); setSearch(''); router.get('/company/submissions', {}, { preserveState: true }); }} className="text-sm text-gray-500 hover:text-gray-700 underline">
            {t('common.clear')}
          </button>
        )}
      </form>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {submissions.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('company.candidate')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('company.challenge')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('company.status')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('company.score')}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('company.submitted')}</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.data.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 overflow-hidden">
                          {sub.candidate.avatar ? (
                            <img src={sub.candidate.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            sub.candidate.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{sub.candidate.name}</p>
                          <p className="text-xs text-gray-500">{sub.candidate.headline || sub.candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{sub.challenge.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(sub.status)}`}>
                        {sub.status_label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {sub.overall_score !== null ? (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star size={14} className="fill-yellow-500" />
                          <span className="font-bold text-sm">{sub.overall_score}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/company/submissions/${sub.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                        <Eye size={14} /> {t('common.review')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('company.no_submissions')}</h3>
            <p className="text-gray-500">{t('company.no_submissions_desc')}</p>
          </div>
        )}

        {submissions.meta.last_page > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-500">{t('admin.showing')} {submissions.data.length} {t('admin.of')} {submissions.meta.total}</p>
            <div className="flex gap-2">
              {submissions.links.map((link, idx) => (
                link.url ? (
                  <Link key={idx} href={link.url} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                ) : (
                  <span key={idx} className="px-3 py-1.5 text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: link.label }} />
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </CompanyLayout>
  );
}