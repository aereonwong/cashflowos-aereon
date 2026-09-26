'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

// Instagram's own filters: how far back, and which format. Same URL-driven
// pattern as the business filter bar.
const WINDOWS = [
  { id: '7', label: '7 days' },
  { id: '30', label: '30 days' },
  { id: '90', label: '90 days' },
  { id: 'all', label: 'All stored posts' },
]
const TYPES = [
  { id: '', label: 'Everything' },
  { id: 'REELS', label: 'Reels' },
  { id: 'FEED', label: 'Posts' },
]

export default function IgFilters({ days, type }: { days: string; type: string }) {
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
      <div className="v3-seg" role="group" aria-label="Time window">
        {WINDOWS.map(w => (
          <button key={w.id} type="button" aria-pressed={days === w.id} onClick={() => set('days', w.id)}>
            {w.label}
          </button>
        ))}
      </div>
      <span className="v3-divider" aria-hidden="true" />
      <div className="v3-seg" role="group" aria-label="Format">
        {TYPES.map(t => (
          <button key={t.id || 'all'} type="button" aria-pressed={type === t.id} onClick={() => set('type', t.id)}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
