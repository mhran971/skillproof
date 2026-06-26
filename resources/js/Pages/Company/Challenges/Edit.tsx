import CompanyLayout from '@/Components/Layout/CompanyLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Plus, X, Save, Upload, Trophy, 
  AlertTriangle, CheckCircle, ListChecks 
} from 'lucide-react';
import { useState } from 'react';

interface Skill {
  id: number;
  name: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  requirements: string;
  deliverables: string;
  evaluation_criteria: { name: string; weight: number }[];
  difficulty_level: string;
  duration_hours: number | null;
  deadline: string | null;
  max_participants: number | null;
  is_published: boolean;
  reward_description: string | null;
  required_skills: { id: number; name: string }[];
}

interface Props {
  challenge: Challenge;
  availableSkills: Skill[];
  difficulty_levels: string[];
}

export default function Edit({ challenge, availableSkills, difficulty_levels }: Props) {
  const { t } = useTranslation();
  const [criteria, setCriteria] = useState<{ name: string; weight: number }[]>(
    challenge.evaluation_criteria.length > 0 ? challenge.evaluation_criteria : [{ name: '', weight: 0 }]
  );

  const { data, setData, post, processing, errors } = useForm({
    title: challenge.title,
    description: challenge.description,
    requirements: challenge.requirements,
    deliverables: challenge.deliverables,
    evaluation_criteria: challenge.evaluation_criteria,
    difficulty_level: challenge.difficulty_level,
    duration_hours: challenge.duration_hours || '',
    deadline: challenge.deadline ? challenge.deadline.substring(0, 16) : '',
    max_participants: challenge.max_participants || '',
    required_skills: challenge.required_skills.map((s) => s.id),
    reward_description: challenge.reward_description || '',
    attachment: null as File | null,
    is_published: challenge.is_published,
    _method: 'put',
  });

  const addCriterion = () => setCriteria([...criteria, { name: '', weight: 0 }]);
  const removeCriterion = (index: number) => { if (criteria.length > 1) setCriteria(criteria.filter((_, i) => i !== index)); };
  const updateCriterion = (index: number, field: string, value: any) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setCriteria(newCriteria);
    setData('evaluation_criteria', newCriteria);
  };

  const toggleSkill = (skillId: number) => {
    setData('required_skills', data.required_skills.includes(skillId)
      ? data.required_skills.filter((id) => id !== skillId)
      : [...data.required_skills, skillId]
    );
  };

  const handleSubmit = (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setData('is_published', publish);
    setData('evaluation_criteria', criteria);
    post(`/company/challenges/${challenge.id}`, { forceFormData: true, preserveScroll: true });
  };

  const totalWeight = criteria.reduce((sum, c) => sum + (parseInt(String(c.weight)) || 0), 0);

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`;

  const textareaClass = (field: string) =>
    `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`;

  return (
    <CompanyLayout>
      <Head title={`${t('company.edit_challenge')} - ${challenge.title}`} />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/company/challenges" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('company.edit_challenge')}</h1>
            <p className="text-gray-500 text-sm mt-1">{challenge.title}</p>
          </div>
        </div>

        <form className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-indigo-600" />
              {t('company.basic_info')}
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.title')} <span className="text-red-500">*</span></label>
                <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass('title')} />
                {errors.title && <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1"><AlertTriangle size={14} /> {errors.title}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.difficulty')}</label>
                  <select value={data.difficulty_level} onChange={(e) => setData('difficulty_level', e.target.value)} className={inputClass('difficulty_level')}>
                    {difficulty_levels.map((level) => (<option key={level} value={level}>{t(`company.difficulty_${level}`)}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.duration_hours')}</label>
                  <input type="number" value={data.duration_hours} onChange={(e) => setData('duration_hours', e.target.value)} className={inputClass('duration_hours')} min="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.max_participants')}</label>
                  <input type="number" value={data.max_participants} onChange={(e) => setData('max_participants', e.target.value)} className={inputClass('max_participants')} min="1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.deadline')}</label>
                <input type="datetime-local" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)} className={inputClass('deadline')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.description')} <span className="text-red-500">*</span></label>
                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} className={textareaClass('description')} />
                {errors.description && <p className="text-red-500 text-sm mt-1.5">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.requirements')} <span className="text-red-500">*</span></label>
                <textarea value={data.requirements} onChange={(e) => setData('requirements', e.target.value)} rows={4} className={textareaClass('requirements')} />
                {errors.requirements && <p className="text-red-500 text-sm mt-1.5">{errors.requirements}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.deliverables')} <span className="text-red-500">*</span></label>
                <textarea value={data.deliverables} onChange={(e) => setData('deliverables', e.target.value)} rows={4} className={textareaClass('deliverables')} />
                {errors.deliverables && <p className="text-red-500 text-sm mt-1.5">{errors.deliverables}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ListChecks size={20} className="text-indigo-600" />
                {t('company.evaluation_criteria')}
                <span className={`text-sm font-normal px-2 py-1 rounded-full ${totalWeight === 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {totalWeight}% / 100%
                </span>
              </h2>
              <button type="button" onClick={addCriterion} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">
                <Plus size={16} /> {t('company.add_criterion')}
              </button>
            </div>
            <div className="space-y-3">
              {criteria.map((criterion, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input type="text" value={criterion.name} onChange={(e) => updateCriterion(index, 'name', e.target.value)} placeholder={t('company.criterion_name')} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
                  <div className="relative w-28">
                    <input type="number" value={criterion.weight} onChange={(e) => updateCriterion(index, 'weight', parseInt(e.target.value) || 0)} placeholder="%" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  {criteria.length > 1 && (
                    <button type="button" onClick={() => removeCriterion(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={16} /></button>
                  )}
                </div>
              ))}
            </div>
            {errors.evaluation_criteria && <p className="text-red-500 text-sm mt-2">{errors.evaluation_criteria}</p>}
            {criteria.map((_, index) => (errors as any)[`evaluation_criteria.${index}.name`] && (
                <p key={index} className="text-red-500 text-sm mt-1">
                    {(errors as any)[`evaluation_criteria.${index}.name`]}
                </p>
            ))}
            {totalWeight !== 100 && <p className="text-yellow-600 text-sm mt-2 flex items-center gap-1"><AlertTriangle size={14} /> {t('company.weight_must_be_100')}</p>}
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">{t('company.required_skills')}</h2>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${data.required_skills.includes(skill.id) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-6">{t('company.additional')}</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.reward_description')}</label>
                <textarea value={data.reward_description} onChange={(e) => setData('reward_description', e.target.value)} rows={2} className={textareaClass('reward_description')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company.attachment')}</label>
                <input type="file" onChange={(e) => setData('attachment', e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                {errors.attachment && <p className="text-red-500 text-sm mt-1.5">{errors.attachment}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl shadow-sm border p-6 sticky bottom-6 z-10">
            <Link href="/company/challenges" className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 w-full sm:w-auto text-center">
              {t('common.cancel')}
            </Link>
            <div className="flex gap-3 w-full sm:w-auto">
              <button type="button" onClick={(e) => handleSubmit(e, false)} disabled={processing} className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 w-full sm:w-auto">
                <Save size={18} /> {t('company.save_changes')}
              </button>
              <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={processing || totalWeight !== 100} className="flex items-center justify-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 w-full sm:w-auto">
                <CheckCircle size={18} /> {data.is_published ? t('company.update_published') : t('company.publish_challenge')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </CompanyLayout>
  );
}