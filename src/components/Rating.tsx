import { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingProps {
  skillId: string
  currentRating: number
  userRating: number | null
  onRate: (score: number) => void
}

export default function Rating({ skillId: _skillId, currentRating, userRating, onRate }: RatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const displayRating = hovered ?? userRating ?? 0

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => setHovered(null)}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const value = i + 1
          return (
            <button
              key={value}
              type="button"
              onClick={() => onRate(value)}
              onMouseEnter={() => setHovered(value)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`w-5 h-5 transition-colors ${
                  value <= displayRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-[#30363d] hover:text-yellow-400/50'
                }`}
              />
            </button>
          )
        })}
      </div>
      <span className="text-sm text-[#8b949e]">
        {currentRating.toFixed(1)}
      </span>
      {userRating !== null && (
        <span className="text-xs text-[#8b949e]">
          (Your rating: {userRating})
        </span>
      )}
    </div>
  )
}
