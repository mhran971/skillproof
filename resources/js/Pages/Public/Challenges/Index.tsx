import PublicLayout from '@/Components/Layout/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Filter, Trophy, Clock, Users, Building2, 
  ChevronDown, X, SlidersHorizontal, ArrowRight, Star 
} from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Skill {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
}

interface Challenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty_level: string;
  difficulty_label: string;
  difficulty_color: string;
  duration_hours: number | null;
  deadline: string | null;
  deadline_human: string | null;
  max_participants: number | null;
  reward_description: string | null;
  company: Company;
  required_skills: Skill[];
  submissions_count: number;
}

interface Props {
  challenges: {
    data: Challenge[];
    links: any[];
    meta: { current_page: number; last_page: number; total: number };
  };
  filters: { search?: string; difficulty?: string; skills?: string[]; company?: string; sort?: string };
  difficultyLevels: string[];
  allSkills: Skill[];
}

export default function Index({ challenges, filters, difficultyLevels, allSkills }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(filters.search || '');
  const [difficulty, setDifficulty] = useState(filters.difficulty || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    filters.skills ? (Array.isArray(filters.skills) ? filters.skills : [filters.skills]) : []
  );
  const [sort, setSort] = useState(filters.sort || 'latest');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get('/challenges', {
      search,
      difficulty,
      skills: selectedSkills.length > 0 ? selectedSkills : undefined,
      sort,
    }, { preserveState: true });
  };

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setDifficulty('');
    setSelectedSkills([]);
    setSort('latest');
    router.get('/challenges', {}, { preserveState: true });
  };

  const hasActiveFilters = search || difficulty || selectedSkills.length > 0 || sort !== 'latest';

  const getDifficultyBadge = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-700 border-green-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      red: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[color] || 'bg-gray-100 text-gray-700';
  };

  return (
    <PublicLayout>
      <Head title={t('public.challenges')} />

      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('public.challenges_title')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('public.challenges_subtitle')}</p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('public.search_challenges')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${showFilters ? 'border-indigo-500 text-indigo-600 bg-indigo-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <SlidersHorizontal size={16} />
              {t('public.filters')}
              {selectedSkills.length > 0 && (
                <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center">
                  {selectedSkills.length}
                </span>
              )}
            </button>
            
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setTimeout(applyFilters, 0); }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="latest">{t('public.sort_latest')}</option>
              <option value="popular">{t('public.sort_popular')}</option>
              <option value="deadline">{t('public.sort_deadline')}</option>
            </select>

            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              {t('common.search')}
            </button>
          </div>
        </form>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Difficulty */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{t('public.difficulty')}</p>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(difficulty === level ? '' : level)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      difficulty === level
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t(`company.difficulty_${level}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">{t('public.skills')}</p>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(String(skill.id))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      selectedSkills.includes(String(skill.id))
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                {t('common.apply')}
              </button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">{t('public.active_filters')}:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                {search} <button onClick={() => { setSearch(''); applyFilters(); }}><X size={12} /></button>
              </span>
            )}
            {difficulty && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                {t(`company.difficulty_${difficulty}`)} <button onClick={() => { setDifficulty(''); applyFilters(); }}><X size={12} /></button>
              </span>
            )}
            {selectedSkills.map((skillId) => {
              const skill = allSkills.find(s => String(s.id) === skillId);
              return skill ? (
                <span key={skillId} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                  {skill.name} <button onClick={() => { toggleSkill(skillId); applyFilters(); }}><X size={12} /></button>
                </span>
              ) : null;
            })}
            <button onClick={clearFilters} className="text-xs text-red-600 hover:underline ml-auto">
              {t('common.clear_all')}
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4">
        {t('public.showing_results', { count: challenges.meta.total })}
      </p>

      {/* Challenges Grid */}
      {challenges.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.data.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.slug}`}
              className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {challenge.company.logo ? (
                      <img src={challenge.company.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Building2 size={20} className="text-indigo-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{challenge.company.name}</p>
                      <p className="text-xs text-gray-500">{t('public.company')}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyBadge(challenge.difficulty_color)}`}>
                    {challenge.difficulty_label}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{challenge.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {challenge.duration_hours && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {challenge.duration_hours}h
                    </span>
                  )}
                  {challenge.deadline_human && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} className="text-orange-500" />
                      {challenge.deadline_human}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {challenge.submissions_count}
                  </span>
                </div>

                {/* Skills */}
                {challenge.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.required_skills.slice(0, 4).map((skill) => (
                      <span key={skill.id} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                        {skill.name}
                      </span>
                    ))}
                    {challenge.required_skills.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{challenge.required_skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Reward */}
                {challenge.reward_description && (
                  <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-amber-600">
                    <Trophy size={16} />
                    <span className="font-medium">{challenge.reward_description}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Trophy size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('public.no_challenges')}</h3>
          <p className="text-gray-500 mb-6">{t('public.no_challenges_desc')}</p>
          <button onClick={clearFilters} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
            {t('public.clear_filters')}
          </button>
        </div>
      )}

      {/* Pagination */}
      {challenges.meta.last_page > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {challenges.links.map((link, idx) => (
            link.url ? (
              <Link
                key={idx}
                href={link.url}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  link.active
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
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