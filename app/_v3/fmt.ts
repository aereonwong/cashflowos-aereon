// Number formatting shared by every v3 surface. Ringgit is the only currency
// that is ever summed; other currencies are shown as themselves.

export const rmFull = (n: number) => 'RM ' + Math.round(n).toLocaleString('en-MY')
export const num = (n: number) => Math.round(n).toLocaleString('en-MY')

/** 149,734 → "149.7K"; 1,203,000 → "1.2M". For tight spaces only. */
export function compact(n: number): string {
  const a = Math.abs(n)
  if (a >= 1_000_000) return (n / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1).replace(/\.0$/, '') + 'M'
  if (a >= 1_000) return (n / 1_000).toFixed(a >= 100_000 ? 0 : 1).replace(/\.0$/, '') + 'K'
  return String(Math.round(n))
}

export const money = (n: number, currency = 'MYR') =>
  currency === 'MYR' ? rmFull(n) : `${currency} ${Math.round(n).toLocaleString('en-MY')}`

export const pct = (n: number | null, digits = 0) =>
  n === null || !Number.isFinite(n) ? '—' : `${n > 0 ? '+' : ''}${n.toFixed(digits)}%`

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** 2026-09-22 → "22 Sep 2026" */
export const longDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return y && m && d ? `${d} ${MONTHS[m - 1]} ${y}` : iso
}
/** 2026-09-22 → "22 Sep" */
export const shortDate = (iso: string) => longDate(iso).replace(/ \d{4}$/, '')
