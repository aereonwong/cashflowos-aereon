// 👉 The brands on the public media kit, chosen by Aereon on 26 Sep 2026 for
// prestige and the trust they signal to the next brand — not by how often each
// was invoiced. Order is deliberate: the most recognised lead.
//
// Marks are official vector logos: Simple Icons (CC0) where it covers the brand,
// Wikimedia Commons (public-domain logo files) otherwise, stored in
// public/img/brands/. They are flattened to one ink so the wall reads as a single
// line-up in every world. Sizing is derived from each mark's true aspect ratio
// (see logoSize) rather than tuned by hand.
//
// Kept out, and why: Shangri-La and Visit Dubai have no clean official vector
// available; Singapore Tourism Board's mark sits on a background shape that
// flattens to a solid block. Swap entries here, and drop the SVG in the folder.

export type Brand = { slug: string; name: string; aspect: number }

/** Optical sizing. Each mark's viewBox is cropped to what is actually drawn, and
 *  its height falls as it gets wider: h = 44 · aspect^−0.4. A square symbol is
 *  44px tall; a long wordmark is shorter but wider, so every mark carries a
 *  similar visual weight. */
export const logoSize = (aspect: number) => {
  const h = Math.round(44 * Math.pow(aspect, -0.4))
  return { h, w: Math.min(170, Math.round(h * aspect)) }
}

export const KIT_BRANDS: Brand[] = [
  { slug: 'petronas-towers', name: 'Petronas Twin Towers', aspect: 1.73 },
  { slug: 'tesla', name: 'Tesla', aspect: 1.0 },
  { slug: 'byd', name: 'BYD', aspect: 4.798 },
  { slug: 'dji', name: 'DJI', aspect: 1.672 },
  { slug: 'huawei', name: 'Huawei', aspect: 1.319 },
  { slug: 'xiaomi', name: 'Xiaomi', aspect: 1.0 },
  { slug: 'hyatt', name: 'Hyatt', aspect: 3.889 },
  { slug: 'xpeng', name: 'XPENG', aspect: 7.292 },
  { slug: 'airasia', name: 'AirAsia', aspect: 1.0 },
  { slug: 'insta360', name: 'Insta360', aspect: 0.981 },
  { slug: 'honor', name: 'HONOR', aspect: 4.8 },
  { slug: 'tourism-malaysia', name: 'Tourism Malaysia', aspect: 2.338 },
]
