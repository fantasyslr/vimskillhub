import { useEffect, useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  Download,
  Github,
  Calendar,
  Tag,
  Loader2,
  Send,
  Trash2,
  User,
} from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import type { Skill, Comment } from '../lib/types'

export default function SkillDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { t } = useLang()

  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)

  // Stars
  const [starred, setStarred] = useState(false)
  const [starCount, setStarCount] = useState(0)
  const [starLoading, setStarLoading] = useState(false)

  // Rating
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)

  // Comments
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    fetchSkill()
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!id || !user) return
    checkStar()
    fetchUserRating()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  async function fetchSkill() {
    setLoading(true)
    const { data } = await supabase
      .from('skills')
      .select('*, author:profiles(*)')
      .eq('id', id!)
      .single()

    if (data) {
      const s = data as Skill
      setSkill(s)
      setStarCount(s.stars_count)
      setAvgRating(s.avg_rating)
    }
    setLoading(false)
  }

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, user:profiles(*)')
      .eq('skill_id', id!)
      .order('created_at', { ascending: true })
    if (data) setComments(data as Comment[])
  }

  async function checkStar() {
    const { data } = await supabase
      .from('stars')
      .select('id')
      .eq('skill_id', id!)
      .eq('user_id', user!.id)
      .maybeSingle()
    setStarred(!!data)
  }

  async function fetchUserRating() {
    const { data } = await supabase
      .from('ratings')
      .select('score')
      .eq('skill_id', id!)
      .eq('user_id', user!.id)
      .maybeSingle()
    if (data) setUserRating(data.score)

    // Also get count
    const { count } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true })
      .eq('skill_id', id!)
    setRatingCount(count ?? 0)
  }

  async function toggleStar() {
    if (!user || !id || starLoading) return
    setStarLoading(true)

    if (starred) {
      await supabase
        .from('stars')
        .delete()
        .eq('skill_id', id)
        .eq('user_id', user.id)
      setStarred(false)
      setStarCount((c) => c - 1)
      await supabase
        .from('skills')
        .update({ stars_count: starCount - 1 })
        .eq('id', id)
    } else {
      await supabase
        .from('stars')
        .insert({ skill_id: id, user_id: user.id })
      setStarred(true)
      setStarCount((c) => c + 1)
      await supabase
        .from('skills')
        .update({ stars_count: starCount + 1 })
        .eq('id', id)
    }

    setStarLoading(false)
  }

  async function handleRate(score: number) {
    if (!user || !id) return

    // Upsert rating
    const existing = await supabase
      .from('ratings')
      .select('id')
      .eq('skill_id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing.data) {
      await supabase
        .from('ratings')
        .update({ score })
        .eq('id', existing.data.id)
    } else {
      await supabase
        .from('ratings')
        .insert({ skill_id: id, user_id: user.id, score })
    }

    setUserRating(score)

    // Recalculate average
    const { data: allRatings } = await supabase
      .from('ratings')
      .select('score')
      .eq('skill_id', id)

    if (allRatings && allRatings.length > 0) {
      const avg =
        allRatings.reduce((sum: number, r: { score: number }) => sum + r.score, 0) /
        allRatings.length
      setAvgRating(avg)
      setRatingCount(allRatings.length)
      await supabase.from('skills').update({ avg_rating: avg }).eq('id', id)
    }
  }

  async function handleDownload() {
    if (!skill) return

    // Track download
    await supabase.from('downloads').insert({
      skill_id: skill.id,
      user_id: user?.id ?? null,
    })
    await supabase
      .from('skills')
      .update({ downloads_count: skill.downloads_count + 1 })
      .eq('id', skill.id)
    setSkill((s) => (s ? { ...s, downloads_count: s.downloads_count + 1 } : s))

    // Perform download / open link
    if (skill.file_url) {
      window.open(skill.file_url, '_blank')
    } else if (skill.github_url) {
      window.open(skill.github_url, '_blank')
    }
  }

  async function handleComment(e: FormEvent) {
    e.preventDefault()
    if (!user || !id || !commentText.trim() || commentLoading) return
    setCommentLoading(true)

    await supabase.from('comments').insert({
      skill_id: id,
      user_id: user.id,
      content: commentText.trim(),
    })

    setCommentText('')
    await fetchComments()
    setCommentLoading(false)
  }

  async function handleDeleteComment(commentId: string) {
    await supabase.from('comments').delete().eq('id', commentId)
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-[#8b949e] animate-spin" />
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="text-center py-32">
        <p className="text-[#8b949e]">{t('skill.not_found')}</p>
        <Link to="/explore" className="text-[#58a6ff] hover:underline text-sm mt-2 inline-block">
          {t('skill.back')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#e6edf3]">
                {skill.title}
              </h1>
              <span className="text-xs border border-[#30363d] text-[#8b949e] rounded-full px-2.5 py-0.5">
                {t('cat.' + skill.category)}
              </span>
              <span className="text-xs text-[#8b949e]">v{skill.version}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[#8b949e]">
              {skill.author && (
                <Link
                  to={`/profile/${skill.author_id}`}
                  className="flex items-center gap-1.5 hover:text-[#58a6ff] transition-colors"
                >
                  <User className="w-4 h-4" />
                  {skill.author.display_name}
                </Link>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(skill.created_at), 'MMM d, yyyy')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5 mb-6">
            <p className="text-[#e6edf3] text-sm leading-relaxed mb-4">
              {skill.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {(skill.file_url || skill.github_url) && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {skill.file_url ? t('skill.download_file') : t('skill.get_github')}
                </button>
              )}
              {skill.github_url && (
                <a
                  href={skill.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#161b22] border border-[#30363d] text-[#e6edf3] hover:border-[#8b949e] text-sm font-medium px-4 py-2 rounded-md transition-colors"
                >
                  <Github className="w-4 h-4" />
                  {t('skill.view_github')}
                </a>
              )}
              {user && (
                <button
                  onClick={toggleStar}
                  disabled={starLoading}
                  className={`inline-flex items-center gap-2 border text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    starred
                      ? 'bg-[#388bfd1a] border-[#58a6ff] text-[#58a6ff]'
                      : 'bg-[#161b22] border-[#30363d] text-[#e6edf3] hover:border-[#8b949e]'
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${starred ? 'fill-[#58a6ff]' : ''}`}
                  />
                  {starred ? t('skill.starred') : t('skill.star')}
                  <span className="text-[#8b949e]">{starCount}</span>
                </button>
              )}
            </div>
          </div>

          {/* Long Description (Markdown) */}
          {skill.long_description && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5 mb-6">
              <h2 className="text-lg font-semibold text-[#e6edf3] mb-4">
                {t('skill.documentation')}
              </h2>
              <div className="prose prose-invert prose-sm max-w-none text-[#e6edf3] prose-headings:text-[#e6edf3] prose-a:text-[#58a6ff] prose-code:text-[#e6edf3] prose-code:bg-[#0d1117] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-[#30363d]">
                <ReactMarkdown>{skill.long_description}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Tags */}
          {skill.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#e6edf3] mb-2">{t('skill.tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-[#388bfd1a] text-[#58a6ff] rounded-full px-2.5 py-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5 mb-6">
            <h2 className="text-lg font-semibold text-[#e6edf3] mb-3">
              {t('skill.rating')}
            </h2>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-2xl font-bold text-[#e6edf3]">
                {avgRating > 0 ? avgRating.toFixed(1) : '-'}
              </span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-[#30363d]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#8b949e]">
                ({ratingCount} {ratingCount === 1 ? t('skill.rating_singular') : t('skill.ratings')})
              </span>
            </div>
            {user ? (
              <div>
                <p className="text-sm text-[#8b949e] mb-2">{t('skill.your_rating')}</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => {
                    const score = i + 1
                    return (
                      <button
                        key={score}
                        onClick={() => handleRate(score)}
                        onMouseEnter={() => setHoverRating(score)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            score <= (hoverRating || userRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-[#30363d] hover:text-[#8b949e]'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#8b949e]">
                {t('skill.sign_in_rate')}
              </p>
            )}
          </div>

          {/* Comments */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-5">
            <h2 className="text-lg font-semibold text-[#e6edf3] mb-4">
              {t('skill.comments')} ({comments.length})
            </h2>

            {comments.length === 0 && (
              <p className="text-sm text-[#8b949e] mb-4">
                {t('skill.no_comments')}
              </p>
            )}

            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-[#30363d] rounded-md"
                >
                  <div className="flex items-center justify-between bg-[#0d1117] border-b border-[#30363d] px-4 py-2 rounded-t-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#e6edf3]">
                        {comment.user?.display_name ?? 'User'}
                      </span>
                      <span className="text-xs text-[#8b949e]">
                        {format(new Date(comment.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {user && comment.user_id === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-[#8b949e] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="px-4 py-3 text-sm text-[#e6edf3] whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>

            {user ? (
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t('skill.add_comment')}
                  className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md py-2 px-3 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || commentLoading}
                  className="inline-flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {t('skill.send')}
                </button>
              </form>
            ) : (
              <p className="text-sm text-[#8b949e]">
                {t('skill.sign_in_comment')}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
          {/* Stats Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-md p-4">
            <h3 className="text-sm font-semibold text-[#e6edf3] mb-3">
              {t('skill.stats')}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#8b949e] flex items-center gap-1.5">
                  <Star className="w-4 h-4" /> {t('skill.stars')}
                </span>
                <span className="text-[#e6edf3]">{starCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8b949e] flex items-center gap-1.5">
                  <Download className="w-4 h-4" /> {t('skill.downloads')}
                </span>
                <span className="text-[#e6edf3]">
                  {skill.downloads_count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8b949e]">{t('skill.rating')}</span>
                <span className="text-[#e6edf3] flex items-center gap-1">
                  {'★'} {avgRating > 0 ? avgRating.toFixed(1) : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8b949e]">{t('skill.version')}</span>
                <span className="text-[#e6edf3]">{skill.version}</span>
              </div>
            </div>
          </div>

          {/* Author Card */}
          {skill.author && (
            <Link
              to={`/profile/${skill.author_id}`}
              className="block bg-[#161b22] border border-[#30363d] rounded-md p-4 hover:border-[#8b949e] transition-colors"
            >
              <h3 className="text-sm font-semibold text-[#e6edf3] mb-3">
                {t('skill.author')}
              </h3>
              <div className="flex items-center gap-3">
                {skill.author.avatar_url ? (
                  <img
                    src={skill.author.avatar_url}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#30363d] flex items-center justify-center text-sm text-[#8b949e] font-medium">
                    {skill.author.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[#e6edf3]">
                    {skill.author.display_name}
                  </p>
                  <p className="text-xs text-[#8b949e]">
                    {skill.author.email}
                  </p>
                </div>
              </div>
              {skill.author.bio && (
                <p className="text-xs text-[#8b949e] mt-2 line-clamp-2">
                  {skill.author.bio}
                </p>
              )}
            </Link>
          )}
        </aside>
      </div>
    </div>
  )
}
