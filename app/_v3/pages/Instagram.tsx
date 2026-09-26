import { analyse, type IgSnapshot } from '@/lib/instagram'
import type { Audience } from '@/lib/v3/audience'
import IgFilters from '../IgFilters'
import PostGrid from '../PostGrid'
import ReachTimeline from '../ReachTimeline'
import Refresh from '../Refresh'
import { compact, num, longDate } from '../fmt'

// 👉 v3 Instagram: is my audience growing, and what earns it. Keeps every v2
// figure — followers, reach, views, engagement, reach by week, format, best day,
// top and quietest posts — and adds the follower line, a reach timeline, and
// top posts that play in place.

type Params = Record<string, string | string[] | undefined>
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default function Instagram({ audience, sp }: { audience: Audience; sp: Params }) {
  const days = ['7', '30', '90', 'all'].includes(one(sp.days) ?? '') ? one(sp.days)! : '30'
  const type = ['REELS', 'FEED'].includes(one(sp.type) ?? '') ? one(sp.type)! : ''
  const { snap, history } = audience

  if (!snap) {
    return (
      <div>
        <header className="v3-head">
          <h1 className="v3-title">Instagram</h1>
        </header>
        <section className="v3-panel">
          <p className="v3-empty">No Instagram snapshot yet.</p>
          <Refresh label="Fetch my Instagram data" />
        </section>
      </div>
    )
  }

  const scoped: IgSnapshot = { ...snap, posts: type ? snap.posts.filter(p => (type === 'REELS' ? /REEL/i : /^(?!.*REEL)/i).test(p.type)) : snap.posts }
  const s = analyse(scoped, days === 'all' ? 3650 : Number(days))
  const first = history[0]
  const last = history.at(-1)
  const change = first && last ? last.followers - first.followers : 0
  const tracked = first && last ? Math.round((Date.parse(last.date) - Date.parse(first.date)) / 86_400_000) : 0
  const best = s.byType[0]
  const bestDay = s.byWeekday.filter(d => d.count >= 2)[0] ?? s.byWeekday[0]
  const byReach = [...s.posts].sort((a, b) => (b.reach ?? 0) - (a.reach ?? 0))

  return (
    <div>
      <header className="v3-head">
        <div>
          <h1 className="v3-title">Instagram</h1>
          <p className="v3-lede">
            @{snap.username} · last snapshot {longDate(snap.captured_at)} · {s.posts.length} post{s.posts.length === 1 ? '' : 's'} in view
          </p>
        </div>
        <Refresh />
      </header>

      <IgFilters days={days} type={type} />

      <div className="v3-grid">
        <section className="v3-panel v3-span-4" aria-labelledby="t-follow">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-follow">
              Followers
            </h2>
          </div>
          <div className="v3-follow">
            <span className="v3-follow-big">{num(audience.followers)}</span>
            {tracked > 0 ? (
              <span className={`v3-follow-change${change < 0 ? ' down' : ''}`}>
                {change >= 0 ? '+' : ''}
                {num(change)} in {tracked} day{tracked === 1 ? '' : 's'}
              </span>
            ) : null}
          </div>
          <p className="v3-panel-note" style={{ marginTop: 'var(--space-3)' }}>
            {tracked > 0
              ? `Tracked since ${longDate(first!.date)}. Each snapshot adds a point; the trend sharpens as they build up.`
              : 'Growth appears once a second day of snapshots exists.'}
          </p>
        </section>

        <section className="v3-panel v3-span-8" aria-label="Figures for the window">
          <div className="v3-kpis">
            <div>
              <div className="v3-kpi-label">Reach per post</div>
              <div className="v3-kpi-value num">{compact(s.reachPerPost)}</div>
              <div className="v3-kpi-note">{Math.round(s.reachVsFollowers)}% of your followers</div>
            </div>
            <div>
              <div className="v3-kpi-label">Accounts reached</div>
              <div className="v3-kpi-value num">{compact(s.totals.reach)}</div>
              <div className="v3-kpi-note">{compact(s.totals.views)} views</div>
            </div>
            <div>
              <div className="v3-kpi-label">Engagement</div>
              <div className="v3-kpi-value num">{s.engagementRate.toFixed(1)}%</div>
              <div className="v3-kpi-note">of accounts reached who interacted</div>
            </div>
            <div>
              <div className="v3-kpi-label">Posting</div>
              <div className="v3-kpi-value num">{s.postsPerWeek.toFixed(1)}/wk</div>
              <div className="v3-kpi-note">last post {s.daysSinceLastPost === 0 ? 'today' : `${s.daysSinceLastPost} day${s.daysSinceLastPost === 1 ? '' : 's'} ago`}</div>
            </div>
          </div>
        </section>

        <section className="v3-panel v3-span-12" aria-labelledby="t-top">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-top">
              Top performances
            </h2>
            <p className="v3-panel-note">Ranked by accounts reached · tap to play</p>
          </div>
          <PostGrid posts={byReach} limit={8} />
        </section>

        <section className="v3-panel v3-span-12" aria-labelledby="t-time">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-time">
              What travelled
            </h2>
            <p className="v3-panel-note">Every post on the day it went out, raised by its reach</p>
          </div>
          <ReachTimeline posts={s.posts} />
        </section>

        <section className="v3-panel v3-span-6" aria-labelledby="t-fmt">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-fmt">
              What format works
            </h2>
            {best ? <p className="v3-panel-note">{best.type === 'REELS' ? 'Reels' : 'Posts'} reach furthest</p> : null}
          </div>
          <div className="v3-rows">
            {s.byType.map(t => (
              <div key={t.type} className="v3-row">
                <div className="v3-row-main">
                  <div className="v3-row-title">{t.type === 'REELS' ? 'Reels' : t.type === 'FEED' ? 'Posts' : t.type}</div>
                  <div className="v3-row-sub">
                    {t.count} · {t.avgEngagement.toFixed(1)}% engagement
                  </div>
                </div>
                <div className="v3-row-num">{compact(t.avgReach)} avg reach</div>
                <div className="v3-row-bar">
                  <i style={{ ['--w' as string]: (t.avgReach / (s.byType[0]?.avgReach || 1)).toFixed(3) }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="v3-panel v3-span-6" aria-labelledby="t-day">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-day">
              Best day to post
            </h2>
            {bestDay ? <p className="v3-panel-note">{bestDay.day} leads, from {bestDay.count} posts</p> : null}
          </div>
          <div className="v3-rows">
            {s.byWeekday.map(d => (
              <div key={d.day} className="v3-row">
                <div className="v3-row-main">
                  <div className="v3-row-title">{d.day}</div>
                  <div className="v3-row-sub">
                    {d.count} post{d.count === 1 ? '' : 's'}
                    {d.count < 2 ? ' · too few to trust' : ''}
                  </div>
                </div>
                <div className="v3-row-num">{compact(d.avgReach)}</div>
                <div className="v3-row-bar">
                  <i style={{ ['--w' as string]: (d.avgReach / (s.byWeekday[0]?.avgReach || 1)).toFixed(3) }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {s.quiet.length ? (
          <section className="v3-panel v3-span-12" aria-labelledby="t-quiet">
            <div className="v3-panel-head">
              <h2 className="v3-panel-title" id="t-quiet">
                Quietest posts
              </h2>
              <p className="v3-panel-note">Worth a look before making more of the same</p>
            </div>
            <PostGrid posts={s.quiet} limit={3} />
          </section>
        ) : null}
      </div>
    </div>
  )
}
