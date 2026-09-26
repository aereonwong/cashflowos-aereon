import { supabase, supabaseConfigured } from '@/lib/supabase'
import { latestSnapshot, analyse, type IgSnapshot, type IgStats, type IgPost } from '@/lib/instagram'

// 👉 Question 2: is my audience growing? Growth needs history, and history needs
// snapshots taken over time. This reports honestly how much history exists, so a
// surface can say "tracking since 20 Sep" instead of drawing a trend it does not have.

export type FollowerPoint = { date: string; followers: number }

export type Audience = {
  snap: IgSnapshot | null
  stats: IgStats | null
  followers: number
  history: FollowerPoint[] // one point per day that has a snapshot
  historyDays: number // days between the first and latest snapshot
  top: IgPost[]
}

export async function readAudience(days = 30): Promise<Audience> {
  const snap = await latestSnapshot()
  let history: FollowerPoint[] = []
  if (supabaseConfigured) {
    const { data } = await supabase
      .from('ig_snapshots')
      .select('captured_at, profile')
      .order('captured_at', { ascending: true })
      .limit(1000)
    const byDay = new Map<string, number>()
    for (const r of data ?? []) {
      const f = Number((r.profile as { followers_count?: number } | null)?.followers_count ?? 0)
      if (f) byDay.set(String(r.captured_at).slice(0, 10), f)
    }
    history = [...byDay.entries()].map(([date, followers]) => ({ date, followers }))
  }
  const first = history[0]?.date
  const last = history.at(-1)?.date
  const historyDays = first && last ? Math.round((Date.parse(last) - Date.parse(first)) / 86_400_000) : 0
  const stats = snap ? analyse(snap, days) : null
  const top = snap ? [...snap.posts].sort((a, b) => (b.reach ?? 0) - (a.reach ?? 0)) : []
  return {
    snap,
    stats,
    followers: Number(snap?.profile?.followers_count ?? 0),
    history,
    historyDays,
    top,
  }
}

/** Instagram's own player for a post, from its permalink. Never expires, needs no key. */
export const embedUrl = (permalink?: string) =>
  permalink ? `${permalink.replace(/\/?$/, '/')}embed/` : undefined
