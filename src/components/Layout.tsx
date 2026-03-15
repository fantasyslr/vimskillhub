import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { Menu, X, Sparkles, Search, Upload, User } from 'lucide-react'

export default function Layout() {
  const { user, profile, signOut } = useAuth()
  const { lang, setLang, t } = useLang()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#e6edf3]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[#30363d]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center shadow-md shadow-[#238636]/10 group-hover:shadow-[#238636]/20 transition-shadow">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#e6edf3] to-[#8b949e] group-hover:from-white group-hover:to-[#e6edf3] transition-all">
                VimSkillHub
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/explore"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/explore')
                    ? 'bg-[#30363d]/50 text-[#e6edf3]'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]/30'
                }`}
              >
                <Search className="w-4 h-4" />
                {t('nav.explore')}
              </Link>
              <Link
                to="/upload"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/upload')
                    ? 'bg-[#30363d]/50 text-[#e6edf3]'
                    : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]/30'
                }`}
              >
                <Upload className="w-4 h-4" />
                {t('nav.upload')}
              </Link>
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className="text-xs font-medium px-2.5 py-1 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#8b949e] transition-all"
              >
                {lang === 'en' ? '中文' : 'EN'}
              </button>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors px-2 py-1 rounded-lg hover:bg-[#30363d]/30"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#238636] to-[#58a6ff] flex items-center justify-center text-[10px] font-bold text-white">
                      {(profile?.display_name ?? user.email ?? '?').charAt(0).toUpperCase()}
                    </div>
                    {profile?.display_name ?? user.email}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] border border-[#30363d] rounded-lg px-3 py-1.5 hover:border-[#8b949e] transition-all hover:bg-[#30363d]/20"
                  >
                    {t('nav.signout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors px-3 py-1.5"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3ab654] text-white rounded-lg px-4 py-1.5 transition-all font-medium shadow-sm shadow-[#238636]/10"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#8b949e] hover:text-[#e6edf3] p-1.5 rounded-lg hover:bg-[#30363d]/30 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#30363d]/50 glass">
            <div className="px-4 py-4 space-y-1">
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]/30 text-sm font-medium transition-colors"
              >
                <Search className="w-4 h-4" />
                {t('nav.explore')}
              </Link>
              <Link
                to="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]/30 text-sm font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                {t('nav.upload')}
              </Link>
              <button
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className="text-xs font-medium px-2.5 py-1 rounded-lg border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#8b949e] transition-all"
              >
                {lang === 'en' ? '中文' : 'EN'}
              </button>
              <div className="border-t border-[#30363d]/50 pt-3 mt-3">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]/30 text-sm font-medium transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {profile?.display_name ?? user.email}
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]/30 text-sm transition-colors"
                    >
                      {t('nav.signout')}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 px-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm text-[#8b949e] hover:text-[#e6edf3] py-2"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm text-[#238636] hover:text-[#2ea043] font-medium py-2"
                    >
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d]/50 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-[#8b949e]">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[#238636] to-[#2ea043] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              VimSkillHub
            </div>
            <p className="text-xs text-[#484f58]">
              {t('nav.footer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
