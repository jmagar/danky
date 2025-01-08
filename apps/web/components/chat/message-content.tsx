"use client"

import { getHighlighter, type Highlighter, bundledLanguages } from 'shiki'
import { useTheme } from 'next-themes'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { useEffect, useState } from 'react'

interface MessageContentProps {
  content: string
}

export function MessageContent({ content }: MessageContentProps) {
  const { theme } = useTheme()
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)

  useEffect(() => {
    getHighlighter({
      themes: [theme === 'dark' ? 'github-dark' : 'github-light'],
      langs: Object.keys(bundledLanguages),
    }).then(setHighlighter)
  }, [theme])

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : 'text'

          if (!className || !highlighter) {
            return <code className={className}>{children}</code>
          }

          const html = highlighter.codeToHtml(String(children), {
            lang: language,
            theme: theme === 'dark' ? 'github-dark' : 'github-light',
          })

          return (
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              className="not-prose"
            />
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
} 