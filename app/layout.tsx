import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CS-SCAN PRO',
  description: 'Security Analysis Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
