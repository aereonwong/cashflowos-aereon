// 👉 Horizontal ranked bars (top clients, work type, top posts). Each row is
// name · proportional track · value, sized against the biggest row.
export type BarRow = { name: string; value: number; right: string }

export default function RowBars({ rows }: { rows: BarRow[] }) {
  const max = Math.max(...rows.map(r => r.value), 1)
  return (
    <div className="rowbars">
      {rows.map((r, i) => (
        <div className="rowbar" key={`${r.name}-${i}`}>
          <span className="rb-name" title={r.name}>{r.name}</span>
          <span className="rb-track">
            <span className="rb-fill" style={{ width: `${Math.max((r.value / max) * 100, 2)}%` }} />
          </span>
          <span className="rb-val">{r.right}</span>
        </div>
      ))}
    </div>
  )
}
