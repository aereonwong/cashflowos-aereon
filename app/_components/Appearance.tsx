'use client'
import { useEffect, useState } from 'react'

// 👉 Appearance controls for Settings: colour theme, light/dark, glass strength.
// Each choice sets an attribute on <html> and is remembered in localStorage; the
// script in layout.tsx replays them before first paint so nothing flashes.
type Mode = 'auto' | 'light' | 'dark'
type Glass = 'clear' | 'frosted' | 'solid'

const ACCENTS: { id: string; label: string; from: string; to: string }[] = [
  { id: 'blue', label: 'Ocean', from: '#007AFF', to: '#6B4DFF' },
  { id: 'purple', label: 'Aurora', from: '#AF52DE', to: '#FF2D92' },
  { id: 'sunset', label: 'Sunset', from: '#FF9F0A', to: '#FF375F' },
  { id: 'emerald', label: 'Jade', from: '#30D158', to: '#0AB3A6' },
  { id: 'rose', label: 'Rose', from: '#FF375F', to: '#AF52DE' },
  { id: 'graphite', label: 'Graphite', from: '#6E7681', to: '#9AA3AE' },
  { id: 'clay', label: 'Clay (original)', from: '#D97757', to: '#B6802A' },
]

const KEYS = { accent: 'cfo-accent', mode: 'cfo-theme', glass: 'cfo-glass' }

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* private mode — still applies for this session */
  }
}
function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export default function Appearance() {
  const [accent, setAccent] = useState('blue')
  const [mode, setMode] = useState<Mode>('auto')
  const [glass, setGlass] = useState<Glass>('frosted')

  useEffect(() => {
    const a = read(KEYS.accent)
    const m = read(KEYS.mode)
    const g = read(KEYS.glass)
    if (a) setAccent(a)
    if (m === 'light' || m === 'dark' || m === 'auto') setMode(m)
    if (g === 'clear' || g === 'frosted' || g === 'solid') setGlass(g)
  }, [])

  const pickAccent = (id: string) => {
    setAccent(id)
    store(KEYS.accent, id)
    const root = document.documentElement
    if (id === 'blue') root.removeAttribute('data-accent')
    else root.setAttribute('data-accent', id)
  }
  const pickMode = (m: Mode) => {
    setMode(m)
    store(KEYS.mode, m)
    const root = document.documentElement
    if (m === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', m)
  }
  const pickGlass = (g: Glass) => {
    setGlass(g)
    store(KEYS.glass, g)
    const root = document.documentElement
    if (g === 'frosted') root.removeAttribute('data-glass')
    else root.setAttribute('data-glass', g)
  }

  return (
    <>
      <div className="set-section">
        <h2>Colour theme</h2>
        <p className="sub">Changes the buttons, charts and the light behind the glass. Saved on this device.</p>
        <div className="swatches">
          {ACCENTS.map(a => (
            <button
              key={a.id}
              type="button"
              className={`swatch${accent === a.id ? ' on' : ''}`}
              onClick={() => pickAccent(a.id)}
              aria-pressed={accent === a.id}
            >
              <span className="dot" style={{ background: `linear-gradient(160deg, ${a.from}, ${a.to})` }} />
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="set-section">
        <h2>Light or dark</h2>
        <p className="sub">Auto follows your phone or Mac.</p>
        <div className="seg">
          {(['auto', 'light', 'dark'] as Mode[]).map(m => (
            <button key={m} type="button" className={mode === m ? 'on' : ''} onClick={() => pickMode(m)}>
              {m === 'auto' ? '🌗 Auto' : m === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
          ))}
        </div>
      </div>

      <div className="set-section">
        <h2>Glass strength</h2>
        <p className="sub">How see-through the panels are. Solid is the easiest to read in bright sun.</p>
        <div className="seg">
          {(['clear', 'frosted', 'solid'] as Glass[]).map(g => (
            <button key={g} type="button" className={glass === g ? 'on' : ''} onClick={() => pickGlass(g)}>
              {g === 'clear' ? 'Clear' : g === 'frosted' ? 'Frosted' : 'Solid'}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
