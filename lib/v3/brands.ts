// 👉 The brands on the public media kit, chosen by Aereon on 26 Sep 2026 for
// prestige and the trust they signal to the next brand — not by how often each
// was invoiced. Order is deliberate: the most recognised lead.
//
// Marks are official vector logos: Simple Icons (CC0) where it covers the brand,
// Wikimedia Commons (public-domain logo files) otherwise, stored in
// public/img/brands/. They are flattened to one ink so the wall reads as a single
// line-up in every world. `scale` is optical sizing: a wide wordmark needs less
// height than a compact symbol to carry the same visual weight.
//
// Kept out, and why: Shangri-La and Visit Dubai have no clean official vector
// available; Singapore Tourism Board's mark sits on a background shape that
// flattens to a solid block. Swap entries here, and drop the SVG in the folder.

export type Brand = { slug: string; name: string; scale: number }

export const KIT_BRANDS: Brand[] = [
  { slug: 'petronas-towers', name: 'Petronas Twin Towers', scale: 1.15 },
  { slug: 'tesla', name: 'Tesla', scale: 1 },
  { slug: 'byd', name: 'BYD', scale: 0.85 },
  { slug: 'dji', name: 'DJI', scale: 0.85 },
  { slug: 'huawei', name: 'Huawei', scale: 1 },
  { slug: 'xiaomi', name: 'Xiaomi', scale: 0.95 },
  { slug: 'hyatt', name: 'Hyatt', scale: 0.9 },
  { slug: 'xpeng', name: 'XPENG', scale: 0.85 },
  { slug: 'airasia', name: 'AirAsia', scale: 1 },
  { slug: 'insta360', name: 'Insta360', scale: 1 },
  { slug: 'honor', name: 'HONOR', scale: 1.3 },
  { slug: 'tourism-malaysia', name: 'Tourism Malaysia', scale: 1.2 },
]
