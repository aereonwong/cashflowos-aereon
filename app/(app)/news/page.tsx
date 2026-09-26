// 👉 News — the daily tech & travel digest the Telegram bot sends at 9am,
// kept and browsable. Stories are saved by app/api/cron-news into news_items.
import { readFileSync } from 'fs'
import { join } from 'path'
import { readNews, type NewsSection } from '@/lib/news'
import { SECTIONS } from '@/lib/news-catalog'
import { readVersion } from '@/lib/v3/version'
import V3News from '@/app/_v3/pages/News'

export const dynamic = 'force-dynamic'

type Params = Record<string, string | string[] | undefined>
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

export default async function NewsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const [sp, { version }] = await Promise.all([searchParams, readVersion()])
  const section = SECTIONS.some(s => s.id === one(sp.section)) ? (one(sp.section) as NewsSection) : undefined
  const source = one(sp.source) || undefined
  const q = one(sp.q) || undefined
  const days = ['7', '30', '90', 'all'].includes(one(sp.days) ?? '') ? one(sp.days)! : '30'
  const from =
    days === 'all' ? undefined : new Date(Date.now() + 8 * 3600 * 1000 - Number(days) * 86_400_000).toISOString().slice(0, 10)

  const read = await readNews({ section, source, q, from })
  let sql = ''
  try {
    sql = readFileSync(join(process.cwd(), 'supabase', 'news.sql'), 'utf8')
  } catch {
    sql = '-- supabase/news.sql could not be read'
  }
  const ref = process.env.SUPABASE_URL?.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1]
  const sqlUrl = ref ? `https://supabase.com/dashboard/project/${ref}/sql/new` : null

  if (version === 'v3') {
    return <V3News read={read} section={section ?? ''} source={source ?? ''} days={days} sql={sql} sqlUrl={sqlUrl} />
  }

  // v1 and v2: the same stories in the classic look.
  return (
    <>
      <h1 className="ph">News 📰</h1>
      <p className="cap">Your 9am tech &amp; travel digest, kept. Switch to v3 in Settings for filters.</p>
      {!read.ready ? (
        <div className="chart-card">
          <h2>One step switches this on</h2>
          <p className="sub">Paste this into the Supabase SQL editor and press Run. It creates one empty table.</p>
          <pre className="brief">{sql}</pre>
          {sqlUrl ? (
            <a className="btn" href={sqlUrl} target="_blank" rel="noreferrer">
              Open the Supabase SQL editor
            </a>
          ) : null}
        </div>
      ) : read.items.length === 0 ? (
        <p className="metahint">Nothing kept yet — the first digest is saved at 9am Malaysia time.</p>
      ) : (
        <div className="chart-card">
          <table className="tbl">
            <thead>
              <tr>
                <th>Date</th>
                <th>Section</th>
                <th>Story</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {read.items.map(i => (
                <tr key={`${i.digest_date}-${i.headline}`}>
                  <td data-label="Date">{i.digest_date}</td>
                  <td data-label="Section">
                    <span className="pill">{SECTIONS.find(s => s.id === i.section)?.label}</span>
                  </td>
                  <td data-label="Story">
                    {i.url ? (
                      <a href={i.url} target="_blank" rel="noreferrer">
                        {i.headline}
                      </a>
                    ) : (
                      i.headline
                    )}
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{i.summary}</div>
                  </td>
                  <td data-label="Source">{i.source ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
