'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import Icon from '@/app/_components/Icon'

// A search box that writes `q` into the URL a moment after typing stops.
export default function Search({ placeholder }: { placeholder: string }) {
  const router = useRouter()
  const path = usePathname()
  const params = useSearchParams()
  const [value, setValue] = useState(params?.get('q') ?? '')
  const [pending, start] = useTransition()

  useEffect(() => {
    const t = setTimeout(() => {
      if ((params?.get('q') ?? '') === value) return
      const p = new URLSearchParams(params?.toString())
      if (value) p.set('q', value)
      else p.delete('q')
      start(() => router.replace(`${path}${p.toString() ? `?${p}` : ''}`, { scroll: false }))
    }, 280)
    return () => clearTimeout(t)
  }, [value, params, path, router])

  return (
    <label className="v3-search" data-pending={pending}>
      <Icon name="search" />
      <input type="search" value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </label>
  )
}
