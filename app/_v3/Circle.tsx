// The grease-pencil circle: a hand-drawn loop, not a geometric ellipse. It
// overshoots its start the way a real china-marker loop does. Only the Contact
// Sheet world shows it; the stroke draws itself on (see v3.css, v3-draw).
export default function Circle({ drawn = false }: { drawn?: boolean }) {
  return (
    <svg className={`v3-circle${drawn ? ' drawn' : ''}`} viewBox="0 0 120 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M62 6 C 26 4, 6 22, 7 50 C 8 80, 34 95, 64 94 C 96 93, 115 74, 113 47 C 111 21, 88 5, 58 8 C 45 9, 36 13, 30 18" />
    </svg>
  )
}
