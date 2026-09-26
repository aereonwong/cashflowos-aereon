import type { Rec } from '@/lib/records'
import { buildLedger, type Sort } from '@/lib/v3/ledger'
import { RANGES, withParam, type Filters } from '@/lib/v3/filters'
import FilterBar from '../FilterBar'
import Bars from '../Bars'
import Search from '../Search'
import { rmFull, money, longDate } from '../fmt'

// 👉 v3 Invoice Summary. Everything the v2 page did — totals, the monthly
// chart, top clients, work type, repeat and concentration figures, the full
// table linked to Canva — now filterable, sortable, searchable, with payment
// status.

type Params = Record<string, string | string[] | undefined>
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default function Invoices({ rows, filters, sp }: { rows: Rec[]; filters: Filters; sp: Params }) {
  const sort = (['date', 'amount', 'client'].includes(one(sp.sort) ?? '') ? one(sp.sort) : 'date') as Sort
  const q = one(sp.q) ?? ''
  const l = buildLedger(rows, filters, sort, q)
  const rangeLabel = RANGES.find(r => r.id === filters.range)?.label ?? ''
  const sortHref = (s: Sort) => {
    const p = new URLSearchParams(withParam(filters, 'sort', s === 'date' ? undefined : s).slice(1))
    if (q) p.set('q', q)
    const str = p.toString()
    return str ? `?${str}` : '?'
  }

  return (
    <div>
      <header className="v3-head">
        <div>
          <h1 className="v3-title">Invoice Summary</h1>
          <p className="v3-lede">
            {rmFull(l.total)} across {l.count} ringgit invoice{l.count === 1 ? '' : 's'} ·{' '}
            {filters.range === 'custom' ? `${longDate(filters.from)} to ${longDate(filters.to)}` : rangeLabel.toLowerCase()}
          </p>
        </div>
      </header>

      <FilterBar filters={filters} clients={l.allClients} />

      <div className="v3-grid">
        <section className="v3-panel v3-span-12" aria-label="Figures">
          <div className="v3-kpis">
            <div>
              <div className="v3-kpi-label">Invoiced</div>
              <div className="v3-kpi-value num">{rmFull(l.total)}</div>
              <div className="v3-kpi-note">{l.count} invoices</div>
            </div>
            <div>
              <div className="v3-kpi-label">Average invoice</div>
              <div className="v3-kpi-value num">{rmFull(l.average)}</div>
              <div className="v3-kpi-note">
                Biggest {l.biggest ? `${rmFull(l.biggest.amount)}, ${l.biggest.client}` : '—'}
              </div>
            </div>
            <div>
              <div className="v3-kpi-label">From returning clients</div>
              <div className="v3-kpi-value num">{Math.round(l.repeatShare * 100)}%</div>
              <div className="v3-kpi-note">clients who have hired you more than once</div>
            </div>
            <div>
              <div className="v3-kpi-label">Top five clients</div>
              <div className="v3-kpi-value num">{Math.round(l.concentration * 100)}%</div>
              <div className="v3-kpi-note">
                of the range{l.concentration >= 0.5 ? ' — a lot resting on a few' : ''}
              </div>
            </div>
          </div>
          {l.foreign.length ? (
            <p className="v3-panel-note" style={{ marginTop: 'var(--space-4)' }}>
              Plus {l.foreign.map(f => `${money(f.total, f.currency)} (${f.count})`).join(' and ')} in foreign currency, kept
              out of the ringgit totals.
            </p>
          ) : null}
        </section>

        <section className="v3-panel v3-span-12" aria-labelledby="t-months">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-months">
              Invoiced by month
            </h2>
            <p className="v3-panel-note">Click a month to filter the page to it</p>
          </div>
          <Bars months={l.months} />
        </section>

        <section className="v3-panel v3-span-6" aria-labelledby="t-kind">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-kind">
              Kind of work
            </h2>
          </div>
          <div className="v3-rows">
            {l.mix.map(x => (
              <a
                key={x.kind}
                className="v3-row"
                href={withParam(filters, 'kind', filters.kind === x.kind ? undefined : x.kind)}
                aria-current={filters.kind === x.kind ? 'true' : undefined}
              >
                <div className="v3-row-main">
                  <div className="v3-row-title">{x.kind}</div>
                  <div className="v3-row-sub">
                    {x.count} jobs · {Math.round(x.share * 100)}%
                  </div>
                </div>
                <div className="v3-row-num">{rmFull(x.total)}</div>
                <div className="v3-row-bar">
                  <i style={{ ['--w' as string]: x.share.toFixed(3) }} />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="v3-panel v3-span-6" aria-labelledby="t-top">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-top">
              Top clients
            </h2>
            <a className="v3-panel-link" href="/clients">
              Relationship map
            </a>
          </div>
          <div className="v3-rows">
            {l.topClients.map(c => (
              <a key={c.client} className="v3-row" href={withParam(filters, 'client', c.client)}>
                <div className="v3-row-main">
                  <div className="v3-row-title">{c.client}</div>
                  <div className="v3-row-sub">
                    {c.count} job{c.count === 1 ? '' : 's'} · {Math.round(c.share * 100)}%
                  </div>
                </div>
                <div className="v3-row-num">{rmFull(c.total)}</div>
                <div className="v3-row-bar">
                  <i style={{ ['--w' as string]: (c.total / (l.topClients[0]?.total || 1)).toFixed(3) }} />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="v3-panel v3-span-12" aria-labelledby="t-all">
          <div className="v3-toolbar">
            <h2 className="v3-panel-title" id="t-all">
              All invoices
            </h2>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="v3-count">
                {l.rows.length} shown · {l.paid} confirmed paid
              </span>
              <Search placeholder="Search number, client or job" />
            </div>
          </div>
          <div className="v3-table-wrap">
            <table className="v3-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th aria-sort={sort === 'date' ? 'descending' : undefined}>
                    <a href={sortHref('date')}>Date</a>
                  </th>
                  <th aria-sort={sort === 'client' ? 'ascending' : undefined}>
                    <a href={sortHref('client')}>Client</a>
                  </th>
                  <th>Work</th>
                  <th>Status</th>
                  <th className="r" aria-sort={sort === 'amount' ? 'descending' : undefined}>
                    <a href={sortHref('amount')}>Amount</a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {l.rows.map(i => (
                  <tr key={i.id}>
                    <td className="code">
                      {i.url ? (
                        <a href={i.url} target="_blank" rel="noopener noreferrer">
                          {i.no}
                        </a>
                      ) : (
                        i.no
                      )}
                    </td>
                    <td className="num dim">{i.date}</td>
                    <td>{i.client}</td>
                    <td>
                      <span className="v3-tag">{i.kind}</span>
                    </td>
                    <td>
                      <span className={`v3-tag${i.status === 'paid' ? ' paid' : ''}`}>{i.status === 'paid' ? 'Paid' : 'Unconfirmed'}</span>
                    </td>
                    <td className="r num">
                      {i.currency !== 'MYR' ? <span className="v3-tag fx" style={{ marginRight: 6 }}>{i.currency}</span> : null}
                      {money(i.amount, i.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {l.rows.length === 0 ? <p className="v3-empty">No invoices match. Try a wider range or clear the search.</p> : null}
          </div>
        </section>
      </div>
    </div>
  )
}
