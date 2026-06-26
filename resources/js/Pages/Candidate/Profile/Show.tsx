import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import CandidateLayout from '@/Components/Layout/CandidateLayout';
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  FolderGit,
  Award,
  Eye,
  EyeOff,
  Edit,
  Calendar,
  Globe,
} from 'lucide-react';

type Skill = {
  id: number;
  name: string;
  proficiency_level?: string | null;
  years_experience?: number | null;
};

type Project = {
  id: number;
  title: string;
  description?: string | null;
  url?: string | null;
  technologies?: string[];
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  duration?: string | null;
};

type Experience = {
  id: number;
  title: string;
  company: string;
  description?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  duration?: string | null;
};

type Education = {
  id: number;
  institution: string;
  degree: string;
  field_of_study?: string | null;
  grade?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  duration?: string | null;
};

type Profile = {
  id: number;
  professional_headline?: string | null;
  biography?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  profile_completion?: number;
  reputation_score?: number;
  job_readiness_score?: number;
  is_public: boolean;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
};

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
};

type Props = {
  profile: Profile;
  user: User;
};

export default function CandidateProfileShow({ profile, user }: Props) {
  const { t } = useTranslation();

  return (
    <CandidateLayout>
      <Head title={t('candidate.profile', 'Profile')} />

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              {profile.professional_headline && (
                <p className="text-gray-600 mt-1">{profile.professional_headline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <Mail size={14} /> {user.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={14} /> {profile.phone}
                  </span>
                )}
                {(profile.city || profile.country) && (
                  <span className="flex items-center gap-2">
                    <MapPin size={14} /> {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                profile.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {profile.is_public ? <Eye size={16} /> : <EyeOff size={16} />}
              {profile.is_public ? t('candidate.public', 'Public') : t('candidate.private', 'Private')}
            </span>

            <Link
              href="/candidate/profile/edit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit size={18} /> {t('common.edit', 'Edit')}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-500">{t('candidate.profile_completion', 'Profile completion')}</p>
            <p className="text-2xl font-bold text-indigo-600">{profile.profile_completion ?? 0}%</p>
          </div>
          <div className="text-center border-x py-2 px-2">
            <p className="text-sm text-gray-500">{t('candidate.reputation_score', 'Reputation score')}</p>
            <p className="text-2xl font-bold text-yellow-600">{profile.reputation_score ?? 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">{t('candidate.job_readiness', 'Job readiness')}</p>
            <p className="text-2xl font-bold text-green-600">{profile.job_readiness_score ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {profile.biography && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">{t('candidate.about', 'About')}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{profile.biography}</p>
            </div>
          )}

          {profile.experience.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-600" />
                {t('candidate.experience', 'Experience')}
              </h2>
              <div className="space-y-6">
                {profile.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-indigo-100">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600" />
                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-indigo-600 font-medium">{exp.company}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} />
                        {exp.start_date ? new Date(exp.start_date).getFullYear() : ''} -{' '}
                        {exp.is_current
                          ? t('candidate.present', 'Present')
                          : exp.end_date
                            ? new Date(exp.end_date).getFullYear()
                            : ''}
                      </span>
                      {exp.duration && <span>· {exp.duration}</span>}
                      {exp.location && (
                        <span className="flex items-center gap-2">
                          <MapPin size={14} /> {exp.location}
                        </span>
                      )}
                    </div>
                    {exp.description && <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.projects.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FolderGit size={20} className="text-indigo-600" />
                {t('candidate.projects', 'Projects')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((p) => (
                  <div key={p.id} className="border rounded-lg p-4 hover:border-indigo-300 transition-colors">
                    <h3 className="font-semibold text-gray-900">{p.title}</h3>
                    {!!p.technologies?.length && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.technologies.slice(0, 8).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                      <Calendar size={14} />
                      {p.duration || (p.is_current ? t('candidate.ongoing', 'Ongoing') : '')}
                    </div>
                    {p.description && <p className="text-gray-600 text-sm mt-2 line-clamp-2">{p.description}</p>}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 mt-3"
                      >
                        <Globe size={16} /> {t('candidate.view_project', 'View project')}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.education.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-indigo-600" />
                {t('candidate.education', 'Education')}
              </h2>
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={24} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-indigo-600">{edu.institution}</p>
                      {(edu.field_of_study || edu.grade) && (
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                          {edu.field_of_study && <span>{edu.field_of_study}</span>}
                          {edu.grade && (
                            <span className="inline-flex items-center gap-2">
                              <Award size={14} /> {edu.grade}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-400 mt-2">
                        {edu.start_date ? new Date(edu.start_date).getFullYear() : ''} -{' '}
                        {edu.is_current
                          ? t('candidate.present', 'Present')
                          : edu.end_date
                            ? new Date(edu.end_date).getFullYear()
                            : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {profile.skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">{t('candidate.skills', 'Skills')}</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <div key={s.id} className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                    {s.name}
                    {s.proficiency_level && (
                      <span className="block text-xs text-indigo-500 mt-0.5">{s.proficiency_level}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">{t('candidate.reputation', 'Reputation')}</h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{t('candidate.profile_quality', 'Profile quality')}</span>
                  <span className="font-medium">{Math.min(profile.profile_completion ?? 0, 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(profile.profile_completion ?? 0, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{t('candidate.challenge_performance', 'Challenge performance')}</span>
                  <span className="font-medium">{profile.reputation_score ?? 0}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${profile.reputation_score ?? 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{t('candidate.job_readiness', 'Job readiness')}</span>
                  <span className="font-medium">{profile.job_readiness_score ?? 0}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${profile.job_readiness_score ?? 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}

