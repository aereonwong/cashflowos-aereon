'use client'
import { useState } from 'react'

// 👉 A smooth area chart with a moving marker: hover anywhere and it snaps to the
// nearest point and reports it. Inline SVG with a gradient fill, drawn from the
// active palette, so it restyles itself with the theme.
export type AreaPoint = { label: string; value: number; sub?: string }

export default function AreaChart({
  points,
  format = (v: number) => Math.round(v).toLocaleString('en-MY'),
  caption,
}: {
  points: AreaPoint[]
  format?: (v: number) => string
  caption?: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 720
  const H = 220
  const PAD = 26
  const max = Math.max(...points.map(p => p.value), 1)
  const step = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : 0
  const xy = points.map((p, i) => ({
    x: PAD + i * step,
    y: H - PAD - (p.value / max) * (H - PAD * 2),
  }))

  // Catmull-Rom-ish smoothing: each segment gets control points halfway across.
  const path = xy
    .map((p, i, a) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = a[i - 1]
      const cx = (prev.x + p.x) / 2
      return `C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`
    })
    .join(' ')
  const area = `${path} L ${xy[xy.length - 1]?.x ?? PAD} ${H - PAD} L ${xy[0]?.x ?? PAD} ${H - PAD} Z`
  const active = hover !== null ? hover : xy.length - 1

  return (
    <div className="areac">
      <div className="ibars-head">
        <div className="ibars-read">
          <span className="ir-v">{format(points[active]?.value ?? 0)}</span>
          <span className="ir-l">
            {points[active]?.label}
            {points[active]?.sub ? ` · ${points[active].sub}` : ''}
          </span>
        </div>
        {caption ? <span className="areac-cap">{caption}</span> : null}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="areac-svg" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="areaLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1={PAD} x2={W - PAD} y1={PAD + (H - PAD * 2) * f} y2={PAD + (H - PAD * 2) * f} className="areac-grid" />
        ))}

        <path d={area} fill="url(#areaFill)" className="areac-area" />
        <path d={path} fill="none" stroke="url(#areaLine)" strokeWidth="2.5" className="areac-line" />

        {xy.map((p, i) => (
          <g key={points[i].label}>
            <circle cx={p.x} cy={p.y} r={i === active ? 6 : 3.5} className={`areac-dot${i === active ? ' hot' : ''}`} />
            <rect
              x={p.x - step / 2}
              y={0}
              width={step || W}
              height={H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
            <text x={p.x} y={H - 6} className="areac-lab">
              {points[i].label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
