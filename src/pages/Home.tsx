import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Users, Download, Sparkles, Zap, Share2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Skill } from '../lib/types'
import SkillCard from '../components/SkillCard'
import { useLang } from '../context/LangContext'

export default function Home() {
  const { t } = useLang()
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
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#238636]/8 rounded-full blur-[128px] animate-pulse-glow" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#58a6ff]/6 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#30363d] to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 text-center relative">
          {/* Logo mark */}
          <div className="animate-float mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#238636] to-[#2ea043] shadow-lg shadow-[#238636]/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e6edf3] via-white to-[#8b949e] mb-5 tracking-tight animate-fade-in-up">
            VimSkillHub
          </h1>
          <p className="text-lg sm:text-xl text-[#8b949e] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {t('home.subtitle')}
            <br className="hidden sm:block" />
            <span className="text-[#58a6ff]">Vim Technology</span> & <span className="text-[#58a6ff]">Eazillion</span> internal platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3ab654] text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-[#238636]/20 hover:shadow-[#238636]/30 hover:-translate-y-0.5"
            >
              {t('home.explore')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] text-[#e6edf3] font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5"
            >
              {t('home.share')}
              <Share2 className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-y border-[#30363d]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#238636]/5 via-[#161b22] to-[#58a6ff]/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Code2, value: stats.skills, label: t('home.skills_shared'), color: 'from-[#238636] to-[#2ea043]' },
              { icon: Users, value: stats.users, label: t('home.team_members'), color: 'from-[#58a6ff] to-[#388bfd]' },
              { icon: Download, value: stats.downloads, label: t('home.total_downloads'), color: 'from-[#a371f7] to-[#8957e5]' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity mb-3" style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color.split(' ')[0].replace('from-[', '').replace(']', '')}, ${stat.color.split(' ')[1].replace('to-[', '').replace(']', '')})` }}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl font-bold text-[#e6edf3] mb-1">
                  {loading ? (
                    <span className="inline-block w-10 h-8 bg-[#30363d] rounded animate-pulse" />
                  ) : stat.value}
                </p>
                <p className="text-sm text-[#8b949e]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#e6edf3] mb-3">{t('home.how_it_works')}</h2>
          <p className="text-[#8b949e] max-w-xl mx-auto">{t('home.how_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Share2, title: t('home.step1_title'), desc: t('home.step1_desc'), step: '01' },
            { icon: Sparkles, title: t('home.step2_title'), desc: t('home.step2_desc'), step: '02' },
            { icon: Zap, title: t('home.step3_title'), desc: t('home.step3_desc'), step: '03' },
          ].map((item, i) => (
            <div
              key={i}
              className="relative bg-[#161b22] border border-[#30363d] rounded-2xl p-7 hover:border-[#58a6ff]/40 transition-all duration-300 group gradient-border"
            >
              <span className="absolute top-5 right-6 text-5xl font-black text-[#30363d]/50 group-hover:text-[#58a6ff]/10 transition-colors select-none">
                {item.step}
              </span>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#238636]/10 mb-5 group-hover:bg-[#238636]/20 transition-colors">
                <item.icon className="w-6 h-6 text-[#238636]" />
              </div>
              <h3 className="text-lg font-semibold text-[#e6edf3] mb-2">{item.title}</h3>
              <p className="text-sm text-[#8b949e] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#e6edf3]">{t('home.featured')}</h2>
            <p className="text-sm text-[#8b949e] mt-1">{t('home.featured_sub')}</p>
          </div>
          <Link
            to="/explore"
            className="text-sm text-[#58a6ff] hover:text-[#79c0ff] flex items-center gap-1 transition-colors"
          >
            {t('home.view_all')}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 animate-pulse h-44"
              />
            ))}
          </div>
        ) : featuredSkills.length === 0 ? (
          <div className="text-center py-16 bg-[#161b22] border border-[#30363d] rounded-2xl">
            <Sparkles className="w-10 h-10 text-[#30363d] mx-auto mb-4" />
            <p className="text-[#8b949e] mb-3">{t('home.no_skills')}</p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 text-sm text-[#58a6ff] hover:text-[#79c0ff] transition-colors"
            >
              {t('home.be_first')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
