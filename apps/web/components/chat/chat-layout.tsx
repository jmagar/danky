'use client'

import { ReactNode } from 'react'

interface ChatLayoutProps {
  children: ReactNode
  sidebar: ReactNode
}

export function ChatLayout({ children, sidebar }: ChatLayoutProps) {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-background">
        {sidebar}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}