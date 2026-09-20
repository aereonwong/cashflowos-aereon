'use client'
import { useState } from 'react'

// 👉 A bar chart you can poke at: hover or tap a bar and the readout above the
// chart tells you what it is, in words. Optional metric switcher (e.g. money vs
// count) flips the whole series without a page load. Pure SVG-free CSS bars, so
// there's no chart library to download.
export type Series = { id: string; label: string; format: (v: number) => string }
export type Point = { label: string; values: Record<string, number>; sub?: string }

export default function InteractiveBars({
  points,
  series,
  initial,
}: {
  points: Point[]
  series: Series[]
  initial?: string
}) {
  const [metric, setMetric] = useState(initial ?? series[0].id)
  const [hover, setHover] = useState<number | null>(null)
  const active = series.find(s => s.id === metric) ?? series[0]
  const values = points.map(p => p.values[metric] ?? 0)
  const max = Math.max(...values, 1)
  const total = values.reduce((s, v) => s + v, 0)
  const shown = hover !== null ? hover : null
  const best = values.indexOf(Math.max(...values))

  return (
    <div className="ibars">
      <div className="ibars-head">
        <div className="ibars-read" aria-live="polite">
          {shown !== null ? (
            <>
              <span className="ir-v">{active.format(values[shown])}</span>
              <span className="ir-l">
                {points[shown].label}
                {points[shown].sub ? ` · ${points[shown].sub}` : ''}
              </span>
            </>
          ) : (
            <>
              <span className="ir-v">{active.format(total)}</span>
              <span className="ir-l">total · best {points[best]?.label}</span>
            </>
          )}
        </div>
        {series.length > 1 ? (
          <div className="seg small">
            {series.map(s => (
              <button key={s.id} type="button" className={metric === s.id ? 'on' : ''} onClick={() => setMetric(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="bars" onMouseLeave={() => setHover(null)}>
        {points.map((p, i) => {
          const v = values[i]
          const pct = Math.max((v / max) * 100, v > 0 ? 4 : 1)
          return (
            <button
              type="button"
              className={`bar-col${hover === i ? ' hot' : ''}${i === best && v > 0 ? ' best' : ''}`}
              key={`${p.label}-${i}`}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onClick={() => setHover(h => (h === i ? null : i))}
              aria-label={`${p.label}: ${active.format(v)}`}
            >
              <span className="bar-val">{v > 0 ? active.format(v) : ''}</span>
              <span className="bar" style={{ height: `${pct}%`, animationDelay: `${i * 45}ms` }} />
              <span className="bar-lab">{p.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
