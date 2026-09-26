import { Barlow, Barlow_Condensed, Share_Tech_Mono, Caveat_Brush, Chakra_Petch, Geist, Geist_Mono } from 'next/font/google'

// 👉 v3's type, chosen per world from that world's own objects rather than from
// the defaults every generated dashboard reaches for. Loaded only by the v3
// shell, so v1 and v2 never download them.
//
//   Contact Sheet — Barlow, the condensed industrial grotesk of film boxes and
//                   darkroom labels; Share Tech Mono for the edge code, which is
//                   a real measurement (invoice numbers); Caveat Brush for the
//                   waxy china-marker notes a photographer writes on a sheet.
//   Flight HUD    — Chakra Petch, one technical face for every readout.
//   Studio Standard — Geist, the category's own face, played straight.

const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--f-barlow', display: 'swap' })
const barlowCond = Barlow_Condensed({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--f-barlow-cond', display: 'swap' })
const edge = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--f-edge', display: 'swap' })
const marker = Caveat_Brush({ subsets: ['latin'], weight: '400', variable: '--f-marker', display: 'swap' })
const chakra = Chakra_Petch({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--f-chakra', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--f-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--f-geist-mono', display: 'swap' })

export const v3Fonts = [barlow, barlowCond, edge, marker, chakra, geist, geistMono].map(f => f.variable).join(' ')
