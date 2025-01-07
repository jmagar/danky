import { Noto_Sans } from "next/font/google"
import { Metadata, Viewport } from "next"
import { cn } from "@danky/ui"
import { Providers } from "../components/providers"
import "./globals.css"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'Danky',
  description: 'AI-powered chat interface',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
