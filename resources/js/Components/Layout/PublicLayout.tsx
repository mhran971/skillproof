import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Menu, X, Trophy, Users, Building2, 
  LogIn, UserPlus, LogOut, LayoutDashboard 
} from 'lucide-react';
import { useState } from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { auth } = usePage().props as any;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  const navItems = [
    { label: t('nav.challenges'), href: '/challenges', icon: Trophy },
    { label: t('nav.candidates'), href: '/candidates', icon: Users },
    { label: t('nav.companies'), href: '/companies', icon: Building2 },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Trophy size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SkillProof</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors text-sm font-medium"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {auth?.user ? (
                <div className="flex items-center gap-3">
                  {auth.user.roles?.includes('company') && (
                    <Link
                      href="/company/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      {t('nav.dashboard')}
                    </Link>
                  )}
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    {t('auth.logout')}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    {t('auth.register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 border-t mt-3">
                {auth?.user ? (
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                  >
                    <LogOut size={20} />
                    {t('auth.logout')}
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium">
                      <LogIn size={20} />
                      {t('auth.login')}
                    </Link>
                    <Link href="/register" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium">
                      <UserPlus size={20} />
                      {t('auth.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                <Trophy size={14} className="text-white" />
              </div>
              <span className="font-semibold text-gray-900">SkillProof</span>
            </div>
            <p className="text-sm text-gray-500">© 2026 SkillProof. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}