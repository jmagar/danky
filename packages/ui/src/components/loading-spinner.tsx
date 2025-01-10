'use client'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
