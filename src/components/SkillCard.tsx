import { Link } from 'react-router-dom'
import { Star, Download, User } from 'lucide-react'
import type { Skill } from '../lib/types'
import { CATEGORIES } from '../lib/types'

interface SkillCardProps {
  skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
  const categoryLabel =
    CATEGORIES.find((c) => c.value === skill.category)?.label ?? skill.category

  const truncatedDescription =
    skill.description.length > 120
      ? skill.description.slice(0, 120) + '...'
      : skill.description

  return (
    <Link
      to={`/skill/${skill.id}`}
      className="group block bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-[#58a6ff]/40 transition-all duration-300 gradient-border animate-fade-in-up hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#58a6ff]/5"
    >
      {/* Header: Title + Category */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-[#58a6ff] group-hover:text-[#79c0ff] transition-colors truncate">
          {skill.title}
        </h3>
        <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider border border-[#30363d] text-[#8b949e] rounded-full px-2.5 py-0.5 bg-[#0d1117]">
          {categoryLabel}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-[#8b949e] mb-4 leading-relaxed line-clamp-2">
        {truncatedDescription}
      </p>

      {/* Tags */}
      {skill.tags && skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-[#388bfd]/10 text-[#58a6ff] rounded-md px-2 py-0.5 font-medium"
            >
              {tag}
            </span>
          ))}
          {skill.tags.length > 4 && (
            <span className="text-[11px] text-[#484f58] py-0.5">
              +{skill.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#30363d]/50">
        {/* Author */}
        <div className="flex items-center gap-1.5 text-xs text-[#8b949e]">
          {skill.author?.avatar_url ? (
            <img src={skill.author.avatar_url} alt="" className="w-4 h-4 rounded-full" />
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
          <span className="truncate max-w-[100px]">{skill.author?.display_name ?? 'Unknown'}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-[#8b949e]">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500/70" />
            {skill.stars_count}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-[#238636]/70" />
            {skill.downloads_count}
          </span>
          {skill.avg_rating > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-yellow-500">{'★'}</span>
              {skill.avg_rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
