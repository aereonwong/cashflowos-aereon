import type { Rec } from '@/lib/records'
import { buildRelationships, type ClientSort } from '@/lib/v3/ledger'
import { QUIET_MONTHS } from '@/lib/v3/catalog'
import { withParam, type Filters } from '@/lib/v3/filters'
import FilterBar from '../FilterBar'
import RelationshipMap from '../RelationshipMap'
import Search from '../Search'
import { rmFull, money, longDate } from '../fmt'

// 👉 v3 Clients: who the business rests on, and who to call. The relationship
// map places every client by value and by how long since the last job; the
// re-pitch list is its top-right corner, ranked.

type Params = Record<string, string | string[] | undefined>
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
const SORTS: ClientSort[] = ['value', 'recent', 'quiet', 'jobs', 'name']

export default function Clients({ rows, filters, sp }: { rows: Rec[]; filters: Filters; sp: Params }) {
  const raw = one(sp.sort) as ClientSort | undefined
  const sort: ClientSort = raw && SORTS.includes(raw) ? raw : 'value'
  const q = one(sp.q) ?? ''
  const { list, median, stats } = buildRelationships(rows, filters, sort, q)
  const repitch = list.filter(c => c.quadrant === 'repitch').sort((a, b) => b.lifetime - a.lifetime)
  const sortHref = (s: ClientSort) => {
    const p = new URLSearchParams(withParam(filters, 'sort', s === 'value' ? undefined : s).slice(1))
    if (filters.range === 'all') p.delete('range')
    if (q) p.set('q', q)
    const str = p.toString()
    return str ? `?${str}` : '?'
  }

  return (
    <div>
      <header className="v3-head">
        <div>
          <h1 className="v3-title">Clients</h1>
          <p className="v3-lede">
            {stats.clients} clients · {repitch.length} valuable relationship{repitch.length === 1 ? '' : 's'} gone quiet for{' '}
            {QUIET_MONTHS}+ months
          </p>
        </div>
      </header>

      <FilterBar filters={filters} clients={[]} clientPicker={false} fallback="all" />

      <div className="v3-grid">
        <section className="v3-panel v3-span-12" aria-label="Figures">
          <div className="v3-kpis">
            <div>
              <div className="v3-kpi-label">Clients</div>
              <div className="v3-kpi-value num">{stats.clients}</div>
              <div className="v3-kpi-note">{stats.repeat} have hired you more than once</div>
            </div>
            <div>
              <div className="v3-kpi-label">Average lifetime value</div>
              <div className="v3-kpi-value num">{rmFull(stats.average)}</div>
              <div className="v3-kpi-note">Median {rmFull(median)}</div>
            </div>
            <div>
              <div className="v3-kpi-label">From returning clients</div>
              <div className="v3-kpi-value num">{Math.round(stats.repeatShare * 100)}%</div>
              <div className="v3-kpi-note">of lifetime ringgit</div>
            </div>
            <div>
              <div className="v3-kpi-label">Gone quiet</div>
              <div className="v3-kpi-value num">{stats.quiet}</div>
              <div className="v3-kpi-note">no job for {QUIET_MONTHS}+ months</div>
            </div>
          </div>
        </section>

        <section className="v3-panel v3-span-8" aria-labelledby="t-map">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-map">
              Relationship map
            </h2>
            <p className="v3-panel-note">Up is worth more · right is longer since the last job</p>
          </div>
          <RelationshipMap list={list} median={median} />
        </section>

        <section className="v3-panel v3-span-4" aria-labelledby="t-repitch">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-repitch">
              Worth a re-pitch
            </h2>
          </div>
          {repitch.length ? (
            <div className="v3-rows">
              {repitch.slice(0, 8).map(c => (
                <a key={c.client} className="v3-row" href={`/invoices?range=all&client=${encodeURIComponent(c.client)}`}>
                  <div className="v3-row-main">
                    <div className="v3-row-title">{c.client}</div>
                    <div className="v3-row-sub">
                      {c.jobs} job{c.jobs === 1 ? '' : 's'} · last {longDate(c.last)}
                    </div>
                  </div>
                  <div className="v3-row-num">{rmFull(c.lifetime)}</div>
                </a>
              ))}
            </div>
          ) : (
            <p className="v3-empty">Nobody valuable has gone quiet. Every bigger client has worked with you recently.</p>
          )}
        </section>

        <section className="v3-panel v3-span-12" aria-labelledby="t-list">
          <div className="v3-toolbar">
            <h2 className="v3-panel-title" id="t-list">
              Every client
            </h2>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="v3-count">{list.length} shown</span>
              <Search placeholder="Search client, contact or work" />
            </div>
          </div>
          <div className="v3-table-wrap">
            <table className="v3-table">
              <thead>
                <tr>
                  <th aria-sort={sort === 'name' ? 'ascending' : undefined}>
                    <a href={sortHref('name')}>Client</a>
                  </th>
                  <th>Contact</th>
                  <th aria-sort={sort === 'jobs' ? 'descending' : undefined}>
                    <a href={sortHref('jobs')}>Jobs</a>
                  </th>
                  <th>Work</th>
                  <th aria-sort={sort === 'recent' ? 'descending' : undefined}>
                    <a href={sortHref('recent')}>Last job</a>
                  </th>
                  <th aria-sort={sort === 'quiet' ? 'descending' : undefined}>
                    <a href={sortHref('quiet')}>Quiet</a>
                  </th>
                  <th className="r" aria-sort={sort === 'value' ? 'descending' : undefined}>
                    <a href={sortHref('value')}>Lifetime</a>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.client}>
                    <td>
                      <a href={`/invoices?range=all&client=${encodeURIComponent(c.client)}`}>{c.client}</a>
                      {c.address ? <div className="dim" style={{ fontSize: 12, marginTop: 2, maxWidth: 360 }}>{c.address}</div> : null}
                    </td>
                    <td className="dim">{c.contact ?? '—'}</td>
                    <td className="num">
                      {c.jobs}
                      {c.jobs > 1 ? <span className="v3-tag" style={{ marginLeft: 6 }}>returning</span> : null}
                    </td>
                    <td className="dim">{c.kinds.join(', ')}</td>
                    <td className="num dim">{c.last}</td>
                    <td>{c.monthsQuiet >= QUIET_MONTHS ? <span className="v3-tag">{c.monthsQuiet}m</span> : <span className="dim">—</span>}</td>
                    <td className="r num">
                      {rmFull(c.lifetime)}
                      {c.foreign.map(f => (
                        <div key={f.currency} className="dim" style={{ fontSize: 12 }}>
                          + {money(f.total, f.currency)}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
