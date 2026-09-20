'use client'
import { useEffect, useState } from 'react'

// 👉 Light / Dark / Auto switch. "Auto" follows your device; the other two set
// <html data-theme="…">, which the tokens in globals.css key off. The choice is
// remembered in localStorage and applied before paint by the script in layout.tsx,
// so there's no flash of the wrong theme on reload.
type Mode = 'auto' | 'light' | 'dark'
const NEXT: Record<Mode, Mode> = { auto: 'light', light: 'dark', dark: 'auto' }
const FACE: Record<Mode, { ico: string; label: string }> = {
  auto: { ico: '🌗', label: 'Auto' },
  light: { ico: '☀️', label: 'Light' },
  dark: { ico: '🌙', label: 'Dark' },
}

function apply(mode: Mode) {
  const root = document.documentElement
  if (mode === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', mode)
  try {
    localStorage.setItem('cfo-theme', mode)
  } catch {
    /* private mode — the toggle still works for this session */
  }
}

export default function ThemeToggle() {
  // Start at 'auto' so the server and first client render agree; the real value
  // lands in the effect below (the early script already painted the right theme).
  const [mode, setMode] = useState<Mode>('auto')

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem('cfo-theme')
    } catch {
      /* ignore */
    }
    if (saved === 'light' || saved === 'dark' || saved === 'auto') setMode(saved)
  }, [])

  const face = FACE[mode]
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => {
        const next = NEXT[mode]
        setMode(next)
        apply(next)
      }}
      aria-label={`Theme: ${face.label}. Click to change.`}
    >
      <span className="tt-ico" aria-hidden="true">{face.ico}</span>
      <span>{face.label}</span>
    </button>
  )
}
