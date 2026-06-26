import CompanyLayout from '@/Components/Layout/CompanyLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, Plus, Search, Filter, Eye, Pencil, Trash2, 
  AlertCircle, CheckCircle, XCircle, MoreHorizontal, 
  ArrowRight, Clock, Users 
} from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Challenge {
  id: number;
  title: string;
  slug: string;
  difficulty_label: string;
  difficulty_level: string;
  is_published: boolean;
  deadline: string | null;
  created_at: string;
  submissions_count: number;
  required_skills: { id: number; name: string }[];
}

interface Props {
  challenges: {
    data: Challenge[];
    links: any[];
    meta: { current_page: number; last_page: number; total: number };
  };
  filters: { status?: string; search?: string };
}

export default function Index({ challenges, filters }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleFilter = (e: FormEvent) => {
    e.preventDefault();
    router.get('/company/challenges', { status: statusFilter, search }, { preserveState: true });
  };

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700',
      advanced: 'bg-purple-100 text-purple-700',
      expert: 'bg-red-100 text-red-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <CompanyLayout>
      <Head title={t('company.challenges')} />

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{t('company.confirm_delete')}</h3>
              <p className="text-sm text-gray-500 mt-2">{t('company.delete_warning')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                {t('common.cancel')}
              </button>
              <Link
                href={`/company/challenges/${deleteId}`}
                method="delete"
                as="button"
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                onSuccess={() => setDeleteId(null)}
              >
                {t('common.delete')}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('company.challenges')}</h1>
          <p className="text-gray-500 mt-2">{t('company.challenges_desc')}</p>
        </div>
        <Link
          href="/company/challenges/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          <Plus size={18} />
          {t('company.create_challenge')}
        </Link>
      </div>

      {/* Filters */}
      <form onSubmit={handleFilter} className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('company.search_challenges')}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm appearance-none bg-white"
          >
            <option value="">{t('company.all_statuses')}</option>
            <option value="published">{t('company.published')}</option>
            <option value="draft">{t('company.draft')}</option>
          </select>
        </div>
        <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 w-full sm:w-auto">
          {t('common.filter')}
        </button>
        {(statusFilter || search) && (
          <button
            type="button"
            onClick={() => { setStatusFilter(''); setSearch(''); router.get('/company/challenges', {}, { preserveState: true }); }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            {t('common.clear')}
          </button>
        )}
      </form>

      {/* Challenges Grid */}
      {challenges.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.data.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty_level)}`}>
                    {challenge.difficulty_label}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${challenge.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {challenge.is_published ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {challenge.is_published ? t('company.published') : t('company.draft')}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{challenge.title}</h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {challenge.submissions_count} {t('company.submissions')}
                  </span>
                  {challenge.deadline && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(challenge.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {challenge.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {challenge.required_skills.slice(0, 3).map((skill) => (
                      <span key={skill.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                        {skill.name}
                      </span>
                    ))}
                    {challenge.required_skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{challenge.required_skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t">
                  <Link
                    href={`/company/challenges/${challenge.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Pencil size={14} />
                    {t('common.edit')}
                  </Link>
                  <button
                    onClick={() => setDeleteId(challenge.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <Link
                    href={`/company/challenges/${challenge.id}`}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <Eye size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('company.no_challenges')}</h3>
          <p className="text-gray-500 mb-6">{t('company.no_challenges_desc')}</p>
          <Link
            href="/company/challenges/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            {t('company.create_first_challenge')}
          </Link>
        </div>
      )}

      {/* Pagination */}
      {challenges.meta.last_page > 1 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t('admin.showing')} {challenges.data.length} {t('admin.of')} {challenges.meta.total}
          </p>
          <div className="flex gap-2">
            {challenges.links.map((link, idx) => (
              link.url ? (
                <Link
                  key={idx}
                  href={link.url}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ) : (
                <span key={idx} className="px-3 py-1.5 text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: link.label }} />
              )
            ))}
          </div>
        </div>
      )}
    </CompanyLayout>
  );
}