'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import type { MonthBar } from '@/lib/v3/ledger'
import { rmFull, compact } from './fmt'

// Invoiced per month across the chosen range. Clicking a bar narrows the whole
// page to that month — the crossfilter every v3 world shares here.

const W = 900
const H = 220
const PAD = { l: 48, r: 8, t: 12, b: 30 }

export default function Bars({ months }: { months: MonthBar[] }) {
  const router = useRouter()
  const path = usePathname()
  const params = useSearchParams()
  const [, start] = useTransition()
  const [hover, setHover] = useState<number | null>(null)
  const ref = useRef<SVGSVGElement>(null)

  if (!months.length) return <p className="v3-empty">No ringgit invoices in this range.</p>

  const max = Math.max(1, ...months.map(m => m.total))
  const mag = 10 ** Math.floor(Math.log10(max))
  const top = Math.ceil(max / mag) * mag
  const band = (W - PAD.l - PAD.r) / months.length
  const bw = Math.max(2, band * 0.72)
  const y = (v: number) => H - PAD.b - (v / top) * (H - PAD.t - PAD.b)
  const every = Math.max(1, Math.ceil(months.length / 12))

  const pick = (m: MonthBar) => {
    const [yy, mm] = m.key.split('-').map(Number)
    const last = new Date(Date.UTC(yy, mm, 0)).getUTCDate()
    const p = new URLSearchParams(params?.toString())
    p.set('range', 'custom')
    p.set('from', `${m.key}-01`)
    p.set('to', `${m.key}-${String(last).padStart(2, '0')}`)
    start(() => router.replace(`${path}?${p.toString()}`, { scroll: false }))
  }

  const h = hover === null ? null : months[hover]
  return (
    <div style={{ position: 'relative' }}>
      <svg ref={ref} className="v3-chart v3-bars" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ringgit invoiced per month" onPointerLeave={() => setHover(null)}>
        <g className="v3-gridlines">
          {[0, 0.5, 1].map(t => (
            <line key={t} x1={PAD.l} x2={W - PAD.r} y1={y(t * top)} y2={y(t * top)} />
          ))}
        </g>
        <g className="axis">
          {[0, 0.5, 1].map(t => (
            <text key={t} x={PAD.l - 8} y={y(t * top) + 4} textAnchor="end">
              {compact(t * top)}
            </text>
          ))}
          {months.map((m, i) =>
            i % every === 0 ? (
              <text key={m.key} x={PAD.l + band * i + band / 2} y={H - 10} textAnchor="middle">
                {m.label}
              </text>
            ) : null,
          )}
        </g>
        {months.map((m, i) => (
          <g key={m.key}>
            <rect
              className="v3-bar"
              data-on={hover === i}
              x={PAD.l + band * i + (band - bw) / 2}
              y={y(m.total)}
              width={bw}
              height={Math.max(m.total ? 1.5 : 0, H - PAD.b - y(m.total))}
            />
            <rect
              className="hit"
              x={PAD.l + band * i}
              y={PAD.t}
              width={band}
              height={H - PAD.t - PAD.b}
              onPointerEnter={() => setHover(i)}
              onClick={() => m.count && pick(m)}
              style={{ cursor: m.count ? 'pointer' : 'default' }}
            >
              <title>{`${m.label}: ${rmFull(m.total)}`}</title>
            </rect>
          </g>
        ))}
      </svg>
      {h ? (
        <div className="v3-tip" style={{ left: `${((PAD.l + band * hover! + band / 2) / W) * 100}%`, top: `${(y(h.total) / H) * 100}%` }}>
          <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>{h.label}</div>
          <b>{rmFull(h.total)}</b> · {h.count} invoice{h.count === 1 ? '' : 's'}
          {h.count ? <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>Click to filter to this month</div> : null}
        </div>
      ) : null}
    </div>
  )
}
