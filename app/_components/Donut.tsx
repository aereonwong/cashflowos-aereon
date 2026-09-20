'use client'
import { useState } from 'react'

// 👉 A donut you can hover: each slice lights up and the middle tells you what
// you're looking at. Drawn with one SVG circle per slice using stroke-dasharray,
// so it animates in with no library.
export type Slice = { label: string; value: number; format?: (v: number) => string }

const COLORS = [
  'var(--accent)',
  'var(--accent-2)',
  'color-mix(in srgb, var(--accent) 55%, white)',
  'color-mix(in srgb, var(--accent-2) 55%, black)',
  'color-mix(in srgb, var(--accent) 35%, var(--accent-2))',
  'color-mix(in srgb, var(--accent-2) 30%, white)',
]

export default function Donut({
  slices,
  centerLabel,
  format = (v: number) => String(Math.round(v)),
}: {
  slices: Slice[]
  centerLabel: string
  format?: (v: number) => string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  const R = 54
  const C = 2 * Math.PI * R
  let offset = 0

  const shown = hover !== null ? slices[hover] : null
  const shownPct = shown ? (shown.value / total) * 100 : 100

  return (
    <div className="donut-wrap">
      <div className="donut" onMouseLeave={() => setHover(null)}>
        <svg viewBox="0 0 140 140" role="img" aria-label={centerLabel}>
          <circle cx="70" cy="70" r={R} className="donut-track" />
          {slices.map((s, i) => {
            const len = (s.value / total) * C
            const dash = `${len} ${C - len}`
            const rot = (offset / C) * 360 - 90
            offset += len
            return (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={R}
                className={`donut-seg${hover === i ? ' hot' : ''}${hover !== null && hover !== i ? ' dim' : ''}`}
                style={{
                  stroke: COLORS[i % COLORS.length],
                  strokeDasharray: dash,
                  transform: `rotate(${rot}deg)`,
                  transformOrigin: '70px 70px',
                  animationDelay: `${i * 70}ms`,
                }}
                onMouseEnter={() => setHover(i)}
              />
            )
          })}
        </svg>
        <div className="donut-mid">
          <span className="dm-v">{shown ? format(shown.value) : format(total)}</span>
          <span className="dm-l">{shown ? `${shown.label} · ${shownPct.toFixed(0)}%` : centerLabel}</span>
        </div>
      </div>

      <ul className="donut-key">
        {slices.map((s, i) => (
          <li
            key={s.label}
            className={hover === i ? 'hot' : ''}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="dk-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="dk-l">{s.label}</span>
            <span className="dk-v">{(s.format ?? format)(s.value)}</span>
            <span className="dk-p">{((s.value / total) * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
