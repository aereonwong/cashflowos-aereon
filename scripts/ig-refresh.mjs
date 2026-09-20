// Refresh the Instagram snapshot from THIS computer, using the Composio CLI you
// already logged into (`composio login`). No Composio API key needed — handy
// before the app itself has one.
//
//   npm run ig:refresh
//
// It writes one new row into ig_snapshots; the Instagram tab reads the newest.
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createClient } from '@supabase/supabase-js'

const run = promisify(execFile)
const CLI = `${process.env.HOME}/.local/bin/composio`

async function exec(slug, args) {
  const { stdout } = await run(CLI, ['execute', slug, '-d', JSON.stringify(args)], {
    maxBuffer: 1 << 26,
    env: { ...process.env, NO_COLOR: '1' },
  })
  const json = JSON.parse(stdout)
  if (json.successful === false) throw new Error(`${slug}: ${json.error ?? 'failed'}`)
  return json
}

// Same shaping as lib/instagram.ts (kept small here so the script stays plain Node).
async function buildSnapshot(limit = 24) {
  const info = await exec('INSTAGRAM_GET_USER_INFO', {})
  const profile = info.data ?? {}
  const media = await exec('INSTAGRAM_GET_IG_USER_MEDIA', {
    ig_user_id: String(profile.id),
    limit,
    fields: 'id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count',
  })
  const items = media.data?.data ?? []
  const posts = []
  for (const m of items) {
    const post = {
      id: String(m.id),
      timestamp: String(m.timestamp ?? ''),
      type: String(m.media_product_type ?? m.media_type ?? 'FEED'),
      caption: String(m.caption ?? '').replace(/\s+/g, ' ').trim(),
      permalink: m.permalink,
      likes: Number(m.like_count ?? 0),
      comments: Number(m.comments_count ?? 0),
    }
    try {
      const ins = await exec('INSTAGRAM_GET_IG_MEDIA_INSIGHTS', {
        ig_media_id: post.id,
        metric: ['views', 'reach', 'saved', 'shares'],
      })
      for (const row of ins.data?.data ?? []) {
        const v = row.values?.[0]?.value
        if (typeof v === 'number') post[row.name === 'saved' ? 'saved' : row.name] = v
      }
    } catch {
      /* a post without insights is still a post */
    }
    posts.push(post)
    process.stdout.write('.')
  }
  process.stdout.write('\n')
  return { captured_at: new Date().toISOString(), username: String(profile.username ?? ''), profile, posts }
}

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const snap = await buildSnapshot(Number(process.argv[2] ?? 24))
const supabase = createClient(url, key)
const { error } = await supabase.from('ig_snapshots').insert({
  captured_at: snap.captured_at,
  username: snap.username,
  profile: snap.profile,
  posts: snap.posts,
})
if (error) {
  console.error('❌ Could not save snapshot:', error.message)
  process.exit(1)
}
console.log(`✅ Saved snapshot for @${snap.username}: ${snap.posts.length} posts, ${snap.profile.followers_count} followers`)
