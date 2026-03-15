import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Terminal, ArrowRight, Code2, Users, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Skill } from '../lib/types'
import SkillCard from '../components/SkillCard'

export default function Home() {
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([])
  const [stats, setStats] = useState({ skills: 0, users: 0, downloads: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [skillsRes, featuredRes, usersRes, downloadsRes] =
        await Promise.all([
          supabase
            .from('skills')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('skills')
            .select('*, author:profiles(*)')
            .order('stars_count', { ascending: false })
            .limit(6),
          supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('downloads')
            .select('*', { count: 'exact', head: true }),
        ])

      setStats({
        skills: skillsRes.count ?? 0,
        users: usersRes.count ?? 0,
        downloads: downloadsRes.count ?? 0,
      })

      if (featuredRes.data) {
        setFeaturedSkills(featuredRes.data as Skill[])
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div className="bg-[#0d1117]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#238636]/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center relative">
          <Terminal className="w-16 h-16 text-[#238636] mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#e6edf3] mb-4">
            VimSkillHub
          </h1>
          <p className="text-lg sm:text-xl text-[#8b949e] max-w-2xl mx-auto mb-8">
            Vim Technology's Internal Skill Sharing Platform
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white font-medium px-6 py-3 rounded-lg text-base transition-colors"
          >
            Explore Skills
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[#30363d] bg-[#161b22]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <Code2 className="w-8 h-8 text-[#238636] mx-auto mb-2" />
              <p className="text-3xl font-bold text-[#e6edf3]">
                {loading ? '-' : stats.skills}
              </p>
              <p className="text-sm text-[#8b949e] mt-1">Skills Shared</p>
            </div>
            <div>
              <Users className="w-8 h-8 text-[#238636] mx-auto mb-2" />
              <p className="text-3xl font-bold text-[#e6edf3]">
                {loading ? '-' : stats.users}
              </p>
              <p className="text-sm text-[#8b949e] mt-1">Team Members</p>
            </div>
            <div>
              <Download className="w-8 h-8 text-[#238636] mx-auto mb-2" />
              <p className="text-3xl font-bold text-[#e6edf3]">
                {loading ? '-' : stats.downloads}
              </p>
              <p className="text-sm text-[#8b949e] mt-1">Total Downloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#e6edf3]">
            Featured Skills
          </h2>
          <Link
            to="/explore"
            className="text-sm text-[#58a6ff] hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#161b22] border border-[#30363d] rounded-md p-4 animate-pulse h-40"
              />
            ))}
          </div>
        ) : featuredSkills.length === 0 ? (
          <p className="text-[#8b949e] text-center py-12">
            No skills published yet. Be the first to{' '}
            <Link to="/upload" className="text-[#58a6ff] hover:underline">
              share a skill
            </Link>
            !
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
