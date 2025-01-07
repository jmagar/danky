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
import { Search as SearchIcon } from "lucide-react"

export function Search() {
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

  return (
    <>
      <Button
        variant="outline"
        className="relative h-8 w-full justify-start max-w-[400px] text-sm text-muted-foreground mx-auto"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span>Search messages...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent Conversations">
            {/* We'll populate this with actual data later */}
            <CommandItem>Chat about React components</CommandItem>
            <CommandItem>TypeScript discussion</CommandItem>
            <CommandItem>API integration planning</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Tools">
            {/* We'll integrate this with the actual tools */}
            <CommandItem>Code Analysis</CommandItem>
            <CommandItem>Database Query</CommandItem>
            <CommandItem>File Operations</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 