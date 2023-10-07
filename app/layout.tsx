'use client'

import { ReactElement } from 'react'
import { AppDateProvider } from '../components/contexts/appDate'

export default function RootLayout({
  children,
}: {
  children: ReactElement
}): ReactElement {
  return (
    <html lang="ja">
      <head>
        <title>Boosted AppDate Demo</title>
      </head>
      <body>
        <AppDateProvider>{children}</AppDateProvider>
      </body>
    </html>
  )
}
