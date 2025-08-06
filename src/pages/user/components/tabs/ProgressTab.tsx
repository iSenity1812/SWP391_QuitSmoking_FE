import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Trophy, Heart } from "lucide-react"
import type { User } from "../../types/user-types"
import { useEffect, useState } from "react"
import { healthService } from "@/services/healthService"
import type { HealthOverview, HealthMetric } from "@/types/health"
import HealthOverviewCard from "@/components/health/HealthOverviewCard"
import HealthMetricCard from "@/components/health/HealthMetricCard"

interface ProgressTabProps {
    user: User
}

export function ProgressTab({ user }: ProgressTabProps) {
    const [overview, setOverview] = useState<HealthOverview | null>(null)
    const [metrics, setMetrics] = useState<HealthMetric[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                setLoading(true)
                console.log('🔍 Fetching health data...')
                const [overviewData, metricsData] = await Promise.all([
                    healthService.getHealthOverview(),
                    healthService.getAllHealthMetrics()
                ])
                console.log('✅ Health overview:', overviewData)
                console.log('✅ Health metrics:', metricsData)
                setOverview(overviewData)
                setMetrics(metricsData)
            } catch (err) {
                console.error('❌ Error fetching health data:', err)
                setError(err instanceof Error ? err.message : 'Failed to load health data')
            } finally {
                setLoading(false)
            }
        }

        fetchHealthData()
    }, [])

    return (
        <div className="space-y-6">
            {/* Health Overview Section */}
            {overview && (
                <div className="mb-6">
                    <HealthOverviewCard overview={overview} quitDate={overview.quitDate} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total Plan Days */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng Số Ngày Theo Kế Hoạch</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-6">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full p-8 inline-block mb-4">
                                <Calendar className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                                {user.daysSmokeFreee * 3} ngày
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">Tổng số ngày bạn đã thực hiện theo kế hoạch</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <span className="font-medium text-slate-900 dark:text-white">Kế hoạch đã tạo</span>
                                <span className="text-blue-600 dark:text-blue-400 font-semibold">3 kế hoạch</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <span className="font-medium text-slate-900 dark:text-white">Kế hoạch hoàn thành</span>
                                <span className="text-green-600 dark:text-green-400 font-semibold">2 kế hoạch</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <span className="font-medium text-slate-900 dark:text-white">Kế hoạch đang thực hiện</span>
                                <span className="text-orange-600 dark:text-orange-400 font-semibold">1 kế hoạch</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Highest Streak Achieved */}
                <Card>
                    <CardHeader>
                        <CardTitle>Streak Cao Nhất Đạt Được</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-6">
                            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-full p-8 inline-block mb-4">
                                <Trophy className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                                {Math.max(user.daysSmokeFreee, 67)} ngày
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">Kỷ lục streak dài nhất của bạn</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <span className="font-medium text-slate-900 dark:text-white">Streak hiện tại</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{user.daysSmokeFreee} ngày</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <span className="font-medium text-slate-900 dark:text-white">Lần thử lại</span>
                                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">2 lần</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <span className="font-medium text-slate-900 dark:text-white">Tỷ lệ thành công</span>
                                <span className="text-purple-600 dark:text-purple-400 font-semibold">85%</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tiến độ đến kỷ lục mới</span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {user.daysSmokeFreee}/{Math.max(user.daysSmokeFreee, 67) + 10}
                                </span>
                            </div>
                            <Progress
                                value={(user.daysSmokeFreee / (Math.max(user.daysSmokeFreee, 67) + 10)) * 100}
                                className="h-3"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Health Metrics Section */}
            {metrics.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            Chỉ số sức khỏe (API Data)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {metrics.slice(0, 6).map((metric) => (
                                <HealthMetricCard key={metric.id} metric={metric} />
                            ))}
                        </div>
                        {metrics.length > 6 && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Và {metrics.length - 6} chỉ số sức khỏe khác...
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Test Health Metrics Section - Always Show */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Chỉ số sức khỏe (Test - Luôn hiển thị)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Debug Info:</strong><br/>
                            Loading: {loading.toString()}<br/>
                            Error: {error || 'None'}<br/>
                            Metrics count: {metrics.length}<br/>
                            Overview: {overview ? 'Loaded' : 'Not loaded'}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold">Test Health Metric 1</h4>
                            <p className="text-sm text-gray-600">Nhịp tim</p>
                            <div className="mt-2 text-green-600">Đã hoàn thành</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold">Test Health Metric 2</h4>
                            <p className="text-sm text-gray-600">Huyết áp</p>
                            <div className="mt-2 text-orange-600">Đang tiến hành</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold">Test Health Metric 3</h4>
                            <p className="text-sm text-gray-600">Oxy trong máu</p>
                            <div className="mt-2 text-blue-600">Chưa bắt đầu</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
                <Card>
                    <CardHeader>
                        <CardTitle>Đang tải dữ liệu sức khỏe...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="animate-pulse space-y-4">
                            <div className="h-32 bg-gray-200 rounded-lg"></div>
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-24 bg-gray-200 rounded-lg"></div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error State */}
            {error && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Lỗi tải dữ liệu sức khỏe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">{error}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
