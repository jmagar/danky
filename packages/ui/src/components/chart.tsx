"use client"

import * as React from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

import { cn } from "@/lib/utils"

interface ChartProps extends React.ComponentProps<"div"> {
  data: {
    average: number
    today: number
    time: string
  }[]
}

export function Chart({ data, className, ...props }: ChartProps) {
  return (
    <div className={cn("p-4", className)} {...props}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload?.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Average
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Today
                        </span>
                        <span className="font-bold">
                          {payload[1].value}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            strokeWidth={2}
            dataKey="average"
            activeDot={{
              r: 6,
              style: { fill: "var(--theme-primary)", opacity: 0.25 },
            }}
            style={{
              stroke: "var(--theme-primary)",
              opacity: 0.25,
            }}
          />
          <Line
            type="monotone"
            dataKey="today"
            strokeWidth={2}
            activeDot={{
              r: 8,
              style: { fill: "var(--theme-primary)" },
            }}
            style={{ stroke: "var(--theme-primary)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
