import CompanyLayout from '@/Components/Layout/CompanyLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Star, FileText, Globe, Github as GithubIcon, Download,
  MessageSquare, CheckCircle, XCircle, AlertTriangle, 
  Send, Save, User, Clock, Building2, Award 
} from 'lucide-react';
import { useState } from 'react';

interface FileItem {
  id: number;
  original_name: string;
  file_size: number;
  mime_type: string;
}

interface Evaluation {
  id: number;
  score: number;
  feedback: string;
  criteria_scores: { name: string; score: number; weight: number }[] | null;
  is_final: boolean;
  evaluator: { name: string } | null;
  created_at: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  headline: string | null;
  profile_completion: number | null;
}

interface Challenge {
  id: number;
  title: string;
  evaluation_criteria: { name: string; weight: number }[];
}

interface Submission {
  id: number;
  title: string;
  description: string;
  repository_url: string | null;
  live_demo_url: string | null;
  notes: string | null;
  status: string;
  status_label: string;
  submitted_at: string | null;
  created_at: string;
  candidate: Candidate;
  challenge: Challenge;
  files: FileItem[];
  evaluations: Evaluation[];
  overall_score: number | null;
}

interface Props {
  submission: Submission;
  evaluation: Evaluation | null;
  canEvaluate: boolean;
}

