import PublicLayout from '@/Components/Layout/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Building2, MapPin, Trophy, Users, 
  SlidersHorizontal, X, ArrowRight 
} from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Company {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  industry: string | null;
  location: string | null;
  challenges_count: number;
}

interface Props {
  companies: {
    data: Company[];
    links: any[];
    meta: { current_page: number; last_page: number; total: number };
  };
  filters: { search?: string; industry?: string };
  industries: string[];
}

export default function Index({ companies, filters, industries }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [industry, setIndustry] = useState(filters.industry || '');

  const applyFilters = () => {
    router.get('/companies', {
      search,
      industry: industry || undefined,
    }, { preserveState: true });
  };

  const clearFilters = () => {
    setSearch('');
    setIndustry('');
    router.get('/companies', {}, { preserveState: true });
  };

  const hasActiveFilters = search || industry;

  return (
    <PublicLayout>
      <Head title={t('public.companies')} />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('public.companies_title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('public.companies_subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); applyFilters(); }} className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('public.search_companies')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={industry}
              onChange={(e) => { setIndustry(e.target.value); setTimeout(applyFilters, 0); }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
            >
              <option value="">{t('public.all_industries')}</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              {t('common.search')}
            </button>
          </div>
        </form>

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">{t('public.active_filters')}:</span>
            {search && <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">{search} <button onClick={() => { setSearch(''); applyFilters(); }}><X size={12} /></button></span>}
            {industry && <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">{industry} <button onClick={() => { setIndustry(''); applyFilters(); }}><X size={12} /></button></span>}
            <button onClick={clearFilters} className="text-xs text-red-600 hover:underline ml-auto">{t('common.clear_all')}</button>
          </div>
        )}
      </div>

      {/* Grid */}
      {companies.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.data.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.slug}`}
              className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {company.logo ? (
                    <img src={company.logo} alt="" className="w-14 h-14 rounded-xl object-cover border" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center border">
                      <Building2 size={24} className="text-indigo-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {company.name}
                    </h3>
                    {company.industry && (
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    )}
                  </div>
                </div>

                {company.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{company.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {company.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {company.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Trophy size={14} />
                    {company.challenges_count} {t('public.challenges')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
                    {t('public.view_profile')}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Building2 size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('public.no_companies')}</h3>
          <button onClick={clearFilters} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
            {t('public.clear_filters')}
          </button>
        </div>
      )}

      {/* Pagination */}
      {companies.meta.last_page > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {companies.links.map((link, idx) => (
            link.url ? (
              <Link
                key={idx}
                href={link.url}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ) : (
              <span key={idx} className="px-4 py-2 text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: link.label }} />
            )
          ))}
        </div>
      )}
    </PublicLayout>
  );
}