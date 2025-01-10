"use client"

import { getHighlighter, type Highlighter, bundledLanguages } from 'shiki'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface MessageContentProps {
  content: string
  language?: string
  fileName?: string
  lineNumbers?: boolean
}

export function MessageContent({
  content,
  language = 'text',
  fileName,
  lineNumbers = true
}: MessageContentProps) {
  const { theme } = useTheme()
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)

  useEffect(() => {
    getHighlighter({
      themes: [theme === 'dark' ? 'github-dark' : 'github-light'],
      langs: Object.keys(bundledLanguages),
    }).then(setHighlighter)
  }, [theme])

  if (!highlighter) {
    return (
      <pre className="whitespace-pre-wrap break-words">
        <code>{content}</code>
      </pre>
    )
  }

  const html = highlighter.codeToHtml(content, {
    lang: language,
    theme: theme === 'dark' ? 'github-dark' : 'github-light',
  })

  return (
    <div className="relative rounded-lg bg-muted/50 p-4">
      {fileName && (
        <div className="mb-2 text-sm text-muted-foreground">
          {fileName}
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className="not-prose overflow-x-auto"
        style={{
          maxHeight: '400px',
        }}
      />
    </div>
  )
}
