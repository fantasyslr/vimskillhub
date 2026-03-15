import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#238636]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#238636] to-[#2ea043] shadow-lg shadow-[#238636]/15 mb-5">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">Welcome back</h1>
          <p className="text-[#8b949e] mt-2 text-sm">Sign in to VimSkillHub</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161b22] border border-[#30363d] rounded-2xl p-7 space-y-5 shadow-xl shadow-black/20"
        >
          {error && (
            <div className="flex items-start gap-2 bg-red-500/8 border border-red-500/20 rounded-xl p-3.5 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#e6edf3] mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#484f58]" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@eazillion.com"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl py-2.5 pl-11 pr-3 text-[#e6edf3] placeholder-[#484f58] text-sm focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636] transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#e6edf3] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#484f58]" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl py-2.5 pl-11 pr-3 text-[#e6edf3] placeholder-[#484f58] text-sm focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3ab654] text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#238636]/15"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-[#8b949e] mt-7">
          New to VimSkillHub?{' '}
          <Link to="/register" className="text-[#58a6ff] hover:text-[#79c0ff] font-medium transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
