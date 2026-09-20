'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// 👉 The demo-data switch. It sets a cookie the SERVER reads (lib/records.ts), so
// every tab re-renders from an invented business instead of your Supabase rows.
// Your real data is never touched — flipping it back shows it again untouched.
// The Telegram bot, the morning brief and Instagram are unaffected.
export default function DemoToggle({ initial }: { initial: boolean }) {
  const router = useRouter()
  const [on, setOn] = useState(initial)
  const [busy, setBusy] = useState(false)

  const flip = () => {
    const next = !on
    setOn(next)
    setBusy(true)
    document.cookie = next
      ? 'cfo-demo=1; path=/; max-age=31536000; samesite=lax'
      : 'cfo-demo=; path=/; max-age=0; samesite=lax'
    router.refresh()
    setTimeout(() => setBusy(false), 600)
  }

  return (
    <div className={`switchrow${on ? ' demo-flag' : ''}`}>
      <div>
        <p className="sr-t">Use demo data{busy ? ' …' : ''}</p>
        <p className="sr-s">
          Fills every money, invoice, client, pipeline and task tab with an invented business, so you can
          explore or show the app without your real numbers. Your own records stay exactly as they are and
          come back the moment you switch this off. Instagram keeps showing your real account either way,
          and your Telegram bot always answers from the real data.
        </p>
      </div>
      <button
        type="button"
        className={`switch${on ? ' on' : ''}`}
        onClick={flip}
        role="switch"
        aria-checked={on}
        aria-label="Use demo data"
      >
        <span className="knob" />
      </button>
    </div>
  )
}
