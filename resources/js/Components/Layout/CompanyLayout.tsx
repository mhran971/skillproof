import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Trophy, FileText, Building2, 
  Settings, LogOut, Menu, X, BarChart3, Users 
} from 'lucide-react';
import { useState } from 'react';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { auth } = usePage().props as any;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  const menuItems = [
    { label: t('company.dashboard'), href: '/company/dashboard', icon: LayoutDashboard },
    { label: t('company.challenges'), href: '/company/challenges', icon: Trophy },
    { label: t('company.submissions'), href: '/company/submissions', icon: FileText },
    { label: t('company.analytics'), href: '/company/analytics', icon: BarChart3 },
    { label: t('company.settings'), href: '/company/settings', icon: Settings },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-xl text-indigo-600">SkillProof</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50
          w-64 bg-white border-r shadow-lg lg:shadow-none
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : `${isRTL ? 'translate-x-full' : '-translate-x-full'} lg:translate-x-0`}
        `}>
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-indigo-600">SkillProof</h1>
            <p className="text-sm text-gray-500 mt-1">{t('company.area')}</p>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t">
              <Link
                href="/logout"
                method="post"
                as="button"
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span>{t('auth.logout')}</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}