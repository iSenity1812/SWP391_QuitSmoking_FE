import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, Droplets, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthSummaryProps {
    quitPlanStartDate?: string;
    currentDate?: string;
}

const HealthSummary: React.FC<HealthSummaryProps> = ({
    quitPlanStartDate,
    currentDate = new Date().toISOString().split('T')[0]
}) => {
    // Tính toán thời gian đã bỏ thuốc
    const calculateQuitTime = () => {
        if (!quitPlanStartDate) return 0;

        const start = new Date(quitPlanStartDate);
        const current = new Date(currentDate);
        const diffTime = current.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(0, diffDays);
    };

    const quitDays = calculateQuitTime();

    // Tính toán các chỉ số sức khỏe dựa trên thời gian bỏ thuốc
    const calculateHealthMetrics = () => {
        const metrics = [
            {
                title: "Nhịp tim",
                description: "Nhịp tim đã trở về bình thường",
                color: "green" as const,
                icon: Activity,
                achieved: quitDays >= 1,
                timeToAchieve: quitDays >= 1 ? 0 : 1 - quitDays
            },
            {
                title: "Nồng độ oxy",
                description: "Nồng độ oxy đã trở về bình thường",
                color: "blue" as const,
                icon: Droplets,
                achieved: quitDays >= 1,
                timeToAchieve: quitDays >= 1 ? 0 : 1 - quitDays
            },
            {
                title: "Huyết áp",
                description: "Huyết áp đã trở về bình thường",
                color: "purple" as const,
                icon: Heart,
                achieved: quitDays >= 2,
                timeToAchieve: quitDays >= 2 ? 0 : 2 - quitDays
            },
            {
                title: "Chức năng não",
                description: "Chức năng não đã trở về bình thường",
                color: "orange" as const,
                icon: Brain,
                achieved: quitDays >= 3,
                timeToAchieve: quitDays >= 3 ? 0 : 3 - quitDays
            }
        ];

        return metrics;
    };

    const healthMetrics = calculateHealthMetrics();

    const getProgressColor = (achieved: boolean, color: string) => {
        if (achieved) return "text-emerald-500";
        return `text-${color}-500`;
    };

    const getProgressText = (achieved: boolean, timeToAchieve: number) => {
        if (achieved) return "Đã hoàn thành";
        if (timeToAchieve === 0) return "Hôm nay";
        if (timeToAchieve === 1) return "Ngày mai";
        return `Trong ${timeToAchieve} ngày nữa`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
        >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-emerald-600" />
                        Tình trạng sức khỏe
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {healthMetrics.map((metric, index) => (
                            <motion.div
                                key={metric.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className={cn(
                                    "w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center",
                                    metric.achieved ? "bg-emerald-100" : "bg-gray-100"
                                )}>
                                    <metric.icon className={cn(
                                        "w-6 h-6",
                                        metric.achieved ? "text-emerald-600" : "text-gray-400"
                                    )} />
                                </div>
                                <h3 className="font-semibold text-sm text-gray-900 mb-1">
                                    {metric.title}
                                </h3>
                                <p className={cn(
                                    "text-xs",
                                    metric.achieved ? "text-emerald-600" : "text-gray-500"
                                )}>
                                    {getProgressText(metric.achieved, metric.timeToAchieve)}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Thời gian bỏ thuốc */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">
                                Bạn đã bỏ thuốc được
                            </p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {quitDays} ngày
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default HealthSummary; 