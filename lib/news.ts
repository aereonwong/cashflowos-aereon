import { supabase, supabaseConfigured } from './supabase'

// 👉 The daily digest, kept. The 9am cron writes the digest as Telegram HTML in
// a fixed shape (see app/api/cron-news): section headings, then one bullet per
// story — "• <b>headline</b> — why it matters. <a href="URL">Source</a>". That
// fixed shape is what lets it be parsed back into rows without a second model call.

import type { NewsSection } from './news-catalog'
export { SECTIONS, type NewsSection } from './news-catalog'

export type NewsItem = {
  id?: number
  digest_date: string // YYYY-MM-DD, Malaysia time
  section: NewsSection
  headline: string
  summary: string
  url?: string
  source?: string
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
const strip = (s: string) => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()

function sectionOf(line: string): NewsSection | null {
  const t = strip(line).toLowerCase()
  if (!t || t.startsWith('•')) return null
  if (/content angle/.test(t)) return 'angles'
  if (/malaysia|sea\b|southeast/.test(t)) return 'malaysia'
  if (/travel/.test(t)) return 'travel'
  if (/tech/.test(t)) return 'tech'
  return null
}

/** Digest HTML → one row per story. Lines that are not stories are ignored. */
export function parseDigest(html: string, digestDate: string): NewsItem[] {
  const items: NewsItem[] = []
  let section: NewsSection | null = null
  for (const raw of html.split(/\n+/)) {
    const line = raw.trim()
    if (!line) continue
    const heading = sectionOf(line)
    if (heading) {
      section = heading
      continue
    }
    if (!section || !/^[•\-–]/.test(line)) continue
    const href = line.match(/<a\s+href="([^"]+)"/i)?.[1]
    const bold = line.match(/<b>(.*?)<\/b>/i)?.[1]
    const body = line.replace(/^[•\-–]\s*/, '').replace(/<a\s[^>]*>.*?<\/a>/gi, '')
    const text = strip(body)
    const headline = bold ? strip(bold) : text.split(/ — | - /)[0]
    const summary = text.startsWith(headline) ? text.slice(headline.length).replace(/^\s*[—–-]\s*/, '').replace(/\.\s*$/, '.') : text
    if (!headline) continue
    let source: string | undefined
    try {
      source = href ? new URL(href).hostname.replace(/^www\./, '') : undefined
    } catch {
      source = undefined
    }
    items.push({ digest_date: digestDate, section, headline: headline.slice(0, 300), summary: summary.slice(0, 600), url: href, source })
  }
  return items
}

/** Saves a day's stories. Idempotent: re-running a day updates rather than duplicates. */
export async function saveNews(items: NewsItem[]): Promise<{ ok: boolean; count: number; error?: string }> {
  if (!supabaseConfigured || !items.length) return { ok: false, count: 0, error: 'nothing to save' }
  const { error } = await supabase.from('news_items').upsert(items, { onConflict: 'digest_date,headline' })
  return error ? { ok: false, count: 0, error: error.message } : { ok: true, count: items.length }
}

export type NewsQuery = { section?: NewsSection; source?: string; q?: string; from?: string; to?: string }

export type NewsRead =
  | { ready: false; reason: 'no-table' | 'not-configured'; items: []; sources: []; days: 0 }
  | { ready: true; items: NewsItem[]; sources: { source: string; count: number }[]; days: number }

export async function readNews(f: NewsQuery = {}, limit = 400): Promise<NewsRead> {
  if (!supabaseConfigured) return { ready: false, reason: 'not-configured', items: [], sources: [], days: 0 }
  let query = supabase.from('news_items').select('id, digest_date, section, headline, summary, url, source').order('digest_date', { ascending: false }).order('id', { ascending: true }).limit(limit)
  if (f.section) query = query.eq('section', f.section)
  if (f.source) query = query.eq('source', f.source)
  if (f.from) query = query.gte('digest_date', f.from)
  if (f.to) query = query.lte('digest_date', f.to)
  if (f.q) query = query.or(`headline.ilike.%${f.q.replace(/[%,()]/g, '')}%,summary.ilike.%${f.q.replace(/[%,()]/g, '')}%`)
  const { data, error } = await query
  if (error) {
    // The table does not exist until supabase/news.sql has been run once.
    if (/does not exist|schema cache|relation/i.test(error.message)) return { ready: false, reason: 'no-table', items: [], sources: [], days: 0 }
    throw new Error(error.message)
  }
  const { data: all } = await supabase.from('news_items').select('source, digest_date').limit(5000)
  const counts = new Map<string, number>()
  for (const r of all ?? []) if (r.source) counts.set(r.source, (counts.get(r.source) ?? 0) + 1)
  return {
    ready: true,
    items: (data ?? []) as NewsItem[],
    sources: [...counts.entries()].map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
    days: new Set((all ?? []).map(r => r.digest_date)).size,
  }
}
