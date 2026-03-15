import { Link } from 'react-router-dom'
import { Star, Download } from 'lucide-react'
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

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.round(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-[#30363d]'
        }`}
      />
    ))
  }

  return (
    <Link
      to={`/skill/${skill.id}`}
      className="block bg-[#161b22] border border-[#30363d] rounded-md p-4 hover:border-[#8b949e] transition-colors group"
    >
      {/* Title + Category */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold text-[#58a6ff] group-hover:underline truncate">
          {skill.title}
        </h3>
        <span className="shrink-0 text-xs border border-[#30363d] text-[#8b949e] rounded-full px-2 py-0.5">
          {categoryLabel}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-[#8b949e] mb-3 leading-relaxed">
        {truncatedDescription}
      </p>

      {/* Tags */}
      {skill.tags && skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {skill.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[#388bfd26] text-[#58a6ff] rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center gap-4 text-xs text-[#8b949e]">
        {skill.author?.display_name && (
          <span>{skill.author.display_name}</span>
        )}

        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" />
          {skill.stars_count}
        </span>

        <span className="flex items-center gap-1">
          <Download className="w-3.5 h-3.5" />
          {skill.downloads_count}
        </span>

        <span className="flex items-center gap-0.5">
          {renderStars(skill.avg_rating)}
          <span className="ml-1">{skill.avg_rating.toFixed(1)}</span>
        </span>
      </div>
    </Link>
  )
}
