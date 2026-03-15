import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ALLOWED_DOMAINS } from '../lib/supabase'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    const domain = email.split('@')[1]?.toLowerCase()
    if (!ALLOWED_DOMAINS.includes(domain)) {
      setError(`Only ${ALLOWED_DOMAINS.map(d => `@${d}`).join(' and ')} email addresses are allowed to register.`)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, displayName)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <UserPlus className="w-12 h-12 text-[#238636] mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-[#e6edf3]">Create your account</h1>
          <p className="text-[#8b949e] mt-2 text-sm">
            Join VimSkillHub with your company email
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-4"
        >
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Display name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
              <input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 pl-10 pr-3 text-[#e6edf3] placeholder-[#484f58] text-sm focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Company email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@eazillion.com"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 pl-10 pr-3 text-[#e6edf3] placeholder-[#484f58] text-sm focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]"
              />
            </div>
            <p className="text-xs text-[#8b949e] mt-1">
              Only @eazillion.com and @vim-technology.com emails are accepted.
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 pl-10 pr-3 text-[#e6edf3] placeholder-[#484f58] text-sm focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#8b949e] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#58a6ff] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
