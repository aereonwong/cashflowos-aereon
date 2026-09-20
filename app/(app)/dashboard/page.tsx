// 👉 The Dashboard — who you are, what you've invoiced, and how your posts are
// doing. Cash in/out keeps its own tabs; this page is the creator view: invoices
// + Instagram, both interactive.
import { getRecords, rm } from '@/lib/records'
import { summarize } from '@/lib/invoices'
import { latestSnapshot, analyse } from '@/lib/instagram'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import Stat from '@/app/_components/Stat'
import Icon from '@/app/_components/Icon'
import InteractiveBars from '@/app/_components/InteractiveBars'
import AreaChart from '@/app/_components/AreaChart'
import Donut from '@/app/_components/Donut'

export const dynamic = 'force-dynamic'

// Count of proposals still waiting on a human YES — the 🙋 number. Guarded so an
// unconfigured/placeholder Supabase returns 0 instantly instead of hanging.
async function proposedCount(): Promise<number> {
  if (!supabaseConfigured) return 0
  const { count, error } = await supabase
    .from('agent_actions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'proposed')
  if (error) return 0
  return count ?? 0
}

const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1000).toFixed(1)}K` : String(Math.round(n))

export default async function Dashboard() {
  const [rows, snap, waiting] = await Promise.all([getRecords(), latestSnapshot(), proposedCount()])
  const inv = summarize(rows)
  const ig = snap ? analyse(snap) : null

  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthRow = inv.months.find(m => m.month === thisMonth)
  const last6 = inv.months.slice(-6)
  const openTasks = rows.filter(r => r.category === 'task' && (r.status || '').toLowerCase() === 'open')

  return (
    <>
      {/* ---- who you are ---- */}
      <section className="hero-card">
        <img className="hero-face" src="/img/aereon.jpg" alt="Aereon Wong" />
        <div className="hero-copy">
          <p className="hero-role">
            <Icon name="camera" /> Tech &amp; Travel Content Creator
          </p>
          <h1 className="ph">Aereon Wong</h1>
          <p className="cap">
            Kuala Lumpur, Malaysia · drone pilot, photographer, videographer ·{' '}
            <a href="https://www.instagram.com/aereonwong/" target="_blank" rel="noopener noreferrer">@aereonwong</a>
          </p>
          <div className="hero-chips">
            {snap ? <span className="land-tag">{compact(snap.profile.followers_count ?? 0)} followers</span> : null}
            <span className="land-tag">{inv.clients.length} clients</span>
            <span className="land-tag">{inv.countRM} invoices</span>
            {waiting > 0 ? <a className="land-tag hot" href="/approvals">🙋 {waiting} need your YES</a> : null}
            {openTasks.length > 0 ? <a className="land-tag" href="/tasks">{openTasks.length} open tasks</a> : null}
          </div>
        </div>
      </section>

      {/* ---- invoices ---- */}
      <p className="rowlabel"><Icon name="invoice" /> Invoicing</p>
      <div className="grid">
        <Stat label="Invoiced · 12 months" value={rm(inv.totalRM)} icon="wallet" href="/invoices" />
        <Stat label="This month" value={rm(monthRow?.total ?? 0)} icon="calendar" href="/invoices" />
        <Stat label="Average invoice" value={rm(Math.round(inv.averageRM))} icon="chart" href="/invoices" />
        <Stat
          label="Top client share"
          value={`${inv.topClientShare.toFixed(0)}%`}
          icon="pie"
          yes={inv.topClientShare >= 40}
          href="/clients"
        />
      </div>

      <div className="split">
        <div className="chart-card">
          <h2><Icon name="chart" /> Last 6 months</h2>
          <p className="sub">Hover a month · switch between money and invoice count</p>
          {last6.length ? (
            <InteractiveBars
              points={last6.map(m => ({
                label: m.label,
                sub: `${m.count} invoice${m.count === 1 ? '' : 's'}`,
                values: { amount: m.total, count: m.count },
              }))}
              series={[
                { id: 'amount', label: 'RM', unit: 'rm' as const },
                { id: 'count', label: 'Invoices', unit: 'plain' as const },
              ]}
            />
          ) : (
            <p className="empty">No invoices yet.</p>
          )}
        </div>

        <div className="chart-card">
          <h2><Icon name="users" /> Where the money comes from</h2>
          <p className="sub">Your five biggest clients · hover a slice</p>
          {inv.clients.length ? (
            <Donut
              slices={inv.clients.slice(0, 5).map(c => ({
                label: c.name.replace(/ Sdn Bhd| Pte Ltd|\./gi, ''),
                value: c.totalRM,
              }))}
              centerLabel="top 5 clients"
              unit="rm"
            />
          ) : (
            <p className="empty">No clients yet.</p>
          )}
        </div>
      </div>

      {/* ---- social ---- */}
      <p className="rowlabel"><Icon name="instagram" /> Instagram</p>
      {ig && snap ? (
        <>
          <div className="grid">
            <Stat label="Followers" value={compact(snap.profile.followers_count ?? 0)} icon="users" href="/instagram" />
            <Stat label="Reach · recent" value={compact(ig.totals.reach)} icon="trend" href="/instagram" />
            <Stat label="Views · recent" value={compact(ig.totals.views)} icon="eye" href="/instagram" />
            <Stat label="Engagement" value={`${ig.engagementRate.toFixed(1)}%`} icon="heart" href="/instagram" />
          </div>

          <div className="chart-card">
            <h2><Icon name="trend" /> Reach, week by week</h2>
            <p className="sub">
              From your last {snap.posts.length} posts · you post about {ig.postsPerWeek.toFixed(1)}× a week
            </p>
            <AreaChart
              points={ig.weekly.map(w => ({
                label: w.label,
                value: w.reach,
                sub: `${w.posts} post${w.posts === 1 ? '' : 's'}`,
              }))}
              suffix=" reached"
              caption="hover the line"
            />
          </div>

          <div className="chart-card">
            <h2><Icon name="sparkle" /> Best posts right now</h2>
            <p className="sub">Your biggest reach in this window</p>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Reach</th>
                  <th>Likes</th>
                  <th>Shares</th>
                </tr>
              </thead>
              <tbody>
                {ig.top.slice(0, 3).map(post => (
                  <tr key={post.id}>
                    <td data-label="Post">
                      {post.permalink ? (
                        <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                          {post.caption.slice(0, 44) || post.type}
                          {post.caption.length > 44 ? '…' : ''}
                        </a>
                      ) : (
                        post.caption.slice(0, 44) || post.type
                      )}
                    </td>
                    <td data-label="Date">{post.timestamp.slice(0, 10)}</td>
                    <td data-label="Type"><span className="pill">{post.type}</span></td>
                    <td data-label="Reach">{compact(post.reach ?? 0)}</td>
                    <td data-label="Likes">{compact(post.likes)}</td>
                    <td data-label="Shares">{compact(post.shares ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="banner info">
          No Instagram snapshot yet — open the <a href="/instagram">Instagram tab</a> and press refresh.
        </div>
      )}
    </>
  )
}
