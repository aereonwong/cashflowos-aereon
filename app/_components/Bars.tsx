// 👉 A plain vertical bar chart — no chart library, just flexbox and CSS.
// Bars are sized against the biggest value; zero-value months stay visible as a
// hairline so a quiet month reads as quiet, not missing.
export type BarPoint = { label: string; value: number; title?: string; caption?: string }

export default function Bars({ points }: { points: BarPoint[] }) {
  const max = Math.max(...points.map(p => p.value), 1)
  return (
    <div className="bars">
      {points.map((p, i) => (
        <div className="bar-col" key={`${p.label}-${i}`} title={p.title ?? `${p.label}: ${p.value}`}>
          {p.caption ? <span className="bar-val">{p.caption}</span> : null}
          <div className="bar" style={{ height: `${Math.max((p.value / max) * 100, p.value > 0 ? 4 : 0.8)}%` }} />
          <span className="bar-lab">{p.label}</span>
        </div>
      ))}
    </div>
  )
}
