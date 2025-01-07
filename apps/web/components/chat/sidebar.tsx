"use client"

import * as React from "react"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  Avatar,
  AvatarFallback,
  AvatarImage,
  ThemeToggle,
} from "@danky/ui"
import {
  ChevronDown,
  Star,
  MessageSquare,
  LayoutDashboard,
  Brain,
  Sparkles,
  ListTodo,
  FileText,
  Settings,
  Shield,
  LogOut,
} from "lucide-react"
import { cn } from "@danky/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface Model {
  id: string
  name: string
  isFavorite: boolean
}

interface SidebarProps {
  user?: {
    name: string
    email: string
    image?: string
    isAdmin?: boolean
  }
  models?: Model[]
  currentModel?: string
  onModelSelect?: (modelId: string) => void
  onToggleFavorite?: (modelId: string) => void
}

const navItems: NavItem[] = [
  {
    title: "Messages",
    href: "/chat",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Knowledge",
    href: "/knowledge",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    title: "Prompts",
    href: "/prompts",
    icon: <Sparkles className="h-4 w-4" />,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: <ListTodo className="h-4 w-4" />,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: <FileText className="h-4 w-4" />,
  },
]

export function Sidebar({
  user = {
    name: "John Doe",
    email: "john@example.com",
    isAdmin: true,
  },
  models = [],
  currentModel = "",
  onModelSelect = () => {},
  onToggleFavorite = () => {},
}: SidebarProps) {
  const pathname = usePathname()

  const favoriteModels = models.filter(m => m.isFavorite)
  const otherModels = models.filter(m => !m.isFavorite)
  const currentModelData = models.find(m => m.id === currentModel)

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-col gap-2 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 w-full justify-between px-4 hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/bot-avatar.png" alt="AI Model" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {currentModelData?.name || "Select Model"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px]" align="start">
            <DropdownMenuLabel>AI Models</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {favoriteModels.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Favorites
                </DropdownMenuLabel>
                {favoriteModels.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => onModelSelect(model.id)}
                    className="justify-between"
                  >
                    <span>{model.name}</span>
                    <Star
                      className="h-4 w-4 text-yellow-400 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(model.id)
                      }}
                      fill="currentColor"
                    />
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            {otherModels.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => onModelSelect(model.id)}
                className="justify-between"
              >
                <span>{model.name}</span>
                <Star
                  className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-yellow-400"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(model.id)
                  }}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 p-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-accent"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-12 w-full justify-start px-4 hover:bg-accent"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2 flex flex-col items-start text-left">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px]" align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            {user.isAdmin && (
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 