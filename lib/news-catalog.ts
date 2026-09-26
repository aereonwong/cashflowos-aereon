// The news sections — pure data, safe for client components.
export type NewsSection = 'tech' | 'travel' | 'malaysia' | 'angles'
export const SECTIONS: { id: NewsSection; label: string }[] = [
  { id: 'tech', label: 'Tech' },
  { id: 'travel', label: 'Travel' },
  { id: 'malaysia', label: 'Malaysia & SEA' },
  { id: 'angles', label: 'Content angles' },
]
