// 👉 A change against the same period last year. `better` says which direction
// is the good one, so a falling client-concentration figure reads as green and a
// falling revenue figure reads as red — the arrow follows the number, the colour
// follows the meaning.

export default function Delta({
  value,
  better = 'up',
  suffix = '%',
  tone = 'auto',
}: {
  /** Percentage change. `null` renders nothing — there was no prior period. */
  value: number | null
  better?: 'up' | 'down'
  suffix?: string
  /** 'auto' colours by meaning; 'plain' stays neutral for pure movement. */
  tone?: 'auto' | 'plain'
}) {
  if (value === null || !isFinite(value)) return null
  const rising = value >= 0
  const good = better === 'up' ? rising : !rising
  const cls = tone === 'plain' ? 'plain' : good ? 'good' : 'bad'
  return (
    <span className={`delta ${cls}`}>
      <svg viewBox="0 0 10 8" width="9" height="7" aria-hidden="true" focusable="false">
        <path d={rising ? 'M5 0 10 8 0 8Z' : 'M5 8 0 0 10 0Z'} fill="currentColor" />
      </svg>
      {Math.abs(value) >= 100 ? Math.round(Math.abs(value)) : Math.abs(value).toFixed(0)}
      {suffix}
      <span className="vh">
        {' '}
        {rising ? 'up' : 'down'} against the year before, which is {good ? 'good' : 'worth watching'}
      </span>
    </span>
  )
}
