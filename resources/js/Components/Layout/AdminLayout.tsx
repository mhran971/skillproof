import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type NavItem = { label: string; href: string };

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { auth } = usePage().props as any;
  const user = auth?.user;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isRTL = (usePage().props as any)?.i18n?.language === 'ar';

  const menuItems: NavItem[] = useMemo(
    () => [
      { label: t('admin.dashboard', 'Dashboard'), href: '/admin/dashboard' },
      // صفحات Sprint القادمة (Users/Challenges/Skills) ستضاف هنا لاحقًا
    ],
    [t],
  );

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-xl text-indigo-600">SkillProof Admin</span>
        <button
          type="button"
          onClick={() => setSidebarOpen((s) => !s)}
          className="p-2"
          aria-label="Toggle sidebar"
        >
          <span className="text-gray-700">☰</span>
        </button>
      </div>

      <div className="flex">
        <aside
          className={
            'fixed lg:static inset-y-0 z-50 w-64 bg-white border-r shadow-lg lg:shadow-none ' +
            (sidebarOpen ? (isRTL ? 'right-0' : 'left-0') : isRTL ? 'right-[-100%]' : 'left-[-100%]') +
            ' transition-[left,right] duration-200 ease-in-out'
          }
        >
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-indigo-600">SkillProof</h1>
            <p className="text-sm text-gray-500 mt-1">{t('admin.panel', 'Admin panel')}</p>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t">
              <Link
                href="/logout"
                method="post"
                as="button"
                className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                {t('auth.logout', 'Logout')}
              </Link>
            </div>
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <div className="text-gray-900">
                {t('admin.welcome', 'Welcome')}
                {user?.name ? `, ${user.name}` : ''}
              </div>
              <div className="hidden sm:block text-sm text-gray-500">
                {user?.email}
              </div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

