"use client"

import * as React from "react"
import { ThemeProvider } from "@danky/ui"
import { Toaster } from "@danky/ui"
import "@danky/ui/styles/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Danky AI Chat</title>
        <meta name="description" content="A modern AI chatbot interface" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
