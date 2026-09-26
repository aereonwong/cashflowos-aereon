import type { NewsRead, NewsItem } from '@/lib/news'
import { SECTIONS } from '@/lib/news-catalog'
import NewsFilters from '../NewsFilters'
import Icon from '@/app/_components/Icon'

// 👉 v3 News: the 9am tech & travel digest, kept and browsable. Until the
// news_items table exists it explains the one step that switches it on.

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayTitle = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`)
  return `${WEEKDAY[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTH[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
const label = (s: string) => SECTIONS.find(x => x.id === s)?.label ?? s

export default function News({
  read,
  section,
  source,
  days,
  sql,
  sqlUrl,
}: {
  read: NewsRead
  section: string
  source: string
  days: string
  sql: string
  sqlUrl: string | null
}) {
  const byDay = new Map<string, NewsItem[]>()
  if (read.ready) for (const i of read.items) byDay.set(i.digest_date, [...(byDay.get(i.digest_date) ?? []), i])

  return (
    <div>
      <header className="v3-head">
        <div>
          <h1 className="v3-title">News</h1>
          <p className="v3-lede">
            Your 9am tech and travel digest, kept.
            {read.ready ? ` ${read.items.length} stor${read.items.length === 1 ? 'y' : 'ies'} shown from ${read.days} digest${read.days === 1 ? '' : 's'}.` : ''}
          </p>
        </div>
      </header>

      {!read.ready ? (
        <section className="v3-panel" aria-labelledby="t-setup">
          <div className="v3-panel-head">
            <h2 className="v3-panel-title" id="t-setup">
              One step switches this on
            </h2>
          </div>
          <p className="v3-lede" style={{ marginTop: 0 }}>
            The digest has only ever been sent to Telegram, never kept. From tomorrow&rsquo;s 9am run it saves every story
            here too — once this table exists. Paste the SQL below into Supabase&rsquo;s SQL editor and press Run. It
            creates one empty table and touches nothing else.
          </p>
          <pre className="v3-sql">{sql}</pre>
          {sqlUrl ? (
            <a className="v3-btn v3-btn-primary" href={sqlUrl} target="_blank" rel="noreferrer" style={{ marginTop: 'var(--space-4)', textDecoration: 'none' }}>
              Open the Supabase SQL editor <Icon name="external" />
            </a>
          ) : null}
        </section>
      ) : (
        <>
          <NewsFilters section={section} source={source} days={days} sources={read.sources} />
          {byDay.size === 0 ? (
            <section className="v3-panel">
              <p className="v3-empty">
                {read.days === 0 ? (
                  <>
                    <b>Nothing kept yet.</b> The first digest is saved here at 9am Malaysia time, and every day after.
                  </>
                ) : (
                  'No stories match. Try a longer window or clear the search.'
                )}
              </p>
            </section>
          ) : (
            <div className="v3-news">
              {[...byDay.entries()].map(([date, items]) => (
                <section key={date} className="v3-panel v3-news-day" aria-label={dayTitle(date)}>
                  <span className="v3-edge">
                    DIGEST ▸ {date} ▸ {items.length} STORIES
                  </span>
                  <h2 className="v3-panel-title v3-news-date">{dayTitle(date)}</h2>
                  <ol className="v3-news-list">
                    {items.map(i => (
                      <li key={`${date}-${i.headline}`} className="v3-story" data-section={i.section}>
                        <span className="v3-tag">{label(i.section)}</span>
                        <div className="v3-story-main">
                          {i.url ? (
                            <a className="v3-story-head" href={i.url} target="_blank" rel="noreferrer">
                              {i.headline}
                            </a>
                          ) : (
                            <span className="v3-story-head">{i.headline}</span>
                          )}
                          {i.summary ? <p className="v3-story-sum">{i.summary}</p> : null}
                        </div>
                        {i.source ? <span className="v3-story-src">{i.source}</span> : null}
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
