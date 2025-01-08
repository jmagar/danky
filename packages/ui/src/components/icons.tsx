import type { HTMLAttributes } from "react"
import {
  Rocket,
  type LucideIcon,
  LucideProps
} from "lucide-react"

export type Icon = LucideIcon
export type IconProps = HTMLAttributes<SVGElement>

export const Icons = {
  rocket: Rocket,
  spinner: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
} satisfies Record<string, Icon | ((props: LucideProps) => JSX.Element)>