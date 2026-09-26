'use client'

import { useState } from 'react'
import type { IgPost } from '@/lib/instagram'
import { compact, num, shortDate } from './fmt'

// Every post placed on the day it went out, raised by the accounts it reached.
// Spikes are the content that travelled; the colour says whether it was a Reel.

const W = 900
const H = 260
const PAD = { l: 50, r: 16, t: 14, b: 30 }

export default function ReachTimeline({ posts }: { posts: IgPost[] }) {
  const [hover, setHover] = useState<IgPost | null>(null)
  const pts = posts.filter(p => p.timestamp && p.reach !== undefined)
  if (pts.length < 2) return <p className="v3-empty">Not enough posts with reach data in this window.</p>

  const times = pts.map(p => Date.parse(p.timestamp))
  const t0 = Math.min(...times)
  const t1 = Math.max(...times)
  const max = Math.max(1, ...pts.map(p => p.reach ?? 0))
  const mag = 10 ** Math.floor(Math.log10(max))
  const top = Math.ceil(max / mag) * mag
  const x = (t: number) => PAD.l + ((t - t0) / Math.max(1, t1 - t0)) * (W - PAD.l - PAD.r)
  const y = (v: number) => H - PAD.b - (v / top) * (H - PAD.t - PAD.b)
  const days = Math.max(1, Math.round((t1 - t0) / 86_400_000))
  const step = days > 60 ? 14 : days > 20 ? 7 : 2
  const ticks: number[] = []
  for (let t = t0; t <= t1; t += step * 86_400_000) ticks.push(t)

  return (
    <div style={{ position: 'relative' }}>
      <svg className="v3-chart v3-reach" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Reach of each post over time" onPointerLeave={() => setHover(null)}>
        <g className="v3-gridlines">
          {[0, 0.5, 1].map(f => (
            <line key={f} x1={PAD.l} x2={W - PAD.r} y1={y(f * top)} y2={y(f * top)} />
          ))}
        </g>
        <g className="axis">
          {[0, 0.5, 1].map(f => (
            <text key={f} x={PAD.l - 8} y={y(f * top) + 4} textAnchor="end">
              {compact(f * top)}
            </text>
          ))}
          {ticks.map(t => (
            <text key={t} x={x(t)} y={H - 8} textAnchor="middle">
              {shortDate(new Date(t).toISOString())}
            </text>
          ))}
        </g>
        {pts.map(p => (
          <g key={p.id}>
            <line className="stem" x1={x(Date.parse(p.timestamp))} x2={x(Date.parse(p.timestamp))} y1={H - PAD.b} y2={y(p.reach ?? 0)} />
            <circle
              className={`pt ${/REEL/i.test(p.type) ? 'reel' : 'feed'}`}
              data-on={hover?.id === p.id}
              cx={x(Date.parse(p.timestamp))}
              cy={y(p.reach ?? 0)}
              r={hover?.id === p.id ? 7 : 5}
              onPointerEnter={() => setHover(p)}
            />
          </g>
        ))}
      </svg>
      {hover ? (
        <div className="v3-tip" style={{ left: `${(x(Date.parse(hover.timestamp)) / W) * 100}%`, top: `${(y(hover.reach ?? 0) / H) * 100}%`, whiteSpace: 'normal', width: 260 }}>
          <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>
            {/REEL/i.test(hover.type) ? 'Reel' : 'Post'} · {shortDate(hover.timestamp)}
          </div>
          <b>{num(hover.reach ?? 0)}</b> reached · {num(hover.likes)} likes
          <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>{hover.caption.slice(0, 90)}</div>
        </div>
      ) : null}
      <div className="v3-legend">
        <span>
          <i className="dot reel" /> Reels
        </span>
        <span>
          <i className="dot feed" /> Posts
        </span>
      </div>
    </div>
  )
}
