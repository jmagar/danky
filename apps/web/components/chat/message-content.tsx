"use client"

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { detectCodeLanguage, isCodeLike } from './utils'

interface MessageContentProps {
  content: string
}

export function MessageContent({ content }: MessageContentProps) {
  // Try to detect if the content is code
  const codeBlockRegex = /^```(\w+)?\n([\s\S]*)\n```$/
  const match = content.match(codeBlockRegex)
  
  if (match) {
    // If language is specified in the code block
    const language = match[1]?.toLowerCase() || 'text'
    const code = match[2]
    
    return (
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, background: 'transparent' }}
      >
        {code}
      </SyntaxHighlighter>
    )
  }

  // Try to parse as JSON if it's not a code block
  try {
    const parsed = JSON.parse(content)
    return (
      <SyntaxHighlighter
        language="json"
        style={oneDark}
        customStyle={{ margin: 0, background: 'transparent' }}
      >
        {JSON.stringify(parsed, null, 2)}
      </SyntaxHighlighter>
    )
  } catch {
    if (isCodeLike(content)) {
      return (
        <SyntaxHighlighter
          language={detectCodeLanguage(content)}
          style={oneDark}
          customStyle={{ margin: 0, background: 'transparent' }}
        >
          {content}
        </SyntaxHighlighter>
      )
    }

    // If not code, return as plain text
    return content
  }
} 