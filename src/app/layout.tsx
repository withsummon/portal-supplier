import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Summon Supplier Portal',
    template: '%s — Summon Supplier Portal',
  },
  description:
    'Submit and track your projects with Summon — your trusted B2B project execution partner. Access business insights, generate client pitches, and explore enterprise AI solutions.',
  openGraph: {
    type: 'website',
    siteName: 'Summon Supplier Portal',
    title: 'Summon Supplier Portal',
    description:
      'Submit and track your projects with Summon — your trusted B2B project execution partner.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
