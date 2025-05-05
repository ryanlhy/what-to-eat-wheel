export const metadata = {
  title: 'WEW - What To Eat',
  description: 'Let the wheel decide your next meal in Singapore!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="overflow-x-hidden">{children}</body>
    </html>
  )
}
