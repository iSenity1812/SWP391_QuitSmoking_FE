import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function HealthTab() {
    const healthBenefits = [
        {
            title: "Cải thiện hô hấp",
            description: "Phổi bắt đầu tự làm sạch và dung tích phổi tăng",
            timeframe: "2-12 tuần",
            status: "completed",
        },
        {
            title: "Giảm nguy cơ tim mạch",
            description: "Nguy cơ đau tim giảm đáng kể",
            timeframe: "1 năm",
            status: "in-progress",
        },
        {
            title: "Tái tạo tế bào",
            description: "Tế bào phổi bắt đầu tái tạo",
            timeframe: "1-9 tháng",
            status: "in-progress",
        },
        {
            title: "Cải thiện tuần hoàn",
            description: "Lưu thông máu được cải thiện đáng kể",
            timeframe: "2-12 tuần",
            status: "completed",
        },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sức khỏe</h2>
                <p className="text-gray-600 dark:text-gray-400">Theo dõi sự cải thiện sức khỏe của bạn kể từ khi bỏ thuốc</p>
            </div>

            {/* Health Benefits Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Lợi ích sức khỏe theo thời gian</CardTitle>
                    <CardDescription>Các cải thiện sức khỏe bạn đã đạt được và sẽ đạt được</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {healthBenefits.map((benefit, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-3 h-3 rounded-full mt-2 ${benefit.status === "completed"
                                                ? "bg-green-500"
                                                : benefit.status === "in-progress"
                                                    ? "bg-blue-500"
                                                    : "bg-gray-300"
                                            }`}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{benefit.title}</h4>
                                        <Badge
                                            variant={benefit.status === "completed" ? "default" : "secondary"}
                                            className={
                                                benefit.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : benefit.status === "in-progress"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {benefit.timeframe}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
