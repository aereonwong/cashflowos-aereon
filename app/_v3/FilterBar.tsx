'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { RANGES, KINDS, type Filters } from '@/lib/v3/filters'

// 👉 The one filter bar every v3 surface uses. It never computes anything: it
// rewrites the URL, and the server redraws the page from it. That keeps every
// filtered view refresh-proof and bookmarkable, and the numbers in one place.

export default function FilterBar({
  filters,
  clients,
  kinds = true,
  clientPicker = true,
  fallback = 'ytd',
}: {
  filters: Filters
  clients: string[]
  kinds?: boolean
  clientPicker?: boolean
  /** The range an empty URL means on this page. */
  fallback?: Filters['range']
}) {
  const router = useRouter()
  const path = usePathname()
  const params = useSearchParams()
  const [pending, start] = useTransition()

  const set = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams(params?.toString())
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === '') p.delete(k)
      else p.set(k, v)
    }
    if (p.get('range') === fallback) p.delete('range')
    if (p.get('range') !== 'custom') {
      p.delete('from')
      p.delete('to')
    }
    const q = p.toString()
    start(() => router.replace(q ? `${path}?${q}` : path, { scroll: false }))
  }

  const active = filters.range !== fallback || !!filters.client || !!filters.kind

  return (
    <div className="v3-filters" data-pending={pending} role="group" aria-label="Filters">
      <div className="v3-seg" role="group" aria-label="Date range">
        {RANGES.map(r => (
          <button
            key={r.id}
            type="button"
            aria-pressed={filters.range === r.id}
            onClick={() =>
              set(
                r.id === 'custom'
                  ? { range: 'custom', from: filters.from, to: filters.to }
                  : { range: r.id },
              )
            }
          >
            {r.label}
          </button>
        ))}
      </div>

      {filters.range === 'custom' ? (
        <>
          <label className="v3-sr">
            <span className="v3-visually-hidden">From</span>
            <input
              className="v3-date"
              type="date"
              value={filters.from}
              onChange={e => set({ range: 'custom', from: e.target.value, to: filters.to })}
              aria-label="From date"
            />
          </label>
          <span aria-hidden="true" style={{ color: 'var(--ink-3)' }}>→</span>
          <input
            className="v3-date"
            type="date"
            value={filters.to}
            onChange={e => set({ range: 'custom', from: filters.from, to: e.target.value })}
            aria-label="To date"
          />
        </>
      ) : null}

      {clientPicker ? <span className="v3-divider" aria-hidden="true" /> : null}

      {clientPicker ? (
      <select
        className="v3-select"
        value={filters.client ?? ''}
        onChange={e => set({ client: e.target.value || undefined })}
        aria-label="Client"
      >
        <option value="">All {clients.length} clients</option>
        {clients.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      ) : null}

      {kinds ? (
        <>
          <span className="v3-divider" aria-hidden="true" />
          {KINDS.map(k => (
            <button
              key={k}
              type="button"
              className="v3-chip"
              aria-pressed={filters.kind === k}
              onClick={() => set({ kind: filters.kind === k ? undefined : k })}
            >
              {k}
            </button>
          ))}
        </>
      ) : null}

      {active ? (
        <button type="button" className="v3-chip v3-clear" onClick={() => start(() => router.replace(path, { scroll: false }))}>
          Clear filters
        </button>
      ) : null}
    </div>
  )
}
