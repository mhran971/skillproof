import PublicLayout from '@/Components/Layout/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, MapPin, Globe, Users, Trophy, 
  ArrowLeft, Clock, Star, CheckCircle, ArrowRight 
} from 'lucide-react';

interface Skill {
  id: number;
  name: string;
}

interface Challenge {
  id: number;
  title: string;
  slug: string;
  difficulty_level: string;
  difficulty_label: string;
  deadline: string | null;
  required_skills: Skill[];
}

interface Company {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  industry: string | null;
  location: string | null;
  website: string | null;
  size: string | null;
  founded_year: number | null;
  challenges: Challenge[];
}

interface Props {
  company: Company;
  stats: {
    total_challenges: number;
    active_challenges: number;
    total_submissions: number;
    accepted_candidates: number;
  };
}

export default function Show({ company, stats }: Props) {
  const { t } = useTranslation();

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-700 border-green-200',
      intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
      advanced: 'bg-purple-100 text-purple-700 border-purple-200',
      expert: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  return (
    <PublicLayout>
      <Head title={`${company.name} - SkillProof`} />

      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link href="/companies" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft size={16} />
          {t('public.back_to_companies')}
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
                {company.logo ? (
                  <img src={company.logo} alt="" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Building2 size={32} className="text-indigo-600" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {company.industry && (
                    <span className="flex items-center gap-1">
                      <Building2 size={14} />
                      {company.industry}
                    </span>
                  )}
                  {company.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {company.location}
                    </span>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <Globe size={14} />
                      {t('public.visit_website')}
                    </a>
                  )}
                  {company.size && (
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {company.size}
                    </span>
                  )}
                  {company.founded_year && (
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {t('public.founded')} {company.founded_year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {company.description && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('public.about_company')}</h2>
                <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {company.description}
                </div>
              </div>
            )}

            {/* Active Challenges */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Trophy size={20} className="text-indigo-600" />
                  {t('public.active_challenges')}
                </h2>
                <span className="text-sm text-gray-500">{company.challenges.length} {t('public.showing')}</span>
              </div>

              {company.challenges.length > 0 ? (
                <div className="space-y-4">
                  {company.challenges.map((challenge) => (
                    <Link
                      key={challenge.id}
                      href={`/challenges/${challenge.slug}`}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {challenge.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty_level)}`}>
                            {challenge.difficulty_label}
                          </span>
                        </div>
                        {challenge.required_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {challenge.required_skills.map((skill) => (
                              <span key={skill.id} className="px-2 py-1 bg-white text-indigo-700 rounded text-xs font-medium border border-indigo-100">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy size={32} className="mx-auto mb-2 text-gray-300" />
                  <p>{t('public.no_active_challenges')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('public.statistics')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Trophy size={16} className="text-indigo-600" />
                    {t('public.total_challenges')}
                  </span>
                  <span className="font-bold text-gray-900">{stats.total_challenges}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock size={16} className="text-green-600" />
                    {t('public.active_challenges')}
                  </span>
                  <span className="font-bold text-gray-900">{stats.active_challenges}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Users size={16} className="text-blue-600" />
                    {t('public.total_submissions')}
                  </span>
                  <span className="font-bold text-gray-900">{stats.total_submissions}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <CheckCircle size={16} className="text-amber-500" />
                    {t('public.accepted_candidates')}
                  </span>
                  <span className="font-bold text-gray-900">{stats.accepted_candidates}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}