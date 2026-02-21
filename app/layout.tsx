export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#050507', color: 'white', margin: 0, fontFamily: 'monospace' }}>
        {children}
      </body>
    </html>
  )
}
