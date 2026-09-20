import './globals.css'
import type { Metadata, Viewport } from 'next'
import Nav from './_components/Nav'
import BottomNav from './_components/BottomNav'
import ConnStatus from './_components/ConnStatus'
import ThemeToggle from './_components/ThemeToggle'
import { getPendingCount, demoMode } from '@/lib/records'

export const metadata: Metadata = {
  title: 'CashFlowOS AI Agents 🤖',
  description: 'Your Money Robot — one AI HQ for the whole business.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'CashFlowOS', statusBarStyle: 'default' },
}

// theme-color drives the phone status-bar tint when installed to the home screen.
export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [pending, demo] = await Promise.all([getPendingCount(), demoMode()])
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved theme before first paint so there's no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var d=document.documentElement,m=localStorage.getItem('cfo-theme'),a=localStorage.getItem('cfo-accent'),g=localStorage.getItem('cfo-glass');if(m==='light'||m==='dark')d.setAttribute('data-theme',m);if(a&&a!=='blue')d.setAttribute('data-accent',a);if(g==='clear'||g==='solid')d.setAttribute('data-glass',g)}catch(e){}",
          }}
        />
      </head>
      <body>
        <div className="app">
          {/* Desktop sidebar — hidden on phones (BottomNav takes over ≤768px). */}
          <aside className="side">
            <div className="brand"><span className="logo" aria-hidden="true">🤖</span> CashFlowOS AI Agents</div>
            <Nav pendingCount={pending} />
            <p className="hint">One <code>records</code> table behind every tab. Your robots live in <code>agents/</code>.</p>
            <ThemeToggle />
          </aside>
          <main className="main">
            <ConnStatus />
            {demo ? (
              <div className="banner warn">
                <b>Demo data is on.</b> Every money, invoice, client and pipeline tab is showing an invented
                business. Your real records are untouched — turn it off in <a href="/settings">Settings</a>.
                Instagram and your Telegram bot still use real data.
              </div>
            ) : null}
            {children}
          </main>
        </div>
        {/* Phone bottom bar — hidden on desktop. */}
        <BottomNav />
      </body>
    </html>
  )
}
