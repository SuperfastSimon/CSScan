import './globals.css'
import React from 'react'

export const metadata = {
  title: 'CS-SCAN PRO',
  description: 'Security Analysis Terminal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
