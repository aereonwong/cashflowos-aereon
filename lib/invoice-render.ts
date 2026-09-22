import type { Rec } from './records'

// 👉 Turning a filed invoice into the exact Canva edit that draws it.
//
// WHY THIS FILE EXISTS — it is a token-cost decision, not a style one.
// Canva's design-editing API lives only in the MCP connector, so the Canva step
// has to be driven by Claude rather than by this app. The expensive part of that
// is DISCOVERY: `read-design` returns the entire element tree (~9,000 tokens)
// just to learn which element holds which field.
//
// It only has to be learnt once. Every invoice is a copy of the same source
// design, and a copy inherits its element ids, so the map below is stable.
// With it the render is four cheap calls and no exploration:
//
//   1. copy-design            (source below)                        ~200 tokens
//   2. read-design            filter: {fields:["thumbnails"]}      ~1,800 tokens
//      → returns ONLY a transaction_id and a thumbnail, not the tree
//   3. edit-design            operations: buildOperations(invoice) ~12,000 tokens
//   4. edit-design            finalize: "commit"                     ~100 tokens
//
// The PDF export afterwards costs this app nothing — it is a plain REST call the
// server makes through Composio (CANVA_POST_EXPORTS), no model involved.
//
// If the source design is ever replaced, re-read the new one ONCE with the full
// tree and update PAGE + FIELDS. That is a one-off cost, not a per-invoice one.

/** The canonical templates. Both live in the Canva folder "SYCP Templates (bot)".
 *  The quotation was made as a COPY of the invoice and only its wording changed,
 *  so the two layouts are identical by construction and cannot drift apart —
 *  which is exactly what went wrong with the hand-placed ones. A copy inherits
 *  element ids, so the single FIELDS map below drives both. */
export const TEMPLATES = {
  invoice: 'DAHV2ML9PtM',
  quotation: 'DAHV5YQpb70',
} as const
export type DocKind = keyof typeof TEMPLATES

/** Page id of the source design — every locator is prefixed with it. */
const PAGE = 'PBCY2tSg9MmB06fp'

/** Which element holds which field, learnt once from the source design. */
export const FIELDS = {
  numberAndDate: `${PAGE}-LBKPP21CHKtJ2yf1-LBkZscVPqvZqvNck`,
  client: `${PAGE}-LBhtPsYH96y17cpl`,
  description: `${PAGE}-LB9DT0m1PNrmts7w`,
  price: `${PAGE}-LBBbkYJgmJD49hf9`,
  qty: `${PAGE}-LB2N80sgNgMB5fjk`,
  lineAmount: `${PAGE}-LB1pMj0cQ4zv02w0`,
  subtotal: `${PAGE}-LBr9mt6Bw1fR7xwV-LBNxX0Wb5l5vzmhC`,
  total: `${PAGE}-LBr9mt6Bw1fR7xwV-LB77S3CrfV7rZYZX`,
  footer: `${PAGE}-LB8q68pQyP4p2Vf1`,
} as const

/** The footer, minus the IC number that used to be printed on every invoice. */
export const FOOTER =
  'PHONE: 0122100827\nIG: aereonwong\nEMAIL: aereon.wong@gmail.com\nTAX ID: C29931532000\n'

const money = (n: number, cur: string) =>
  `${cur} ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/** DD/MM/YY, the form used across the whole back catalogue. */
const stamp = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y.slice(2)}`
}

export type Operation = Record<string, unknown>

/**
 * The full `operations` array for `edit-design`, built from a filed invoice row.
 *
 * One quirk worth knowing: `replace_text` collapses an element to its FIRST text
 * run's formatting. The description's first run is bold in the source, so a bare
 * replace would render the whole scope of work bold. The `format_text` that
 * follows resets it to normal weight, which is why the two always ship together.
 */
export function buildOperations(rec: Rec, kind: DocKind = 'invoice'): Operation[] {
  const m = rec.meta ?? {}
  const isQuote = kind === 'quotation'
  const cur = String(m.currency ?? 'MYR')
  const net = Number(rec.amount ?? 0)
  const list = Number(m.list_price ?? net)
  const discount = Number(m.discount ?? 0)

  const clientBlock = [
    '',
    m.contact ? `ATTN: ${m.contact}` : '',
    String(m.customer ?? ''),
    m.client_reg ? String(m.client_reg) : '',
    String(m.address ?? ''),
  ]
    .filter(Boolean)
    .join('\n')

  const body = [
    String(m.job ?? rec.title),
    '',
    'Scope of Work:',
    ...(Array.isArray(m.deliverables) ? m.deliverables.map(String) : []),
    ...(discount ? ['', `Discount applied: −${money(discount, cur)}`] : []),
    ...(m.terms ? ['', 'Payment Terms', String(m.terms)] : []),
    ...(isQuote
      ? ['', `This quotation is valid for ${Number(m.validity_days ?? 14)} days from the date above.`]
      : []),
  ].join('\n')

  const header = [
    '',
    `${isQuote ? 'QUOTATION' : 'INVOICE'} No. ${m.invoice_no}`,
    ...(!isQuote && m.quotation_no ? [`quotation no. ${m.quotation_no}`] : []),
    `Date: ${stamp(String(m.invoice_date))}`,
  ].join('\n')

  return [
    { type: 'update_title', title: `${m.invoice_no} - ${m.job ?? rec.title}` },
    { type: 'replace_text', locator_id: FIELDS.numberAndDate, text: header },
    { type: 'replace_text', locator_id: FIELDS.client, text: clientBlock },
    { type: 'replace_text', locator_id: FIELDS.description, text: body },
    // Undo the bold inherited from the first run — see the note above.
    { type: 'format_text', locator_id: FIELDS.description, formatting: { font_weight: 'normal' } },
    { type: 'replace_text', locator_id: FIELDS.price, text: `${money(list, cur)}\n` },
    { type: 'replace_text', locator_id: FIELDS.qty, text: '1' },
    { type: 'replace_text', locator_id: FIELDS.lineAmount, text: money(list, cur) },
    { type: 'replace_text', locator_id: FIELDS.subtotal, text: money(list, cur) },
    { type: 'replace_text', locator_id: FIELDS.total, text: money(net, cur) },
    { type: 'replace_text', locator_id: FIELDS.footer, text: FOOTER },
  ]
}

/** Invoices AND quotations filed by the bot that have no Canva document yet. */
export function pendingRender(rows: Rec[]): Rec[] {
  return rows
    .filter(
      r =>
        (r.category === 'cash_in' || (r.category === 'doc' && r.status === 'quotation')) &&
        r.meta?.invoice_no &&
        r.meta?.render?.status === 'pending',
    )
    .sort((a, b) => String(a.meta?.invoice_date).localeCompare(String(b.meta?.invoice_date)))
}

/** Which template a filed row should be drawn from. */
export const kindOf = (r: Rec): DocKind => (r.category === 'doc' && r.status === 'quotation' ? 'quotation' : 'invoice')
