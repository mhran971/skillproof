import PublicLayout from '@/Components/Layout/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Calendar, Users, Award, Filter, X,
  SlidersHorizontal, Briefcase, Clock, Trophy
} from 'lucide-react';
import { useState } from 'react';

interface Skill {
  id: number;
  name: string;
}

interface Challenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty_level: string;
  deadline: string | null;
  max_participants: number | null;
  submissions_count: number;
  is_joined?: boolean;
  company: {
    id: number;
    name: string;
    logo: string | null;
  };
  required_skills: Skill[];
}

interface Props {
  challenges: {
    data: Challenge[];
    links: any[];
    meta: { current_page: number; last_page: number; total: number };
  };
  filters: { search?: string; difficulty?: string; skills?: string[]; sort?: string };
  difficultyLevels: string[];
  allSkills: Skill[];
}

export default function Index({ challenges = { data: [] }, filters = {}, difficultyLevels = [], allSkills = [] }: any) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    filters.skills ? (Array.isArray(filters.skills) ? filters.skills : [filters.skills]) : []
  );
  const [difficulty, setDifficulty] = useState(filters.difficulty || '');
  const [sort, setSort] = useState(filters.sort || 'latest');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = () => {
    router.get('/challenges', {
      search,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      difficulty,
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
    setDifficulty('');
    setSort('latest');
    router.get('/challenges', {}, { preserveState: true });
  };

  const hasActiveFilters = search || selectedSkills.length > 0 || difficulty || sort !== 'latest';

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-orange-100 text-orange-700';
      case 'expert': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <PublicLayout>
      <Head title={t('public.challenges')} />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('public.challenges_title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('public.challenges_subtitle')}</p>
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
              placeholder={t('public.search_challenges')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium ${showFilters ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              <SlidersHorizontal size={16} />
              {t('public.filters')}
              {(selectedSkills.length > 0 || difficulty) && <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center">{selectedSkills.length + (difficulty ? 1 : 0)}</span>}
            </button>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters, 0); }} className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500">
              <option value="latest">{t('public.sort_latest')}</option>
              <option value="popular">{t('public.sort_popular')}</option>
              <option value="deadline">{t('public.sort_deadline')}</option>
            </select>
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">{t('common.search')}</button>
          </div>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{t('public.difficulty')}</p>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map((lvl: string) => (
                  <button key={lvl} onClick={() => setDifficulty(difficulty === lvl ? '' : lvl)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${difficulty === lvl ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {t(`public.level_${lvl}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{t('public.skills')}</p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill: any) => (
                  <button key={skill.id} onClick={() => toggleSkill(String(skill.id))} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedSkills.includes(String(skill.id)) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                    {skill.name}
                  </button>
                ))}
              </div>
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
            {difficulty && <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">{t(`public.level_${difficulty}`)} <button onClick={() => { setDifficulty(''); applyFilters(); }}><X size={12} /></button></span>}
            {selectedSkills.map((id) => { const s = allSkills.find((sk: any) => String(sk.id) === id); return s ? <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">{s.name} <button onClick={() => { toggleSkill(id); applyFilters(); }}><X size={12} /></button></span> : null; })}
            <button onClick={clearFilters} className="text-xs text-red-600 hover:underline ml-auto">{t('common.clear_all')}</button>
          </div>
        )}
      </div>

      {/* Grid */}
      {challenges.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.data.map((challenge: any) => (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.slug}`}
              className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-50 border flex items-center justify-center p-2">
                    {challenge.company.logo ? (
                      <img src={challenge.company.logo} alt={challenge.company.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Briefcase size={24} className="text-gray-400" />
                    )}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getDifficultyColor(challenge.difficulty_level)}`}>
                    {t(`public.level_${challenge.difficulty_level}`)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {challenge.required_skills?.slice(0, 3).map((skill: any) => (
                    <span key={skill.id} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {skill.name}
                    </span>
                  ))}
                  {challenge.required_skills?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded text-xs">+{challenge.required_skills.length - 3}</span>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Users size={16} />
                    {challenge.submissions_count}
                  </span>
                  {challenge.deadline && (
                    <span className="flex items-center gap-1.5 text-red-600">
                      <Clock size={16} />
                      {challenge.deadline}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 font-medium text-indigo-600">
                  {t('public.view_details')}
                  <Trophy size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Trophy size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('public.no_challenges')}</h3>
          <button onClick={clearFilters} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{t('public.clear_filters')}</button>
        </div>
      )}

      {/* Pagination */}
      {challenges.meta && challenges.meta.last_page > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {challenges.links.map((link: any, idx: number) => (
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