'use client'
import { useEffect, useState } from 'react'

// 👉 Appearance controls for Settings: colour theme (Basic + Advanced), light/dark,
// glass strength, typeface and the photo background. Each choice sets an attribute
// on <html> and is remembered in localStorage; the script in layout.tsx replays
// them before first paint so nothing flashes.
type Mode = 'auto' | 'light' | 'dark'
type Glass = 'clear' | 'frosted' | 'solid'
type Font = 'grotesk' | 'sora' | 'archivo' | 'system'
type Bg = 'photo' | 'off'

type Swatch = { id: string; label: string; from: string; to: string; note?: string }

const BASIC: Swatch[] = [
  { id: 'blue', label: 'Ocean', from: '#007AFF', to: '#6B4DFF' },
  { id: 'purple', label: 'Aurora', from: '#AF52DE', to: '#FF2D92' },
  { id: 'sunset', label: 'Sunset', from: '#FF9F0A', to: '#FF375F' },
  { id: 'emerald', label: 'Jade', from: '#30D158', to: '#0AB3A6' },
  { id: 'rose', label: 'Rose', from: '#FF375F', to: '#AF52DE' },
  { id: 'graphite', label: 'Graphite', from: '#6E7681', to: '#9AA3AE' },
  { id: 'clay', label: 'Clay', from: '#D97757', to: '#B6802A' },
]

const ADVANCED: Swatch[] = [
  { id: 'solarin', label: 'Solarin', from: '#116466', to: '#FFCB9A', note: 'Teal glass + warm sand' },
  { id: 'refire', label: 'Refire', from: '#003135', to: '#0FA4AF', note: 'Deep sea, cyan, rust' },
  { id: 'moon', label: 'Moon Phases', from: '#212A31', to: '#748D92', note: 'Cinematic slate blue' },
  { id: 'timber', label: 'Timber', from: '#3E362E', to: '#AC8968', note: 'Warm wood, editorial' },
  { id: 'ifly', label: 'iFly', from: '#31708E', to: '#8FC1E3', note: 'Sky blues, airline calm' },
]

const FONTS: { id: Font; label: string; note: string }[] = [
  { id: 'grotesk', label: 'Space Grotesk', note: 'Wide + technical' },
  { id: 'sora', label: 'Sora', note: 'Geometric, modern' },
  { id: 'archivo', label: 'Archivo', note: 'Tall, editorial' },
  { id: 'system', label: 'System', note: 'No web font' },
]

const KEYS = { accent: 'cfo-accent', mode: 'cfo-theme', glass: 'cfo-glass', font: 'cfo-font', bg: 'cfo-bg' }

const store = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* private mode — still applies this session */
  }
}
const read = (k: string): string | null => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const setAttr = (attr: string, value: string, clearWhen: string) => {
  const root = document.documentElement
  if (value === clearWhen) root.removeAttribute(attr)
  else root.setAttribute(attr, value)
}

export default function Appearance() {
  const [accent, setAccent] = useState('blue')
  const [mode, setMode] = useState<Mode>('auto')
  const [glass, setGlass] = useState<Glass>('frosted')
  const [font, setFont] = useState<Font>('grotesk')
  const [bg, setBg] = useState<Bg>('photo')

  useEffect(() => {
    const a = read(KEYS.accent)
    const m = read(KEYS.mode)
    const g = read(KEYS.glass)
    const f = read(KEYS.font)
    const b = read(KEYS.bg)
    if (a) setAccent(a)
    if (m === 'light' || m === 'dark' || m === 'auto') setMode(m)
    if (g === 'clear' || g === 'frosted' || g === 'solid') setGlass(g)
    if (f === 'grotesk' || f === 'sora' || f === 'archivo' || f === 'system') setFont(f)
    if (b === 'photo' || b === 'off') setBg(b)
  }, [])

  const pickAccent = (id: string) => {
    setAccent(id)
    store(KEYS.accent, id)
    setAttr('data-accent', id, 'blue')
  }

  const swatchGrid = (list: Swatch[]) => (
    <div className="swatches">
      {list.map(a => (
        <button
          key={a.id}
          type="button"
          className={`swatch${accent === a.id ? ' on' : ''}`}
          onClick={() => pickAccent(a.id)}
          aria-pressed={accent === a.id}
          title={a.note ?? a.label}
        >
          <span className="dot" style={{ background: `linear-gradient(160deg, ${a.from}, ${a.to})` }} />
          <span>
            {a.label}
            {a.note ? <span className="sw-note">{a.note}</span> : null}
          </span>
        </button>
      ))}
    </div>
  )

  return (
    <>
      <div className="set-section">
        <h2>Colour theme — Basic</h2>
        <p className="sub">Clean single-accent looks. Saved on this device.</p>
        {swatchGrid(BASIC)}
      </div>

      <div className="set-section">
        <h2>Colour theme — Advanced</h2>
        <p className="sub">
          Cinematic palettes drawn from award-winning sites: deep teals, slate blues and warm timber,
          each with its own glow behind the glass.
        </p>
        {swatchGrid(ADVANCED)}
      </div>

      <div className="set-section">
        <h2>Light or dark</h2>
        <p className="sub">Auto follows your phone or Mac.</p>
        <div className="seg">
          {(['auto', 'light', 'dark'] as Mode[]).map(m => (
            <button
              key={m}
              type="button"
              className={mode === m ? 'on' : ''}
              onClick={() => {
                setMode(m)
                store(KEYS.mode, m)
                setAttr('data-theme', m, 'auto')
              }}
            >
              {m === 'auto' ? '🌗 Auto' : m === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
          ))}
        </div>
      </div>

      <div className="set-section">
        <h2>Typeface</h2>
        <p className="sub">Headings font. Body text stays Inter for readability.</p>
        <div className="seg wrap">
          {FONTS.map(f => (
            <button
              key={f.id}
              type="button"
              className={font === f.id ? 'on' : ''}
              onClick={() => {
                setFont(f.id)
                store(KEYS.font, f.id)
                document.documentElement.setAttribute('data-font', f.id)
              }}
              title={f.note}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="set-section">
        <h2>Glass strength</h2>
        <p className="sub">How see-through the panels are. Solid is the easiest to read in bright sun.</p>
        <div className="seg">
          {(['clear', 'frosted', 'solid'] as Glass[]).map(g => (
            <button
              key={g}
              type="button"
              className={glass === g ? 'on' : ''}
              onClick={() => {
                setGlass(g)
                store(KEYS.glass, g)
                setAttr('data-glass', g, 'frosted')
              }}
            >
              {g === 'clear' ? 'Clear' : g === 'frosted' ? 'Frosted' : 'Solid'}
            </button>
          ))}
        </div>
      </div>

      <div className="set-section">
        <h2>Background</h2>
        <p className="sub">Your KLCC Merdeka photo, dimmed behind every tab — or plain colour.</p>
        <div className="seg">
          {([
            ['photo', '🌃 KLCC photo'],
            ['off', 'Plain colour'],
          ] as [Bg, string][]).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={bg === id ? 'on' : ''}
              onClick={() => {
                setBg(id)
                store(KEYS.bg, id)
                document.documentElement.setAttribute('data-bg', id)
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
