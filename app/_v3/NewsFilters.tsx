'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { SECTIONS } from '@/lib/news-catalog'
import Search from './Search'

// News filters: section, source website, how far back, and a search. All in
// the URL, like every other v3 filter, so the digest history stays browsable.
const WINDOWS = [
  { id: '7', label: '7 days' },
  { id: '30', label: '30 days' },
  { id: '90', label: '90 days' },
  { id: 'all', label: 'All' },
]

export default function NewsFilters({
  section,
  source,
  days,
  sources,
}: {
  section: string
  source: string
  days: string
  sources: { source: string; count: number }[]
}) {
  const router = useRouter()
  const path = usePathname()
  const params = useSearchParams()
  const [pending, start] = useTransition()
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params?.toString())
    if (!v || (k === 'days' && v === '30')) p.delete(k)
    else p.set(k, v)
    const q = p.toString()
    start(() => router.replace(q ? `${path}?${q}` : path, { scroll: false }))
  }
  return (
    <div className="v3-filters" data-pending={pending} role="group" aria-label="Filters">
      <div className="v3-seg" role="group" aria-label="Section">
        <button type="button" aria-pressed={!section} onClick={() => set('section', '')}>
          Everything
        </button>
        {SECTIONS.map(s => (
          <button key={s.id} type="button" aria-pressed={section === s.id} onClick={() => set('section', s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <span className="v3-divider" aria-hidden="true" />
      <div className="v3-seg" role="group" aria-label="Time window">
        {WINDOWS.map(w => (
          <button key={w.id} type="button" aria-pressed={days === w.id} onClick={() => set('days', w.id)}>
            {w.label}
          </button>
        ))}
      </div>
      {sources.length ? (
        <>
          <span className="v3-divider" aria-hidden="true" />
          <select className="v3-select" value={source} onChange={e => set('source', e.target.value)} aria-label="Source website">
            <option value="">All {sources.length} sources</option>
            {sources.map(s => (
              <option key={s.source} value={s.source}>
                {s.source} ({s.count})
              </option>
            ))}
          </select>
        </>
      ) : null}
      <span className="v3-divider" aria-hidden="true" />
      <Search placeholder="Search the news" />
    </div>
  )
}
