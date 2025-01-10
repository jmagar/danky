"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "../card"

import type { TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: any[]
  href: string
  title: string
}

export function Chart({ data, className, href, title, ...props }: ChartProps) {
  return (
    <Card className={cn("space-y-4", className)} href={href} title={title} {...props}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="total"
            strokeWidth={2}
            activeDot={{
              r: 8,
            }}
            style={
              {
                stroke: "hsl(var(--primary))",
              } as React.CSSProperties
            }
          />
          <Tooltip
            content={({ active, payload }: TooltipProps<ValueType, NameType>) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Total
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }

              return null
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
