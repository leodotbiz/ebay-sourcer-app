import type { Metadata } from 'next'
import './globals.css'
import AppShell from './AppShell'

export const metadata: Metadata = {
  title: 'eBay Sourcer',
  description: 'Faster sourcing decisions for professional resellers',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}

