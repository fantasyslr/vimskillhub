import { useState } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface StarButtonProps {
  skillId: string
  initialStarred: boolean
  initialCount: number
}

export default function StarButton({ skillId, initialStarred, initialCount }: StarButtonProps) {
  const { user } = useAuth()
  const [starred, setStarred] = useState(initialStarred)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  async function toggleStar() {
    if (!user) {
      toast.error('Please log in to star skills')
      return
    }

    if (loading) return
    setLoading(true)

    // Optimistic update
    const wasStarred = starred
    const prevCount = count
    setStarred(!wasStarred)
    setCount(wasStarred ? prevCount - 1 : prevCount + 1)

    try {
      if (wasStarred) {
        const { error } = await supabase
          .from('stars')
          .delete()
          .eq('skill_id', skillId)
          .eq('user_id', user.id)

        if (error) throw error

        await supabase
          .from('skills')
          .update({ stars_count: prevCount - 1 })
          .eq('id', skillId)
      } else {
        const { error } = await supabase
          .from('stars')
          .insert({ skill_id: skillId, user_id: user.id })

        if (error) throw error

        await supabase
          .from('skills')
          .update({ stars_count: prevCount + 1 })
          .eq('id', skillId)
      }
    } catch {
      // Revert on failure
      setStarred(wasStarred)
      setCount(prevCount)
      toast.error('Failed to update star')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleStar}
      disabled={loading}
      className={`flex items-center gap-1.5 border rounded-md px-3 py-1.5 text-sm transition-colors ${
        starred
          ? 'border-[#238636] text-[#e6edf3] bg-[#238636]/10'
          : 'border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]'
      } disabled:opacity-50`}
    >
      <Star
        className={`w-4 h-4 ${starred ? 'fill-yellow-400 text-yellow-400' : ''}`}
      />
      <span>{starred ? 'Starred' : 'Star'}</span>
      <span className="border-l border-[#30363d] pl-1.5 ml-0.5">{count}</span>
    </button>
  )
}
