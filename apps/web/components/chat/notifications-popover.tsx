"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  ScrollArea,
} from "@danky/ui"

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative"
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" />
          {/* Add notification badge here when needed */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h4 className="font-semibold">Notifications</h4>
          <Button
            variant="ghost"
            className="text-xs"
            onClick={() => setIsOpen(false)}
          >
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col gap-1 p-2">
            {/* Add notification items here */}
            <div className="text-center text-sm text-muted-foreground p-4">
              No new notifications
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
} 