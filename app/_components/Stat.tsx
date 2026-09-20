import Link from 'next/link'
import Icon, { type IconName } from './Icon'

// A single label + value card (the money row + counts). Set `yes` to give it the
// accent "needs your attention" look; pass `href` to make the whole card a link
// (e.g. the 🙋 count links to /approvals); pass `icon` for a small glyph beside
// the label. Styles: .stat in globals.css.
export default function Stat({
  label,
  value,
  yes,
  href,
  icon,
}: {
  label: string
  value: string | number
  yes?: boolean
  href?: string
  icon?: IconName
}) {
  const card = (
    <div className={`stat${yes ? ' yes' : ''}`}>
      <p className="l">
        {icon ? <Icon name={icon} /> : null}
        {label}
      </p>
      <p className="v">{value}</p>
    </div>
  )
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {card}
      </Link>
    )
  }
  return card
}
