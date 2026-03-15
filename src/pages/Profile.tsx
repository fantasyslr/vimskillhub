import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import {
  User,
  Calendar,
  Star,
  Download,
  Code2,
  Loader2,
  Save,
  AlertCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import type { Profile as ProfileType, Skill } from '../lib/types'
import SkillCard from '../components/SkillCard'

export default function Profile() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { t } = useLang()

  const isOwnProfile = !id || id === user?.id

  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  // Stats
  const [totalStars, setTotalStars] = useState(0)
  const [totalDownloads, setTotalDownloads] = useState(0)

  // Edit form
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  async function fetchProfileData() {
    setLoading(true)

    const profileId = isOwnProfile ? user?.id : id
    if (!profileId) {
      setLoading(false)
      return
    }

    // Fetch profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single()

    if (profileData) {
      setProfile(profileData)
      setDisplayName(profileData.display_name)
      setBio(profileData.bio ?? '')
      setAvatarUrl(profileData.avatar_url ?? '')
    }

    // Fetch user's skills
    const { data: skillsData } = await supabase
      .from('skills')
      .select('*, author:profiles(*)')
      .eq('author_id', profileId)
      .order('created_at', { ascending: false })

    if (skillsData) {
      const typed = skillsData as Skill[]
      setSkills(typed)
      setTotalStars(typed.reduce((sum, s) => sum + s.stars_count, 0))
      setTotalDownloads(typed.reduce((sum, s) => sum + s.downloads_count, 0))
    }

    setLoading(false)
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault()
    setSaveError('')

    if (!displayName.trim()) {
      setSaveError(t('profile.name_required'))
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        })
        .eq('id', user!.id)

      if (error) throw error

      setProfile((p) =>
        p
          ? {
              ...p,
              display_name: displayName.trim(),
              bio: bio.trim() || null,
              avatar_url: avatarUrl.trim() || null,
            }
          : p
      )
      setEditing(false)
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Failed to update profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-[#8b949e] animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-32">
        <p className="text-[#8b949e]">{t('profile.not_found')}</p>
      </div>
    )
  }

  const inputClasses =
    'w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 px-3 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-24 h-24 rounded-full border-2 border-[#30363d]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#30363d] flex items-center justify-center">
                  <User className="w-10 h-10 text-[#8b949e]" />
                </div>
              )}
            </div>

            {/* Info */}
            <h1 className="text-lg font-bold text-[#e6edf3] text-center">
              {profile.display_name}
            </h1>
            <p className="text-sm text-[#8b949e] text-center mb-3">
              {profile.email}
            </p>
            {profile.bio && (
              <p className="text-sm text-[#8b949e] text-center mb-3">
                {profile.bio}
              </p>
            )}
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#8b949e]">
              <Calendar className="w-3.5 h-3.5" />
              Joined {format(new Date(profile.created_at), 'MMM yyyy')}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-[#30363d]">
              <div className="text-center">
                <Code2 className="w-4 h-4 text-[#8b949e] mx-auto mb-1" />
                <p className="text-sm font-semibold text-[#e6edf3]">
                  {skills.length}
                </p>
                <p className="text-xs text-[#8b949e]">{t('profile.skills')}</p>
              </div>
              <div className="text-center">
                <Star className="w-4 h-4 text-[#8b949e] mx-auto mb-1" />
                <p className="text-sm font-semibold text-[#e6edf3]">
                  {totalStars}
                </p>
                <p className="text-xs text-[#8b949e]">{t('skill.stars')}</p>
              </div>
              <div className="text-center">
                <Download className="w-4 h-4 text-[#8b949e] mx-auto mb-1" />
                <p className="text-sm font-semibold text-[#e6edf3]">
                  {totalDownloads}
                </p>
                <p className="text-xs text-[#8b949e]">{t('skill.downloads')}</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            {isOwnProfile && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="w-full mt-5 bg-[#161b22] border border-[#30363d] text-[#e6edf3] hover:border-[#8b949e] rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                {t('profile.edit')}
              </button>
            )}
          </div>

          {/* Edit Form */}
          {isOwnProfile && editing && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-[#161b22] border border-[#30363d] rounded-md p-5 mt-4 space-y-4"
            >
              <h3 className="text-sm font-semibold text-[#e6edf3]">
                {t('profile.edit')}
              </h3>

              {saveError && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#8b949e] mb-1">
                  {t('profile.name_label')}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8b949e] mb-1">
                  {t('profile.bio_label')}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className={inputClasses + ' resize-y'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8b949e] mb-1">
                  {t('profile.avatar_label')}
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className={inputClasses}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {t('profile.save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false)
                    setDisplayName(profile.display_name)
                    setBio(profile.bio ?? '')
                    setAvatarUrl(profile.avatar_url ?? '')
                    setSaveError('')
                  }}
                  className="px-4 py-2 border border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#8b949e] rounded-md text-sm transition-colors"
                >
                  {t('profile.cancel')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-[#e6edf3] mb-4">
            {isOwnProfile ? t('profile.my_skills') : profile.display_name + t('profile.user_skills')}
          </h2>

          {skills.length === 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-8 text-center">
              <p className="text-[#8b949e]">
                {isOwnProfile
                  ? t('profile.no_skills_own')
                  : t('profile.no_skills_other')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
