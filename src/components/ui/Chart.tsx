"use client"

import * as React from "react"
import { BarChart, LineChart, PieChart } from "@mui/x-charts"
import { Box } from "@mui/material"
import { cn } from "@/lib/utils"
import { useTheme as useCustomTheme } from "@/context/ThemeContext"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: Record<string, any>
  }
>(({ className, config, children, ...props }, ref) => (
  <Box ref={ref} className={cn("w-full h-full", className)} {...props}>
    {children}
  </Box>
))
ChartContainer.displayName = "ChartContainer"

// Line Chart Component using MUI X Charts with theme support
const LineChartComponent = ({ dataset, xAxis, series, width, height }: any) => {
  const { theme } = useCustomTheme()

  // Define colors based on theme
  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
  const backgroundColor = theme === "dark" ? "transparent" : "transparent"

  return (
    <LineChart
      dataset={dataset}
      xAxis={xAxis.map((axis: any) => ({
        ...axis,
        tickLabelStyle: {
          fill: textColor,
          fontSize: 12,
        },
      }))}
      yAxis={[
        {
          tickLabelStyle: {
            fill: textColor,
            fontSize: 12,
          },
        },
      ]}
      series={series}
      width={width}
      height={height}
      margin={{ left: 50, right: 30, top: 30, bottom: 50 }}
      grid={{
        vertical: true,
        horizontal: true,
      }}
      sx={{
        backgroundColor,
        "& .MuiChartsAxis-line": {
          stroke: textColor,
        },
        "& .MuiChartsAxis-tick": {
          stroke: textColor,
        },
        "& .MuiChartsLegend-series text": {
          fill: textColor,
        },
        "& .MuiChartsTooltip-root": {
          backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
          color: textColor,
          border: `1px solid ${gridColor}`,
        },
        "& .MuiChartsTooltip-table": {
          color: textColor,
        },
        "& .MuiChartsGrid-line": {
          stroke: gridColor,
          strokeOpacity: 0.3,
        },
        "& .MuiChartsGrid-root": {
          "& line": {
            stroke: gridColor,
            strokeOpacity: 0.3,
          },
        },
      }}
    />
  )
}

// Replace BarChart with LineChart for consistency
const CustomBarChart = LineChartComponent

export { Chart, ChartContainer, BarChart, LineChart, PieChart, LineChartComponent, CustomBarChart }