export default function Show({ submission, evaluation, canEvaluate }: Props) {
  const { t } = useTranslation();
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [acceptDecision, setAcceptDecision] = useState<boolean | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    score: evaluation?.score || 0,
    feedback: evaluation?.feedback || '',
    criteria_scores: submission.challenge.evaluation_criteria.map((c) => {
      const existing = evaluation?.criteria_scores?.find((ec) => ec.name === c.name);
      return { name: c.name, score: existing?.score || 0, weight: c.weight };
    }),
    is_final: false,
    accept: false,
  });

  const handleSave = (e: React.FormEvent, final: boolean = false, accepted: boolean = false) => {
    e.preventDefault();
    if (final) {
      setAcceptDecision(accepted);
      setShowFinalConfirm(true);
      return;
    }
    setData('is_final', false);
    post(`/company/submissions/${submission.id}/evaluate`, { preserveScroll: true });
  };

  const confirmFinal = () => {
    setData('is_final', true);
    setData('accept', acceptDecision);
    post(`/company/submissions/${submission.id}/evaluate`, {
      preserveScroll: true,
      onSuccess: () => setShowFinalConfirm(false),
    });
  };

  const updateCriteriaScore = (index: number, score: number) => {
    const newScores = [...data.criteria_scores];
    newScores[index] = { ...newScores[index], score };
    setData('criteria_scores', newScores);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      <Head title={`${t('company.review_submission')} - ${submission.candidate.name}`} />

      {/* Final Confirmation Modal */}
      {showFinalConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold">{t('company.confirm_final_evaluation')}</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {acceptDecision 
                ? t('company.confirm_accept_desc') 
                : t('company.confirm_reject_desc')}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('company.overall_score')}</span>
                <span className="font-bold text-gray-900">{data.score}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('company.candidate')}</span>
                <span className="font-medium text-gray-900">{submission.candidate.name}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFinalConfirm(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                {t('common.cancel')}
              </button>
              <button onClick={confirmFinal} disabled={processing} className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2 ${acceptDecision ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {acceptDecision ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {processing ? t('common.saving') : (acceptDecision ? t('company.accept_candidate') : t('company.reject_candidate'))}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/company/submissions" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
            <ArrowLeft size={16} /> {t('company.back_to_submissions')}
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-600 overflow-hidden">
                {submission.candidate.avatar ? (
                  <img src={submission.candidate.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  submission.candidate.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{submission.candidate.name}</h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <Building2 size={14} /> {submission.challenge.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status_label}
                  </span>
                  {submission.overall_score !== null && (
                    <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                      <Star size={14} className="fill-yellow-500" /> {submission.overall_score}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            {submission.candidate.profile_completion && (
              <div className="bg-white border rounded-lg p-3 text-center min-w-[120px]">
                <p className="text-xs text-gray-500 mb-1">{t('company.profile_completion')}</p>
                <p className="text-xl font-bold text-indigo-600">{submission.candidate.profile_completion}%</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Content */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">{t('company.submission_details')}</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line mb-6">
                {submission.description}
              </div>

              {(submission.repository_url || submission.live_demo_url) && (
                <div className="space-y-3">
                  {submission.repository_url && (
                    <a href={submission.repository_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                      <GithubIcon size={20} className="text-gray-700" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{submission.repository_url}</p>
                        <p className="text-xs text-gray-500">{t('company.repository')}</p>
                      </div>
                    </a>
                  )}
                  {submission.live_demo_url && (
                    <a href={submission.live_demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                      <Globe size={20} className="text-gray-700" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{submission.live_demo_url}</p>
                        <p className="text-xs text-gray-500">{t('company.live_demo')}</p>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Files */}
            {submission.files.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4">{t('company.attached_files')}</h2>
                <div className="space-y-2">
                  {submission.files.map((file) => (
                    <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <FileText size={20} className="text-indigo-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.original_name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title={t('company.download')}>
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {submission.notes && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare size={20} className="text-indigo-600" />
                  {t('company.candidate_notes')}
                </h2>
                <p className="text-gray-600 text-sm whitespace-pre-line">{submission.notes}</p>
              </div>
            )}

            {/* Previous Evaluations */}
            {submission.evaluations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award size={20} className="text-yellow-500" />
                  {t('company.previous_evaluations')}
                </h2>
                <div className="space-y-4">
                  {submission.evaluations.map((evalItem) => (
                    <div key={evalItem.id} className={`border rounded-lg p-4 ${evalItem.is_final ? 'bg-green-50/50 border-green-200' : 'bg-gray-50/50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{evalItem.evaluator?.name || t('company.system')}</span>
                          {evalItem.is_final && <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-medium">{t('company.final')}</span>}
                        </div>
                        <span className="text-xs text-gray-400">{new Date(evalItem.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${evalItem.score}%` }} />
                        </div>
                        <span className="font-bold text-gray-900">{evalItem.score}%</span>
                      </div>
                      {evalItem.criteria_scores && evalItem.criteria_scores.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {evalItem.criteria_scores.map((cs, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{cs.name}</span>
                              <span className="font-medium">{cs.score}/100</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            checked={!!evalItem.is_final}
                            readOnly
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-600">{t('company.final_evaluation')}</span>
                      </div>
                      <p className="text-sm text-gray-600 bg-white border rounded-lg p-3 whitespace-pre-line">{evalItem.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluation Form */}
            {canEvaluate && submission.status !== 'accepted' && submission.status !== 'rejected' && (
              <form className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Star size={20} className="text-indigo-600" />
                  {evaluation ? t('company.edit_evaluation') : t('company.new_evaluation')}
                </h2>

                {/* Criteria Scores */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-medium text-gray-700">{t('company.score_by_criteria')}</h3>
                  {data.criteria_scores.map((criteria, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">{criteria.name}</span>
                        <span className="text-sm font-bold text-indigo-600">{criteria.score}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={criteria.score}
                        onChange={(e) => updateCriteriaScore(index, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0</span>
                        <span>Weight: {criteria.weight}%</span>
                        <span>100</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall Score */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.overall_score')} <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={data.score}
                      onChange={(e) => setData('score', parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${data.score}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-12">/ 100</span>
                  </div>
                  {errors.score && <p className="text-red-500 text-sm mt-1.5">{errors.score}</p>}
                </div>

                {/* Feedback */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.feedback')} <span className="text-red-500">*</span></label>
                  <textarea
                    value={data.feedback}
                    onChange={(e) => setData('feedback', e.target.value)}
                    rows={5}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${errors.feedback ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
                    placeholder={t('company.feedback_placeholder')}
                  />
                  {errors.feedback && <p className="text-red-500 text-sm mt-1.5">{errors.feedback}</p>}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleSave(e, false)}
                    disabled={processing}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Save size={18} /> {processing && !data.is_final ? t('common.saving') : t('company.save_draft')}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSave(e, true, true)}
                    disabled={processing}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-200"
                  >
                    <CheckCircle size={18} /> {t('company.accept')}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSave(e, true, false)}
                    disabled={processing}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-200"
                  >
                    <XCircle size={18} /> {t('company.reject')}
                  </button>
                </div>
              </form>
            )}

            {submission.status === 'accepted' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-4">
                <CheckCircle size={32} className="text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">{t('company.candidate_accepted')}</h3>
                  <p className="text-sm text-green-700">{t('company.accepted_desc')}</p>
                </div>
              </div>
            )}

            {submission.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
                <XCircle size={32} className="text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">{t('company.candidate_rejected')}</h3>
                  <p className="text-sm text-red-700">{t('company.rejected_desc')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidate Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('company.candidate_info')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{submission.candidate.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{submission.candidate.email}</span>
                </div>
                {submission.candidate.headline && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500">{submission.candidate.headline}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Challenge Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('company.challenge_info')}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('company.challenge')}</span>
                  <span className="font-medium text-gray-900">{submission.challenge.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('company.submitted')}</span>
                  <span className="font-medium text-gray-900">
                    {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('company.status')}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status_label}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{t('company.timeline')}</h3>
              <div className="space-y-4 relative pl-6">
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />
                <div className="relative">
                  <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-indigo-600 border-2 border-white" />
                  <p className="text-sm font-medium text-gray-900">{t('company.submitted')}</p>
                  <p className="text-xs text-gray-500">{submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : '-'}</p>
                </div>
                {submission.evaluations.length > 0 && (
                  <div className="relative">
                    <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-purple-500 border-2 border-white" />
                    <p className="text-sm font-medium text-gray-900">{t('company.evaluated')}</p>
                    <p className="text-xs text-gray-500">{new Date(submission.evaluations[0].created_at).toLocaleString()}</p>
                  </div>
                )}
                {(submission.status === 'accepted' || submission.status === 'rejected') && (
                  <div className="relative">
                    <div className={`absolute -left-[21px] w-4 h-4 rounded-full border-2 border-white ${submission.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p className="text-sm font-medium text-gray-900">{submission.status === 'accepted' ? t('company.accepted') : t('company.rejected')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}