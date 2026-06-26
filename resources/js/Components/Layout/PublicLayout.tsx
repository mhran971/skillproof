import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Trophy, Users, Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                SkillProof
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/challenges" className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-1.5">
                  <Trophy size={16} />
                  {t('public.challenges')}
                </Link>
                <Link href="/candidates" className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-1.5">
                  <Users size={16} />
                  {t('public.candidates')}
                </Link>
                <Link href="/companies" className="text-sm font-medium text-gray-600 hover:text-indigo-600 flex items-center gap-1.5">
                  <Building2 size={16} />
                  {t('public.companies')}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                {t('auth.login')}
              </Link>
              <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                {t('auth.register')}
              </Link>
              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-3 space-y-2 bg-white">
            <Link href="/challenges" className="block py-2 text-sm text-gray-600">{t('public.challenges')}</Link>
            <Link href="/candidates" className="block py-2 text-sm text-gray-600">{t('public.candidates')}</Link>
            <Link href="/companies" className="block py-2 text-sm text-gray-600">{t('public.companies')}</Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SkillProof. {t('public.all_rights_reserved')}
        </div>
      </footer>
    </div>
  );
}
