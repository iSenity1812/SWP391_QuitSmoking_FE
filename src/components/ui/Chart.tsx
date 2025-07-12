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

  // Validate dataset
  if (!dataset || !Array.isArray(dataset) || dataset.length === 0) {
    return <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      No data available
    </div>
  }

  // Filter out items with undefined/null data
  const validDataset = dataset.filter(item => {
    if (!item) return false

    // Check if required field exists and has a value
    const dateField = xAxis?.[0]?.dataKey || 'date'
    const dateValue = item[dateField]

    // Just check if the value exists, don't validate as Date since we support various formats:
    // - DAY: "14/06", "15/06" 
    // - MONTH: "T7", "T8"
    // - YEAR: "2025", "2024"
    return dateValue !== undefined && dateValue !== null && dateValue !== ''
  })

  if (validDataset.length === 0) {
    return <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      No valid data to display
    </div>
  }

  // Define colors based on theme
  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
  const backgroundColor = theme === "dark" ? "transparent" : "transparent"

  return (
    <LineChart
      dataset={validDataset}
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
          tickNumber: 5,
          valueFormatter: (value: number) => Math.round(value).toString(),
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

// BarChartComponent for status distribution and categorical data
interface BarChartData {
  label: string
  value: number
  color?: string
}

interface BarChartComponentProps {
  data: BarChartData[]
  width?: number
  height?: number
  className?: string
  backgroundColor?: string
}

const BarChartComponent = ({
  data,
  width = 500,
  height = 300,
  className,
  backgroundColor
}: BarChartComponentProps) => {
  const { theme } = useCustomTheme()
  const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
  const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"

  // Filter out invalid data and ensure proper format
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.log("BarChart: No data available")
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontSize: '14px'
        }}
      >
        No data available
      </div>
    )
  }

  // Filter out invalid data and ensure proper format
  const validData = data.filter(item =>
    item &&
    typeof item === 'object' &&
    item.label !== undefined &&
    item.label !== null &&
    item.value !== undefined &&
    item.value !== null &&
    !isNaN(Number(item.value))
  ).map(item => ({
    label: String(item.label),
    value: Number(item.value),
    color: (item as any).color // Preserve color if it exists
  }))

  if (validData.length === 0) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontSize: '14px'
        }}
      >
        No valid data to display
      </div>
    )
  }

  // Extract series data from the validated data - create separate series for each bar to support different colors
  const series = validData.map((item, index) => ({
    data: validData.map((_, i) => i === index ? item.value : 0),
    label: item.label,
    id: `blog-status-series-${index}`,
    color: item.color || '#1976d2',
  }))

  const xAxisData = validData.map(item => item.label)

  try {
    return (
      <BarChart
        className={className}
        xAxis={[
          {
            id: 'barCategories',
            data: xAxisData,
            scaleType: 'band',
            tickLabelStyle: {
              fill: textColor,
              fontSize: 12,
            },
            // Ensure it's treated as categorical data, not dates
            dataKey: undefined,
            valueFormatter: undefined,
          },
        ]}
        yAxis={[
          {
            tickLabelStyle: {
              fill: textColor,
              fontSize: 12,
            },
            tickNumber: 5,
            valueFormatter: (value: number) => Math.round(value).toString(),
          },
        ]}
        series={series}
        width={width}
        height={height}
        margin={{ left: 50, right: 30, top: 30, bottom: 50 }}
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
  } catch (error) {
    console.error('BarChart rendering error:', error)
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: textColor,
          fontSize: '14px'
        }}
      >
        Error rendering chart
      </div>
    )
  }
}

export { Chart, ChartContainer, BarChart, LineChart, PieChart, LineChartComponent, BarChartComponent }