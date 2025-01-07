"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{ value: number; timestamp: string }>
}

export function Chart({ data, className, ...props }: ChartProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            activeDot={{
              r: 8,
              style: { fill: "var(--primary)" },
            }}
            style={{
              stroke: "var(--primary)",
            }}
          />
          <Tooltip
            content={({ active, payload }: TooltipProps<number, string>) => {
              if (!active || !payload?.length) return null
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Value
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Time
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].payload.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
