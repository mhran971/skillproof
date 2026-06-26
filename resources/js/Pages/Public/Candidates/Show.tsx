import PublicLayout from '@/Components/Layout/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, Link as LinkIcon, Github, Linkedin, Star, 
  Award, Briefcase, Calendar, Trophy, Building2, 
  ArrowLeft, CheckCircle, Globe, Mail 
} from 'lucide-react';

interface Skill {
  id: number;
  name: string;
  category?: { id: number; name: string };
}

interface ChallengeSubmission {
  id: number;
  title: string;
  status: string;
  challenge: {
    id: number;
    title: string;
    slug: string;
    company: {
      id: number;
      name: string;
      logo: string | null;
    };
  };
  score: number | null;
}

interface Candidate {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  email: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  experience_level: string | null;
  experience_label: string;
  is_available: boolean;
  reputation_score: number;
  profile_completion: number;
  skills: Skill[];
  submissions: ChallengeSubmission[];
  joined_at: string;
}

interface Props {
  candidate: Candidate;
  stats: {
    completed_challenges: number;
    total_submissions: number;
    avg_score: number;
    reputation: number;
  };
}

export default function Show({ candidate, stats }: Props) {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <Head title={`${candidate.name} - SkillProof`} />

      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link href="/candidates" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft size={16} />
          {t('public.back_to_candidates')}
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg flex-shrink-0">
                {candidate.avatar ? (
                  <img src={candidate.avatar} alt="" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                  {candidate.is_available && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <CheckCircle size={12} />
                      {t('public.available')}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{candidate.headline || t('public.no_headline')}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {candidate.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {candidate.location}
                    </span>
                  )}
                  {candidate.website && (
                    <a href={candidate.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <Globe size={14} />
                      {t('public.website')}
                    </a>
                  )}
                  {candidate.github && (
                    <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <Github size={14} />
                      GitHub
                    </a>
                  )}
                  {candidate.linkedin && (
                    <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <Linkedin size={14} />
                      LinkedIn
                    </a>
                  )}
                  {candidate.email && (
                    <a href={`mailto:${candidate.email}`} className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                      <Mail size={14} />
                      {t('public.contact')}
                    </a>
                  )}
                </div>
              </div>

              {/* Reputation Badge */}
              <div className="flex-shrink-0 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <Star size={24} className="mx-auto mb-1 text-amber-500 fill-amber-500" />
                <p className="text-2xl font-bold text-amber-700">{candidate.reputation_score}</p>
                <p className="text-xs text-amber-600 font-medium">{t('public.reputation')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {candidate.bio && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-indigo-600" />
                  {t('public.about')}
                </h2>
                <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {candidate.bio}
                </div>
              </div>
            )}

            {/* Skills */}
            {candidate.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={20} className="text-indigo-600" />
                  {t('public.skills')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100"
                    >
                      {skill.name}
                      {skill.category && (
                        <span className="text-indigo-400 text-xs ml-1">({skill.category.name})</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Challenges */}
            {candidate.submissions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500" />
                  {t('public.completed_challenges')}
                </h2>
                <div className="space-y-4">
                  {candidate.submissions.map((sub) => (
                    <div key={sub.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border hover:border-indigo-200 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center flex-shrink-0">
                        {sub.challenge.company.logo ? (
                          <img src={sub.challenge.company.logo} alt="" className="w-6 h-6 object-contain" />
                        ) : (
                          <Building2 size={18} className="text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/challenges/${sub.challenge.slug}`}
                          className="font-medium text-gray-900 hover:text-indigo-600 transition-colors block truncate"
                        >
                          {sub.challenge.title}
                        </Link>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Building2 size={12} />
                          {sub.challenge.company.name}
                        </p>
                      </div>
                      {sub.score !== null && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-bold border border-amber-200">
                          <Star size={14} className="fill-amber-500" />
                          {sub.score}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('public.statistics')}</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Trophy size={16} className="text-indigo-600" />
                    {t('public.completed')}
                  </span>
                  <span className="font-bold text-gray-900">{stats.completed_challenges}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Award size={16} className="text-blue-600" />
                    {t('public.total_submissions')}
                  </span>
                  <span className="font-bold text-gray-900">{stats.total_submissions}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Star size={16} className="text-amber-500" />
                    {t('public.avg_score')}
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.avg_score > 0 ? Math.round(stats.avg_score) : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={16} className="text-green-600" />
                    {t('public.joined')}
                  </span>
                  <span className="font-bold text-gray-900">{candidate.joined_at}</span>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('public.profile_completion')}</span>
                  <span className="text-sm font-bold text-indigo-600">{candidate.profile_completion}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${candidate.profile_completion}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">{t('public.experience_level')}</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Briefcase size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{candidate.experience_label}</p>
                  <p className="text-xs text-gray-500">{t('public.experience')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}