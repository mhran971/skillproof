import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import CandidateLayout from '@/Components/Layout/CandidateLayout';

export default function CandidateProfileEdit() {
  const { t } = useTranslation();

  return (
    <CandidateLayout>
      <Head title={t('candidate.edit_profile', 'Edit Profile')} />
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('candidate.edit_profile', 'Edit Profile')}</h1>
        <p className="text-gray-500 mt-2">This page will be fully implemented in the next pass.</p>
      </div>
    </CandidateLayout>
  );
}

