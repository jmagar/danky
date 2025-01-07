'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@danky/ui'

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <Loader2 className={cn('h-6 w-6 animate-spin', className)} />
  )
} 