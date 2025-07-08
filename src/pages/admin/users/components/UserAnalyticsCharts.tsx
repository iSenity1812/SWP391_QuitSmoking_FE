"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BarChart3, Users, TrendingUp } from "lucide-react"
import { adminService, type MemberProfile } from "@/services/api/adminService"
import { ChartContainer, LineChart } from "@/components/ui/Chart"
import { useTheme } from "@/context/ThemeContext"

interface UserAnalyticsChartsProps {
  refreshTrigger?: number
}

export function UserAnalyticsCharts({ refreshTrigger = 0 }: UserAnalyticsChartsProps) {
  const [members, setMembers] = useState<MemberProfile[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const memberData = await adminService.getAllMembers()
        setMembers(memberData)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thành viên:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 dark:text-gray-400" />
        <span className="ml-2 text-gray-900 dark:text-gray-100">Đang tải dữ liệu thống kê...</span>
      </div>
    )
  }

  const chartColors = {
    primary: theme === "dark" ? "#60a5fa" : "#3b82f6",
    success: theme === "dark" ? "#34d399" : "#10b981",
    warning: theme === "dark" ? "#fbbf24" : "#f59e0b",
    purple: theme === "dark" ? "#a78bfa" : "#8b5cf6",
    red: theme === "dark" ? "#f87171" : "#ef4444",
  }

  // Generate chart data
  const userRegistrationData = Array.from({ length: 7 }, (_, i) => ({
    day: `Ngày ${i + 1}`,
    registrations: Math.floor(Math.random() * 50) + 20,
    active: Math.floor(Math.random() * 40) + 15,
    premium: Math.floor(Math.random() * 15) + 5,
  }))

  const userStatusData = [
    { status: "Hoạt động", count: members.filter((m) => m.isActive).length * 10 },
    { status: "Không hoạt động", count: members.filter((m) => !m.isActive).length * 5 },
  ]

  const userActivityData = Array.from({ length: 12 }, (_, i) => ({
    month: `T${i + 1}`,
    newUsers: Math.floor(Math.random() * 100) + 50,
    activeUsers: Math.floor(Math.random() * 200) + 100,
    churnRate: Math.floor(Math.random() * 10) + 5,
  }))

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Trends */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg text-gray-900 dark:text-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Xu Hướng Đăng Ký</span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Đăng ký và hoạt động người dùng theo ngày
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px] text-black dark:text-white">
              <LineChart
                dataset={userRegistrationData}
                xAxis={[{
                  scaleType: "point",
                  dataKey: "day",
                  tickLabelStyle: {
                    // Sử dụng currentColor để kế thừa màu chữ từ ChartContainer
                    fill: "currentColor"
                  }
                }]}
                yAxis={[{
                  tickLabelStyle: {
                    // Sử dụng currentColor để kế thừa màu chữ từ ChartContainer
                    fill: "currentColor"
                  }
                }]}
                series={[
                  { dataKey: "registrations", label: "Đăng ký", color: chartColors.primary },
                  { dataKey: "active", label: "Hoạt động", color: chartColors.success },
                  { dataKey: "premium", label: "Premium", color: chartColors.warning },
                ]}
                width={500}
                height={300}
                sx={{
                  // Điều này sẽ áp dụng cho các label "Đăng ký", "Hoạt động", "Premium"
                  // trong phần legend của biểu đồ.
                  "& .MuiChartsLegend-series text": {
                    // Sử dụng currentColor để kế thừa màu chữ từ ChartContainer
                    fill: "currentColor"
                  }
                }}
              />
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Status Distribution */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg text-gray-900 dark:text-gray-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Phân Bố Trạng Thái</span>
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Tình trạng hoạt động của người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]">
              <LineChart
                dataset={userStatusData}
                xAxis={[{
                  scaleType: "point",
                  dataKey: "status",
                  tickLabelStyle: {
                    fill: theme === "dark" ? "#ffffff" : "#000000"
                  }
                }]}
                yAxis={[{
                  tickLabelStyle: {
                    fill: theme === "dark" ? "#ffffff" : "#000000"
                  }
                }]}
                series={[{ dataKey: "count", label: "Số lượng", color: chartColors.success }]}
                width={500}
                height={300}
                sx={{
                  "& .MuiChartsLegend-series text": {
                    fill: theme === "dark" ? "#ffffff" : "#000000"
                  }
                }}
              />
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly User Activity */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg text-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Hoạt Động Người Dùng Hàng Tháng</span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Người dùng mới, hoạt động và tỷ lệ rời bỏ theo tháng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[400px]">
            <LineChart
              dataset={userActivityData}
              xAxis={[{
                scaleType: "point",
                dataKey: "month",
                tickLabelStyle: {
                  fill: theme === "dark" ? "#ffffff" : "#000000"
                }
              }]}
              yAxis={[{
                tickLabelStyle: {
                  fill: theme === "dark" ? "#ffffff" : "#000000"
                }
              }]}
              series={[
                { dataKey: "newUsers", label: "Người dùng mới", color: chartColors.primary },
                { dataKey: "activeUsers", label: "Người dùng hoạt động", color: chartColors.success },
                { dataKey: "churnRate", label: "Tỷ lệ rời bỏ (%)", color: chartColors.red },
              ]}
              width={800}
              height={400}
              sx={{
                "& .MuiChartsLegend-series text": {
                  fill: theme === "dark" ? "#ffffff" : "#000000"
                }
              }}
            />
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
