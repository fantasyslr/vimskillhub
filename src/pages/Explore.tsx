import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/types'
import type { Skill, SkillCategory, SortOption } from '../lib/types'
import SkillCard from '../components/SkillCard'

const PAGE_SIZE = 12

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'most-stars', label: 'Most Stars' },
  { value: 'most-downloads', label: 'Most Downloads' },
  { value: 'highest-rated', label: 'Highest Rated' },
]

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()

  const initialSearch = searchParams.get('q') ?? ''
  const initialCategory = (searchParams.get('category') ?? '') as
    | SkillCategory
    | ''
  const initialSort = (searchParams.get('sort') ?? 'newest') as SortOption

  const [skills, setSkills] = useState<Skill[]>([])
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState<SkillCategory | ''>(initialCategory)
  const [sort, setSort] = useState<SortOption>(initialSort)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const fetchSkills = useCallback(
    async (pageNum: number, append = false) => {
      if (pageNum === 0) setLoading(true)
      else setLoadingMore(true)

      let query = supabase
        .from('skills')
        .select('*, author:profiles(*)')

      // Search filter
      if (search.trim()) {
        const term = `%${search.trim()}%`
        query = query.or(`title.ilike.${term},description.ilike.${term}`)
      }

      // Category filter
      if (category) {
        query = query.eq('category', category)
      }

      // Sort
      switch (sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'most-stars':
          query = query.order('stars_count', { ascending: false })
          break
        case 'most-downloads':
          query = query.order('downloads_count', { ascending: false })
          break
        case 'highest-rated':
          query = query.order('avg_rating', { ascending: false })
          break
      }

      // Pagination
      const from = pageNum * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      query = query.range(from, to)

      const { data } = await query

      if (data) {
        const typed = data as Skill[]
        if (append) {
          setSkills((prev) => [...prev, ...typed])
        } else {
          setSkills(typed)
        }
        setHasMore(typed.length === PAGE_SIZE)
      }

      setLoading(false)
      setLoadingMore(false)
    },
    [search, category, sort]
  )

  // Sync search params
  useEffect(() => {
    const params: Record<string, string> = {}
    if (search.trim()) params.q = search.trim()
    if (category) params.category = category
    if (sort !== 'newest') params.sort = sort
    setSearchParams(params, { replace: true })
  }, [search, category, sort, setSearchParams])

  // Re-fetch when filters change
  useEffect(() => {
    setPage(0)
    fetchSkills(0)
  }, [fetchSkills])

  function handleLoadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    fetchSkills(nextPage, true)
  }

  // Debounced search
  const [searchInput, setSearchInput] = useState(search)
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-[#e6edf3] mb-6">
        Explore Skills
      </h1>

      {/* Search + Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search skills..."
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 pl-10 pr-3 text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636]"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e] pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="appearance-none bg-[#0d1117] border border-[#30363d] rounded-md py-2 pl-10 pr-8 text-sm text-[#e6edf3] focus:outline-none focus:border-[#238636] focus:ring-1 focus:ring-[#238636] cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory('')}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            category === ''
              ? 'bg-[#238636] border-[#238636] text-white'
              : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#8b949e]'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() =>
              setCategory(category === cat.value ? '' : cat.value)
            }
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              category === cat.value
                ? 'bg-[#238636] border-[#238636] text-white'
                : 'bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#8b949e]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#8b949e] animate-spin" />
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8b949e]">
            No skills found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 bg-[#161b22] border border-[#30363d] text-[#e6edf3] hover:border-[#8b949e] rounded-md px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
