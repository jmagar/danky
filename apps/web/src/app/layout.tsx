import React from 'react';
import { Noto_Sans } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import { cn } from '@danky/ui';
import { Providers } from '../components/providers';
import './globals.css';
import { Toaster } from '@danky/ui';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Danky',
  description: 'AI-powered chat interface',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head />
      <body
        className={cn(notoSans.variable, 'bg-background font-sans antialiased', 'h-full w-full')}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
