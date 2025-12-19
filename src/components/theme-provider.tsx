'use client'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NuqsAdapter>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </NuqsAdapter>
  )
}
