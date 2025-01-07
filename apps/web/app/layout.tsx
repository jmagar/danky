"use client"

import { Noto_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { cn } from "@danky/ui"
import "./globals.css"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body 
        className={cn(
          notoSans.variable,
          "font-sans antialiased min-h-screen bg-background",
          "flex flex-col overflow-hidden"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
