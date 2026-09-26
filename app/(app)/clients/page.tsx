// 👉 Clients — one row per company you've invoiced, rolled up from the invoices
// themselves (not typed by hand). Sorted by how much they're worth to you.
import { getRecords, rm } from '@/lib/records'
import { summarize } from '@/lib/invoices'
import Stat from '@/app/_components/Stat'
import Empty from '@/app/_components/Empty'

import V3Clients from '@/app/_v3/pages/Clients'
import { readVersion } from '@/lib/v3/version'
import { parseFilters } from '@/lib/v3/filters'

export const dynamic = 'force-dynamic'

const monthsBetween = (iso: string) =>
  Math.floor((Date.now() - Date.parse(`${iso}T00:00:00Z`)) / (1000 * 60 * 60 * 24 * 30.4))

export default async function Clients({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { version } = await readVersion()
  if (version === 'v3') {
    const [rows, sp] = await Promise.all([getRecords(), searchParams])
    return <V3Clients rows={rows} filters={parseFilters(sp, undefined, 'all')} sp={sp} />
  }
  const rows = await getRecords()
  const s = summarize(rows)

  if (s.clients.length === 0) {
    return (
      <>
        <h1 className="ph">Clients 🤝</h1>
        <p className="cap">Everyone you've invoiced — value, jobs, and when you last worked together.</p>
        <Empty label="clients" />
      </>
    )
  }

  // "Gone quiet" = no invoice in 3+ months. A nudge list, not a judgement.
  const quiet = s.clients.filter(c => monthsBetween(c.last) >= 3)

  return (
    <>
      <h1 className="ph">Clients 🤝</h1>
      <p className="cap">Everyone you've invoiced — value, jobs, and when you last worked together.</p>

      <div className="grid">
        <Stat label="Clients" value={String(s.clients.length)} />
        <Stat label="Repeat clients" value={String(s.repeatClients)} />
        <Stat label="Average per client" value={rm(Math.round(s.totalRM / s.clients.length))} />
        <Stat label="Quiet 3+ months" value={String(quiet.length)} yes={quiet.length > 0} />
      </div>

      <table className="tbl">
        <thead>
          <tr>
            <th>Client</th>
            <th>Contact</th>
            <th>Jobs</th>
            <th>Invoiced</th>
            <th>Work</th>
            <th>First</th>
            <th>Last</th>
          </tr>
        </thead>
        <tbody>
          {s.clients.map(c => {
            const gap = monthsBetween(c.last)
            return (
              <tr key={c.name}>
                <td data-label="Client">
                  {c.name}
                  {c.address ? (
                    <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{c.address}</div>
                  ) : null}
                </td>
                <td data-label="Contact">{c.contact ?? '—'}</td>
                <td data-label="Jobs">
                  {c.invoices.length}
                  {c.invoices.length > 1 ? <span className="pill won" style={{ marginLeft: 6 }}>repeat</span> : null}
                </td>
                <td data-label="Invoiced">
                  {rm(c.totalRM)}
                  {c.otherCurrency.map(o => (
                    <div key={o.currency} style={{ fontSize: 12, opacity: 0.7 }}>
                      + {o.currency} {o.total.toLocaleString('en-MY')}
                    </div>
                  ))}
                </td>
                <td data-label="Work">{c.kinds.join(', ')}</td>
                <td data-label="First">{c.first}</td>
                <td data-label="Last">
                  {c.last}
                  {gap >= 3 ? <span className="pill overdue" style={{ marginLeft: 6 }}>{gap}m quiet</span> : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
