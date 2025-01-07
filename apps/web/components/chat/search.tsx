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
        <CommandInput placeholder="Type a command or search..." className="border-none focus-visible:ring-0" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent Conversations">
            {/* We'll populate this with actual data later */}
            <CommandItem className="hover:bg-muted/80 cursor-pointer">
              Chat about React components
            </CommandItem>
            <CommandItem className="hover:bg-muted/80 cursor-pointer">
              TypeScript discussion
            </CommandItem>
            <CommandItem className="hover:bg-muted/80 cursor-pointer">
              API integration planning
            </CommandItem>
          </CommandGroup>
          <CommandSeparator className="bg-border/50" />
          <CommandGroup heading="Tools">
            {/* We'll integrate this with the actual tools */}
            <CommandItem className="hover:bg-muted/80 cursor-pointer">
              Code Analysis
            </CommandItem>
            <CommandItem className="hover:bg-muted/80 cursor-pointer">
              Database Query
            </CommandItem>
            <CommandItem className="hover:bg-muted/80 cursor-pointer">
              File Operations
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 