export const formatTime = (date: Date) => {
  const now = new Date()
  const messageDate = new Date(date)
  
  // If the message is from today, just show the time
  if (messageDate.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    }).format(messageDate)
  }
  
  // If the message is from this year, show the month and day
  if (messageDate.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    }).format(messageDate)
  }
  
  // Otherwise show the full date
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true
  }).format(messageDate)
}

export const detectCodeLanguage = (str: string): string => {
  if (str.includes('interface ') || str.includes('type ') || str.includes(': string') || str.includes(': number')) {
    return 'typescript'
  }
  if (str.includes('func ') || str.includes('package ')) {
    return 'go'
  }
  if (str.includes('def ') || str.includes('class ') || str.includes('import ')) {
    return 'python'
  }
  if (str.includes('<?php') || str.includes('namespace ')) {
    return 'php'
  }
  if (str.includes('public class') || str.includes('private void')) {
    return 'java'
  }
  return 'javascript' // default to javascript
}

export const isCodeLike = (str: string): boolean => {
  const codeIndicators = [
    /^import\s+.*from/m,           // imports
    /^const\s+.*=/m,               // const declarations
    /^let\s+.*=/m,                 // let declarations
    /^function\s+\w+\s*\(/m,       // function declarations
    /^class\s+\w+/m,               // class declarations
    /^if\s*\(/m,                   // if statements
    /^for\s*\(/m,                  // for loops
    /^while\s*\(/m,                // while loops
    /^async\s+function/m,          // async functions
    /=>/m,                         // arrow functions
    /\{\s*[\r\n]/m,               // opening brackets with newline
    /^\s*return\s+/m,             // return statements
    /^export\s+/m,                 // exports
    /^interface\s+\w+/m,           // TypeScript interfaces
    /^type\s+\w+/m,                // TypeScript types
  ]
  return codeIndicators.some(pattern => pattern.test(str))
} 