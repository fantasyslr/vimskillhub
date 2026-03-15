import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Upload as UploadIcon, AlertCircle, Loader2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../lib/types'
import type { SkillCategory } from '../lib/types'

export default function Upload() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [longDescription, setLongDescription] = useState('')
  const [category, setCategory] = useState<SkillCategory | ''>('')
  const [tagsInput, setTagsInput] = useState('')
  const [version, setVersion] = useState('1.0.0')
  const [githubUrl, setGithubUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-[#8b949e] animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    // Validation
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    if (!description.trim()) {
      setError('Description is required.')
      return
    }
    if (!category) {
      setError('Category is required.')
      return
    }

    setSubmitting(true)

    try {
      let fileUrl: string | null = null
      let fileName: string | null = null

      // Upload file to Supabase storage
      if (file) {
        const ext = file.name.split('.').pop()
        const filePath = `${user!.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('skill-files')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('skill-files')
          .getPublicUrl(filePath)

        fileUrl = urlData.publicUrl
        fileName = file.name
      }

      // Parse tags
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      // Insert skill
      const { data, error: insertError } = await supabase
        .from('skills')
        .insert({
          author_id: user!.id,
          title: title.trim(),
          description: description.trim(),
          long_description: longDescription.trim() || null,
          category,
          tags,
          version: version.trim() || '1.0.0',
          github_url: githubUrl.trim() || null,
          file_url: fileUrl,
          file_name: fileName,
        })
        .select('id')
        .single()

      if (insertError) throw insertError

      navigate(`/skill/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish skill.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClasses =
    'w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 px-3 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <UploadIcon className="w-8 h-8 text-[#238636]" />
        <div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">
            Publish a Skill
          </h1>
          <p className="text-sm text-[#8b949e]">
            Share your work with the team
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 space-y-5"
      >
        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-md p-3 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#e6edf3] mb-1.5"
          >
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Skill"
            className={inputClasses}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#e6edf3] mb-1.5"
          >
            Short Description <span className="text-red-400">*</span>
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief summary of what this skill does"
            className={inputClasses}
          />
        </div>

        {/* Long Description */}
        <div>
          <label
            htmlFor="long-description"
            className="block text-sm font-medium text-[#e6edf3] mb-1.5"
          >
            Documentation{' '}
            <span className="text-xs text-[#8b949e]">(Markdown supported)</span>
          </label>
          <textarea
            id="long-description"
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            placeholder="Detailed description, usage instructions, examples..."
            rows={8}
            className={inputClasses + ' resize-y'}
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-[#e6edf3] mb-1.5"
          >
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as SkillCategory)}
            className={inputClasses + ' cursor-pointer'}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-[#e6edf3] mb-1.5"
          >
            Tags{' '}
            <span className="text-xs text-[#8b949e]">(comma separated)</span>
          </label>
          <input
            id="tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="react, api, automation"
            className={inputClasses}
          />
        </div>

        {/* Version */}
        <div>
          <label
            htmlFor="version"
            className="block text-sm font-medium text-[#e6edf3] mb-1.5"
          >
            Version
          </label>
          <input
            id="version"
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.0"
            className={inputClasses}
          />
        </div>

        {/* GitHub URL */}
        <div>
          <label
            htmlFor="github-url"
            className="block text-sm font-medium text-[#e6edf3] mb-1.5"
          >
            GitHub URL{' '}
            <span className="text-xs text-[#8b949e]">(optional)</span>
          </label>
          <input
            id="github-url"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className={inputClasses}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">
            File Upload{' '}
            <span className="text-xs text-[#8b949e]">(optional)</span>
          </label>
          {file ? (
            <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2">
              <span className="text-sm text-[#e6edf3] truncate flex-1">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-[#8b949e] hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-[#8b949e] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-[#30363d] file:text-sm file:font-medium file:bg-[#0d1117] file:text-[#e6edf3] hover:file:border-[#8b949e] file:cursor-pointer file:transition-colors"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-medium py-2.5 px-4 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <UploadIcon className="w-4 h-4" />
              Publish Skill
            </>
          )}
        </button>
      </form>
    </div>
  )
}
