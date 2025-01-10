"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Button,
  DialogTitle,
} from "@danky/ui"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Search as SearchIcon } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  type: 'conversation' | 'tool'
  category?: string
}

interface SearchProps {
  recentConversations?: SearchResult[]
  availableTools?: SearchResult[]
  onSelect?: (result: SearchResult) => void
}

export function Search({
  recentConversations = [],
  availableTools = [],
  onSelect = () => {},
}: SearchProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = React.useCallback((result: SearchResult) => {
    onSelect(result)
    setOpen(false)
  }, [onSelect])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-8 w-full justify-start text-sm text-muted-foreground
          hover:border-muted-foreground/50 transition-colors
          focus-visible:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring
          group"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 group-hover:text-foreground/80 transition-colors" />
        <span className="inline-flex items-center">
          Search messages...
          <span className="ml-2 text-xs text-muted-foreground/50">
            (Press ⌘K)
          </span>
        </span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted/50 px-1.5 font-mono text-[10px] font-medium opacity-100 transition-colors group-hover:bg-muted sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <CommandInput
          placeholder="Type a command or search..."
          className="border-none focus-visible:ring-0"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {recentConversations.length > 0 && (
            <>
              <CommandGroup heading="Recent Conversations">
                {recentConversations.map((conversation) => (
                  <CommandItem
                    key={conversation.id}
                    className="hover:bg-muted/80 cursor-pointer"
                    onSelect={() => handleSelect(conversation)}
                  >
                    {conversation.title}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator className="bg-border/50" />
            </>
          )}
          {availableTools.length > 0 && (
            <CommandGroup heading="Tools">
              {availableTools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  className="hover:bg-muted/80 cursor-pointer"
                  onSelect={() => handleSelect(tool)}
                >
                  {tool.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
