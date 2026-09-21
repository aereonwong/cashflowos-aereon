'use client'
import { useState } from 'react'

// 👉 Two years of invoicing, month by month, gaps included. The point of this
// chart is the gaps: a month with no column is a month nothing was billed, and
// seeing them in a row is the fastest way to spot batched or forgotten invoices.

export type Cell = { month: string; label: string; year: string; total: number; count: number }

const rm = (n: number) => `RM ${Math.round(n).toLocaleString('en-MY')}`

export default function Rhythm({ cells }: { cells: Cell[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const tallest = Math.max(...cells.map(c => c.total), 1)
  const busiest = cells.reduce((best, c, i) => (c.total > cells[best].total ? i : best), 0)
  const shown = hover !== null ? cells[hover] : null
  // The last cell is the month we are standing in — it is not finished, so it
  // cannot count as a month that went unbilled.
  const completed = cells.slice(0, -1)
  const empty = completed.filter(c => c.count === 0).length

  return (
    <div className="rhy">
      <p className="rhy-read" aria-live="polite">
        {shown ? (
          shown.count ? (
            <>
              <strong>
                {shown.label} {shown.year}
              </strong>{' '}
              — {rm(shown.total)} across {shown.count} invoice{shown.count === 1 ? '' : 's'}
            </>
          ) : (
            <>
              <strong>
                {shown.label} {shown.year}
              </strong>{' '}
              — nothing invoiced this month
            </>
          )
        ) : (
          <>
            {empty} of the {completed.length} completed months had no invoice raised. Biggest was{' '}
            {cells[busiest].label} {cells[busiest].year} at {rm(cells[busiest].total)}.
          </>
        )}
      </p>

      <div className="rhy-plot">
        {cells.map((c, i) => (
          <button
            type="button"
            key={c.month}
            className={`rhy-col${c.count === 0 ? ' none' : ''}${hover === i ? ' on' : ''}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onBlur={() => setHover(null)}
            aria-label={`${c.label} ${c.year}: ${c.count ? `${rm(c.total)}, ${c.count} invoices` : 'no invoices'}`}
          >
            <span className="rhy-bar" style={{ height: `${Math.max((c.total / tallest) * 100, c.count ? 2 : 0)}%` }} />
          </button>
        ))}
      </div>

      <div className="rhy-axis" aria-hidden="true">
        {cells.map((c, i) => (
          <span key={c.month} className={c.label === 'Jan' || i === 0 ? 'mark' : ''}>
            {c.label === 'Jan' || i === 0 ? (c.label === 'Jan' ? c.year : `${c.label} ${c.year}`) : ''}
          </span>
        ))}
      </div>
    </div>
  )
}
