import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Send } from 'lucide-react'
import type { Comment } from '../lib/types'

interface CommentsProps {
  skillId: string
}

export default function Comments({ skillId }: CommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [skillId])

  async function fetchComments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles(*)')
      .eq('skill_id', skillId)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load comments')
    } else {
      setComments(data ?? [])
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user) {
      toast.error('Please log in to comment')
      return
    }

    const content = newComment.trim()
    if (!content) return

    setSubmitting(true)
    const { error } = await supabase
      .from('comments')
      .insert({ skill_id: skillId, user_id: user.id, content })

    if (error) {
      toast.error('Failed to post comment')
    } else {
      toast.success('Comment posted')
      setNewComment('')
      fetchComments()
    }
    setSubmitting(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-[#e6edf3]">
        <MessageSquare className="w-5 h-5" />
        Comments
        <span className="text-sm font-normal text-[#8b949e]">({comments.length})</span>
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Leave a comment..."
            rows={3}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-[#8b949e] border border-[#30363d] rounded-md p-3 bg-[#161b22]">
          Please log in to leave a comment.
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <p className="text-sm text-[#8b949e]">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[#8b949e]">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-[#161b22] border border-[#30363d] rounded-md p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-[#e6edf3]">
                  {comment.user?.display_name ?? 'Unknown user'}
                </span>
                <span className="text-xs text-[#484f58]">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-[#8b949e] whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
