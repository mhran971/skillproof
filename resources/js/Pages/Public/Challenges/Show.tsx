import PublicLayout from '@/Components/Layout/PublicLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, Clock, Users, Building2, ArrowLeft, Star, 
  CheckCircle, AlertCircle, Calendar, Timer, Target,
  Code2, FileText, GitBranch, Globe, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface Skill {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  description: string;
  website: string | null;
  location: string | null;
}

interface Criterion {
  name: string;
  weight: number;
}

interface AcceptedSubmission {
  id: number;
  user_name: string;
  user_avatar: string | null;
}

interface Challenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  deliverables: string;
  difficulty_level: string;
  difficulty_label: string;
  duration_hours: number | null;
  deadline: string | null;
  deadline_human: string | null;
  max_participants: number | null;
  reward_description: string | null;
  evaluation_criteria: Criterion[];
  company: Company;
  required_skills: Skill[];
  submissions_count: number;
  accepted_submissions: AcceptedSubmission[];
}

interface Props {
  challenge: Challenge;
  hasSubmitted: boolean;
  userSubmission: { id: number; status: string } | null;
  stats: {
    total_submissions: number;
    accepted_count: number;
    avg_score: number;
  };
}

export default function Show({ challenge, hasSubmitted, userSubmission, stats }: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'criteria'>('overview');

  const { post, processing } = useForm();

  const handleJoin = () => {
    post(`/challenges/${challenge.slug}/join`);
  };

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-700 border-green-200',
      intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
      advanced: 'bg-purple-100 text-purple-700 border-purple-200',
      expert: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const isExpired = challenge.deadline && new Date(challenge.deadline) < new Date();

  return (
    <PublicLayout>
      <Head title={`${challenge.title} - SkillProof`} />

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <Link href="/challenges" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft size={16} />
          {t('public.back_to_challenges')}
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                {challenge.company.logo ? (
                  <img src={challenge.company.logo} alt="" className="w-20 h-20 rounded-xl object-cover border" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-indigo-100 flex items-center justify-center border">
                    <Building2 size={32} className="text-indigo-600" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty_level)}`}>
                    {challenge.difficulty_label}
                  </span>
                  {isExpired && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      {t('public.expired')}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{challenge.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <Link href={`/companies/${challenge.company.slug}`} className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                    <Building2 size={16} />
                    {challenge.company.name}
                  </Link>
                  {challenge.company.location && (
                    <span className="flex items-center gap-1.5">
                      <Globe size={16} />
                      {challenge.company.location}
                    </span>
                  )}
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-indigo-600" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">{stats.total_submissions}</p>
                      <p className="text-xs text-gray-500">{t('public.submissions')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">{stats.accepted_count}</p>
                      <p className="text-xs text-gray-500">{t('public.accepted')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-500" />
                    <div>
                      <p className="text-lg font-bold text-gray-900">{stats.avg_score > 0 ? Math.round(stats.avg_score) : '-'}</p>
                      <p className="text-xs text-gray-500">{t('public.avg_score')}</p>
                    </div>
                  </div>
                  {challenge.duration_hours && (
                    <div className="flex items-center gap-2">
                      <Timer size={18} className="text-blue-600" />
                      <div>
                        <p className="text-lg font-bold text-gray-900">{challenge.duration_hours}h</p>
                        <p className="text-xs text-gray-500">{t('public.duration')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="lg:w-64 flex-shrink-0">
                <div className="bg-gray-50 rounded-xl p-6 border">
                  {hasSubmitted ? (
                    <div className="text-center">
                      <CheckCircle size={32} className="mx-auto mb-2 text-green-600" />
                      <p className="font-medium text-gray-900 mb-1">{t('public.already_joined')}</p>
                      <p className="text-sm text-gray-500 mb-3">{t('public.submission_status')}: {userSubmission?.status}</p>
                      <Link
                        href={`/candidate/submissions/${userSubmission?.id}`}
                        className="block w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 text-center text-sm"
                      >
                        {t('public.view_submission')}
                      </Link>
                    </div>
                  ) : isExpired ? (
                    <div className="text-center">
                      <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
                      <p className="font-medium text-gray-900">{t('public.challenge_ended')}</p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleJoin}
                        disabled={processing}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200 mb-3"
                      >
                        {processing ? t('public.joining') : t('public.join_challenge')}
                      </button>
                      {challenge.deadline_human && (
                        <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                          <Clock size={12} />
                          {t('public.ends')} {challenge.deadline_human}
                        </p>
                      )}
                    </>
                  )}

                  {challenge.reward_description && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-1">{t('public.reward')}</p>
                      <p className="text-sm font-medium text-amber-700 flex items-center gap-1">
                        <Trophy size={14} />
                        {challenge.reward_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b">
            <div className="flex">
              {[
                { id: 'overview', label: t('public.overview'), icon: FileText },
                { id: 'requirements', label: t('public.requirements'), icon: Target },
                { id: 'criteria', label: t('public.evaluation'), icon: Star },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === 'overview' && (
              <div className="prose prose-indigo max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('public.about_challenge')}</h3>
                <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {challenge.description}
                </div>

                {/* Skills */}
                {challenge.required_skills.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('public.required_skills')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {challenge.required_skills.map((skill) => (
                        <span key={skill.id} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverables */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('public.deliverables')}</h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-600 whitespace-pre-line">
                    {challenge.deliverables}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="prose prose-indigo max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('public.requirements')}</h3>
                <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                  {challenge.requirements}
                </div>
              </div>
            )}

            {activeTab === 'criteria' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('public.evaluation_criteria')}</h3>
                <div className="space-y-4">
                  {challenge.evaluation_criteria.map((criterion, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{criterion.name}</span>
                          <span className="text-sm font-bold text-indigo-600">{criterion.weight}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${criterion.weight}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {t('public.evaluation_note')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Accepted Candidates */}
        {challenge.accepted_submissions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-yellow-500" />
              {t('public.successful_candidates')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {challenge.accepted_submissions.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border">
                  {sub.user_avatar ? (
                    <img src={sub.user_avatar} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                      {sub.user_name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{sub.user_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}