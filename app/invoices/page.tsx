// 👉 Invoice Summary — the money view of the work you've invoiced, built from the
// same `records` table (cash_in rows that carry meta.invoice_no, imported from Canva).
import { getRecords, rm } from '@/lib/records'
import { summarize } from '@/lib/invoices'
import Stat from '@/app/_components/Stat'
import Empty from '@/app/_components/Empty'
import Bars from '@/app/_components/Bars'
import RowBars from '@/app/_components/RowBars'

export const dynamic = 'force-dynamic'

const pct = (n: number) => `${n.toFixed(0)}%`

export default async function InvoiceSummary() {
  const rows = await getRecords()
  const s = summarize(rows)

  if (s.invoices.length === 0) {
    return (
      <>
        <h1 className="ph">Invoice Summary 🧾</h1>
        <p className="cap">Everything you've invoiced — totals, months, clients, work type.</p>
        <Empty label="invoices" />
      </>
    )
  }

  const span =
    s.months.length > 0
      ? `${s.months[0].month} → ${s.months[s.months.length - 1].month}`
      : ''

  return (
    <>
      <h1 className="ph">Invoice Summary 🧾</h1>
      <p className="cap">Everything you've invoiced — totals, months, clients, work type.</p>

      <div className="grid">
        <Stat label="Total invoiced" value={rm(s.totalRM)} />
        <Stat label="Invoices" value={String(s.countRM)} />
        <Stat label="Clients" value={String(s.clients.length)} />
        <Stat label="Average invoice" value={rm(Math.round(s.averageRM))} />
        <Stat label="Biggest invoice" value={rm(s.biggest?.amount ?? 0)} />
        {s.bestMonth ? <Stat label={`Best month (${s.bestMonth.month})`} value={rm(s.bestMonth.total)} /> : null}
      </div>

      {s.otherCurrency.length > 0 || s.untracked > 0 ? (
        <p className="metahint">
          {s.otherCurrency.map(c => `${c.count} invoice${c.count > 1 ? 's' : ''} in ${c.currency} (${c.currency} ${c.total.toLocaleString('en-MY')})`).join(' · ')}
          {s.otherCurrency.length > 0 && s.untracked > 0 ? ' · ' : ''}
          {s.untracked > 0 ? `${s.untracked} invoices have no payment status yet — RM totals here are what you invoiced, not what landed.` : ''}
        </p>
      ) : null}

      <div className="chart-card">
        <h2>Invoiced by month</h2>
        <p className="sub">RM per month{span ? ` · ${span}` : ''} · hover a bar for the invoice count</p>
        <Bars
          points={s.months.map(m => ({
            label: m.label,
            value: m.total,
            title: `${m.month}: ${rm(m.total)} · ${m.count} invoice${m.count === 1 ? '' : 's'}`,
            caption: m.total ? rm(m.total).replace('RM ', '') : '',
          }))}
        />
      </div>

      <div className="split">
        <div className="chart-card">
          <h2>Top clients</h2>
          <p className="sub">
            {s.clients[0]?.name} is {pct(s.topClientShare)} of everything you invoiced
            {s.topClientShare >= 40 ? ' — that is a lot from one client' : ''}
          </p>
          <RowBars
            rows={s.clients.slice(0, 5).map(c => ({
              name: c.name,
              value: c.totalRM,
              right: `${rm(c.totalRM)} · ${c.invoices.length} job${c.invoices.length === 1 ? '' : 's'}`,
            }))}
          />
        </div>

        <div className="chart-card">
          <h2>Work type</h2>
          <p className="sub">Grouped from what each invoice describes</p>
          <RowBars
            rows={s.byKind.map(k => ({
              name: k.kind,
              value: k.total,
              right: `${rm(k.total)} · ${k.count}`,
            }))}
          />
        </div>
      </div>

      <div className="grid">
        <Stat label="Repeat clients" value={`${s.repeatClients} of ${s.clients.length}`} />
        <Stat label="From repeat clients" value={pct(s.repeatRevenueShare)} />
        <Stat label="Top-client concentration" value={pct(s.topClientShare)} yes={s.topClientShare >= 40} />
      </div>

      <div className="chart-card">
        <h2>All invoices</h2>
        <p className="sub">Newest first · the number links to the Canva document</p>
        <table className="tbl">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Client</th>
              <th>Work</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {s.invoices.map(i => (
              <tr key={i.id}>
                <td data-label="Invoice">
                  {i.url ? (
                    <a href={i.url} target="_blank" rel="noopener noreferrer">{i.no}</a>
                  ) : (
                    i.no
                  )}
                </td>
                <td data-label="Date">{i.date}</td>
                <td data-label="Client">{i.client}</td>
                <td data-label="Work"><span className="pill">{i.kind}</span></td>
                <td data-label="Amount">
                  {i.currency === 'MYR' ? rm(i.amount) : `${i.currency} ${i.amount.toLocaleString('en-MY')}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
