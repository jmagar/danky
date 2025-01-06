import type { HTMLAttributes } from "react"
import {
  Rocket,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type Icon = LucideIcon
export type IconProps = HTMLAttributes<SVGElement>

export const Icons = {
  rocket: Rocket
} satisfies Record<string, Icon> 