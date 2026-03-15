import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Terminal } from 'lucide-react'

export default function Layout() {
  const { user, profile, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#e6edf3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#161b22] border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-[#e6edf3] hover:text-white transition-colors">
              <Terminal className="w-6 h-6 text-[#238636]" />
              <span className="text-xl font-bold">VimSkillHub</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/explore"
                className="text-[#8b949e] hover:text-[#e6edf3] transition-colors text-sm font-medium"
              >
                Explore
              </Link>
              <Link
                to="/upload"
                className="text-[#8b949e] hover:text-[#e6edf3] transition-colors text-sm font-medium"
              >
                Upload
              </Link>
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-[#8b949e]">
                    {profile?.display_name ?? user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] border border-[#30363d] rounded-md px-3 py-1.5 hover:border-[#8b949e] transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-[#8b949e] hover:text-[#e6edf3] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-[#238636] hover:bg-[#2ea043] text-white rounded-md px-3 py-1.5 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#8b949e] hover:text-[#e6edf3]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#30363d] bg-[#161b22]">
            <div className="px-4 py-3 space-y-3">
              <Link
                to="/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#8b949e] hover:text-[#e6edf3] text-sm font-medium"
              >
                Explore
              </Link>
              <Link
                to="/upload"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#8b949e] hover:text-[#e6edf3] text-sm font-medium"
              >
                Upload
              </Link>
              <div className="border-t border-[#30363d] pt-3">
                {user ? (
                  <>
                    <p className="text-sm text-[#8b949e] mb-2">
                      {profile?.display_name ?? user.email}
                    </p>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="text-sm text-[#8b949e] hover:text-[#e6edf3]"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm text-[#8b949e] hover:text-[#e6edf3]"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm text-[#238636] hover:text-[#2ea043]"
                    >
                      Register
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
      <footer className="border-t border-[#30363d] bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-[#8b949e]">
            VimSkillHub &mdash; Vim Technology Internal Platform
          </p>
        </div>
      </footer>
    </div>
  )
}
