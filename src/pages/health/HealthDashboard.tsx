"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Activity, Droplets, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HealthMetricCard from "@/components/HealthMetricCard";
import { useNavigate } from "react-router-dom";

const HealthDashboard: React.FC = () => {
    const navigate = useNavigate();

    const healthMetrics = [
        {
            percent: 0,
            title: "Nhịp tim",
            description: "Trong 21 giờ 17 phút nữa nhịp tim của bạn sẽ trở về bình thường",
            color: "green" as const,
            icon: Activity
        },
        {
            percent: 0,
            title: "Nồng độ oxy",
            description: "Trong 1 ngày 4 giờ nữa nồng độ oxy của bạn sẽ trở về bình thường",
            color: "blue" as const,
            icon: Droplets
        },
        {
            percent: 0,
            title: "Huyết áp",
            description: "Trong 2 ngày nữa huyết áp của bạn sẽ trở về bình thường",
            color: "purple" as const,
            icon: Heart
        },
        {
            percent: 0,
            title: "Chức năng não",
            description: "Trong 3 ngày nữa chức năng não của bạn sẽ trở về bình thường",
            color: "orange" as const,
            icon: Brain
        },
        {
            percent: 0,
            title: "Vị giác và khứu giác",
            description: "Trong 3 ngày 8 giờ nữa vị giác và khứu giác của bạn sẽ trở về bình thường",
            color: "pink" as const,
            icon: Activity
        },
        {
            percent: 0,
            title: "Hô hấp",
            description: "Trong 3 ngày 20 giờ nữa hô hấp của bạn sẽ trở về bình thường",
            color: "cyan" as const,
            icon: Activity
        },
        {
            percent: 0,
            title: "Mức năng lượng",
            description: "Trong 4 ngày 20 giờ nữa mức năng lượng của bạn sẽ trở về bình thường",
            color: "yellow" as const,
            icon: Activity
        }
    ];

    const longTermHealthMetrics = [
        {
            percent: 0,
            title: "Giảm nguy cơ bệnh tim",
            description: "Trong 1 năm nguy cơ bệnh tim của bạn sẽ giảm một nửa so với người hút thuốc",
            color: "green" as const
        },
        {
            percent: 0,
            title: "Giảm nguy cơ ung thư phổi",
            description: "Trong 10 năm nguy cơ ung thư phổi của bạn sẽ giảm một nửa so với người vẫn hút thuốc",
            color: "blue" as const
        },
        {
            percent: 0,
            title: "Giảm nguy cơ đau tim",
            description: "Trong 15 năm nguy cơ đau tim của bạn sẽ bằng với người chưa từng hút thuốc",
            color: "purple" as const
        },
        {
            percent: 0,
            title: "Cải thiện tuần hoàn máu",
            description: "Trong 2-3 tháng tuần hoàn máu của bạn sẽ cải thiện đáng kể",
            color: "pink" as const
        },
        {
            percent: 0,
            title: "Tăng cường chức năng phổi",
            description: "Trong 9 tháng chức năng phổi của bạn sẽ tăng 10%",
            color: "cyan" as const
        },
        {
            percent: 0,
            title: "Giảm nguy cơ đột quỵ",
            description: "Trong 5 năm nguy cơ đột quỵ của bạn sẽ giảm về mức của người không hút thuốc",
            color: "yellow" as const
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Sức khỏe</h1>
                    </div>
                    <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">
                        Theo dõi sức khỏe của bạn dần trở về bình thường.
                    </p>
                </motion.div>

                {/* Short-term Health Metrics Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Phục hồi sức khỏe ngắn hạn
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {healthMetrics.map((metric, index) => (
                            <motion.div
                                key={metric.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            >
                                <HealthMetricCard
                                    percent={metric.percent}
                                    title={metric.title}
                                    description={metric.description}
                                    color={metric.color}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Long-term Health Metrics Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Lợi ích sức khỏe dài hạn
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {longTermHealthMetrics.map((metric, index) => (
                            <motion.div
                                key={metric.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            >
                                <HealthMetricCard
                                    percent={metric.percent}
                                    title={metric.title}
                                    description={metric.description}
                                    color={metric.color}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Additional Health Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12"
                >
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Lộ trình phục hồi sức khỏe chi tiết
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                        <span className="font-medium">20 phút</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Huyết áp giảm</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                                        <span className="font-medium">8 giờ</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Nồng độ carbon monoxide giảm</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span className="font-medium">24 giờ</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Nguy cơ đau tim bắt đầu giảm</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                        <span className="font-medium">48 giờ</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Vị giác và khứu giác cải thiện</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                        <span className="font-medium">72 giờ</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Hô hấp dễ dàng hơn</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                        <span className="font-medium">2 tuần</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Tuần hoàn máu cải thiện</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                                        <span className="font-medium">1 tháng</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Làn da trở nên khỏe mạnh hơn</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                                        <span className="font-medium">1 năm</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Nguy cơ bệnh tim giảm 50%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                                        <span className="font-medium">10 năm</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Nguy cơ ung thư phổi giảm 50%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                        <span className="font-medium">15 năm</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Nguy cơ đau tim bằng người không hút thuốc</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-lime-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
                                        <span className="font-medium">2-3 tháng</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Tuần hoàn máu cải thiện đáng kể</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-fuchsia-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-fuchsia-500 rounded-full"></div>
                                        <span className="font-medium">9 tháng</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Chức năng phổi tăng 10%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                                        <span className="font-medium">5 năm</span>
                                    </div>
                                    <span className="text-sm text-gray-600">Nguy cơ đột quỵ giảm về mức người không hút thuốc</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default HealthDashboard; 