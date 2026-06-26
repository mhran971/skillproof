import { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Trophy, FileText, Settings, Bell,
  ChevronDown, LogOut, Building2
} from 'lucide-react';
import { useState } from 'react';

interface Props {
  children: ReactNode;
}

export default function CompanyLayout({ children }: Props) {
  const { t } = useTranslation();
  const { auth } = usePage().props as any;
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { href: '/company/dashboard', label: t('company.dashboard'), icon: LayoutDashboard },
    { href: '/company/challenges', label: t('company.challenges'), icon: Trophy },
    { href: '/company/submissions', label: t('company.submissions'), icon: FileText },
    { href: '/company/settings', label: t('company.settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            SkillProof
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 w-full">
            <LogOut size={18} />
            {t('auth.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">{t('company.area')}</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-indigo-600">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {auth?.user?.name?.charAt(0) || 'C'}
                </div>
                <span className="hidden sm:block">{auth?.user?.name || 'Company'}</span>
                <ChevronDown size={14} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <Link href="/company/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {t('company.profile')}
                  </Link>
                  <Link href="/logout" method="post" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    {t('auth.logout')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
