import { getRecords, m, rm, type Rec } from '@/lib/records'
import Empty from '@/app/_components/Empty'

export const dynamic = 'force-dynamic'

// The Customers tab = everyone who's already bought. Each is a `records` row with
// category='customer'. We show what matters after the sale: how much they OWE,
// how much they've been INVOICED, when we LAST TOUCHED them, and the NEXT ACTION.
// The table collapses to stacked cards on phones (the .tbl mobile rules +
// data-label attributes in globals.css).

// How much a customer owes: prefer meta.owes, else the amount on the row.
function owes(r: Rec): number {
  const o = r.meta?.owes
  return Number(o ?? r.amount ?? 0)
}

// Total invoiced (RM) — filled by an import; 0 for customers added by hand.
const invoiced = (r: Rec) => Number(r.meta?.total_invoiced ?? 0)

export default async function Customers() {
  const rows = await getRecords()
  const customers = rows.filter(r => r.category === 'customer')

  // Sort the ones who owe money to the top — that's what needs a nudge — then by
  // how much they've been invoiced.
  customers.sort((a, b) => owes(b) - owes(a) || invoiced(b) - invoiced(a))

  return (
    <>
      <h1 className="ph">Customers 🤝</h1>
      <p className="cap">Who's bought — what they owe, what you've invoiced, last touch, next action.</p>

      {customers.length === 0 ? (
        <Empty label="customers" />
      ) : (
        <table className="tbl">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Owes</th>
              <th>Jobs</th>
              <th>Invoiced</th>
              <th>Last touch</th>
              <th>Next action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(r => {
              const owed = owes(r)
              // Imported customers whose payments aren't tracked yet must not read "Nothing".
              const untracked = r.meta?.payment_tracked === false
              const usd = Number(r.meta?.total_invoiced_usd ?? 0)
              return (
                <tr key={r.id}>
                  <td data-label="Customer">
                    {r.title}
                    {r.meta?.address ? (
                      <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{String(r.meta.address)}</div>
                    ) : null}
                  </td>
                  <td data-label="Owes">
                    {owed > 0 ? (
                      <span className="pill overdue">{rm(owed)}</span>
                    ) : untracked ? (
                      <span className="pill">Not tracked</span>
                    ) : (
                      <span className="pill paid">Nothing</span>
                    )}
                  </td>
                  <td data-label="Jobs">{m(r, 'jobs')}</td>
                  <td data-label="Invoiced">
                    {invoiced(r) > 0 ? rm(invoiced(r)) : usd > 0 ? '' : '—'}
                    {usd > 0 ? `${invoiced(r) > 0 ? ' + ' : ''}USD ${usd.toLocaleString('en-MY')}` : ''}
                  </td>
                  <td data-label="Last touch">{m(r, 'last_touch')}</td>
                  <td data-label="Next action">{m(r, 'next')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}
