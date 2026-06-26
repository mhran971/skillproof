import PublicLayout from '@/Components/Layout/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Search, MapPin, Star, Award, Filter, X, 
  SlidersHorizontal, Briefcase, CheckCircle 
} from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Skill {
  id: number;
  name: string;
}

interface Candidate {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  headline: string | null;
  location: string | null;
  experience_level: string | null;
  experience_label: string;
  is_available: boolean;
  reputation_score: number;
  profile_completion: number;
  skills: Skill[];
  joined_at: string;
}

interface Props {
  candidates: {
    data: Candidate[];
    links: any[];
    meta: { current_page: number; last_page: number; total: number };
  };
  filters: { search?: string; skills?: string[]; level?: string; available?: boolean; sort?: string };
  allSkills: Skill[];
  experienceLevels: string[];
}

export default function Index({ candidates, filters, allSkills, experienceLevels }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    filters.skills ? (Array.isArray(filters.skills) ? filters.skills : [filters.skills]) : []
  );
  const [level, setLevel] = useState(filters.level || '');
  const [availableOnly, setAvailableOnly] = useState(filters.available || false);
  const [sort, setSort] = useState(filters.sort || 'reputation');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    router.get('/candidates', {
      search,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      level,
      available: availableOnly || undefined,
      sort,
    }, { preserveState: true });
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSkills([]);
    setLevel('');
    setAvailableOnly(false);
    setSort('reputation');
    router.get('/candidates', {}, { preserveState: true });
  };

  const hasActiveFilters = search || selectedSkills.length > 0 || level || availableOnly || sort !== 'reputation';

  return (
    <PublicLayout>
      <Head title={t('public.candidates')} />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('public.candidates_title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('public.candidates_subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
        <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('public.search_candidates')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium ${showFilters ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              <SlidersHorizontal size={16} />
              {t('public.filters')}
              {(selectedSkills.length > 0 || level) && <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center">{selectedSkills.length + (level ? 1 : 0)}</span>}
            </button>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters, 0); }} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500">
              <option value="reputation">{t('public.sort_reputation')}</option>
              <option value="newest">{t('public.sort_newest')}</option>
              <option value="name">{t('public.sort_name')}</option>
            </select>
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{t('common.search')}</button>
          </div>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{t('public.experience_level')}</p>
              <div className="flex flex-wrap gap-2">
                {experienceLevels.map((lvl) => (
                  <button key={lvl} onClick={() => setLevel(level === lvl ? '' : lvl)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${level === lvl ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {t(`public.level_${lvl}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{t('public.skills')}</p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <button key={skill.id} onClick={() => toggleSkill(String(skill.id))} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedSkills.includes(String(skill.id)) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="available" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <label htmlFor="available" className="text-sm text-gray-700">{t('public.available_only')}</label>
            </div>
            <div className="flex justify-end">
              <button onClick={applyFilters} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{t('common.apply')}</button>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">{t('public.active_filters')}:</span>
            {search && <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">{search} <button onClick={() => { setSearch(''); applyFilters(); }}><X size={12} /></button></span>}
            {level && <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">{t(`public.level_${level}`)} <button onClick={() => { setLevel(''); applyFilters(); }}><X size={12} /></button></span>}
            {selectedSkills.map((id) => { const s = allSkills.find(sk => String(sk.id) === id); return s ? <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">{s.name} <button onClick={() => { toggleSkill(id); applyFilters(); }}><X size={12} /></button></span> : null; })}
            {availableOnly && <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">{t('public.available')} <button onClick={() => { setAvailableOnly(false); applyFilters(); }}><X size={12} /></button></span>}
            <button onClick={clearFilters} className="text-xs text-red-600 hover:underline ml-auto">{t('common.clear_all')}</button>
          </div>
        )}
      </div>

      {/* Grid */}
      {candidates.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {candidates.data.map((candidate) => (
            <Link
              key={candidate.id}
              href={`/candidates/${candidate.username}`}
              className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600 overflow-hidden">
                    {candidate.avatar ? (
                      <img src={candidate.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      candidate.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{candidate.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{candidate.headline || t('public.no_headline')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Star size={14} className="fill-yellow-500" />
                    <span className="font-bold">{candidate.reputation_score}</span>
                  </span>
                  {candidate.location && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin size={14} />
                      {candidate.location}
                    </span>
                  )}
                  {candidate.is_available && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={14} />
                      {t('public.available')}
                    </span>
                  )}
                </div>

                {candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {candidate.skills.slice(0, 4).map((skill) => (
                      <span key={skill.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                        {skill.name}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">+{candidate.skills.length - 4}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t text-xs text-gray-500">
                  <span>{candidate.experience_label}</span>
                  <span>{t('public.joined')} {candidate.joined_at}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Users size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('public.no_candidates')}</h3>
          <button onClick={clearFilters} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{t('public.clear_filters')}</button>
        </div>
      )}

      {/* Pagination */}
      {candidates.meta.last_page > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {candidates.links.map((link, idx) => (
            link.url ? (
              <Link key={idx} href={link.url} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
            ) : (
              <span key={idx} className="px-4 py-2 text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: link.label }} />
            )
          ))}
        </div>
      )}
    </PublicLayout>
  );
}