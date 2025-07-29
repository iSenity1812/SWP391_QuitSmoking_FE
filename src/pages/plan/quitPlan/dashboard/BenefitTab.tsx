"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  HealthMilestone,
  QuitPlanResponseDTO,
} from "@/services/quitPlanService";
import { QuitPlanCalculator } from "@/utils/QuitPlanCalculator";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Clock, DollarSign, Heart, TrendingUp, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  dataVisualizationService,
  type DailyChartDataResponse,
} from "@/services/dataVisualizationService";

interface BenefitsTabProps {
  quitPlan: QuitPlanResponseDTO;
}

export default function BenefitTab({ quitPlan }: BenefitsTabProps) {
  const daysSinceStart = QuitPlanCalculator.getDaysSinceStart(
    quitPlan.startDate
  );

  // State cho dữ liệu từ API
  const [dailyData, setDailyData] = useState<DailyChartDataResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dữ liệu daily summaries từ startDate đến hiện tại
  const fetchDailyData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const currentDate = format(new Date(), "yyyy-MM-dd");
      const startDate = format(new Date(quitPlan.startDate), "yyyy-MM-dd");

      const data = await dataVisualizationService.getDailyDataForDayRange(
        startDate,
        currentDate
      );
      setDailyData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch daily data"
      );
      console.error("Error fetching daily data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [quitPlan.startDate]);

  useEffect(() => {
    fetchDailyData();
  }, [fetchDailyData]);

  // Tính toán các giá trị dựa trên dữ liệu thực từ API
  const calculateRealMetrics = () => {
    if (!dailyData.length) {
      return {
        totalMoneySaved: 0,
        totalCigarettesAvoided: 0,
        totalTimeRegained: 0,
      };
    }

    // 1. Money Saved: Tổng tiền tiết kiệm từ các record có trong DB
    const totalMoneySaved = dailyData.reduce((sum, record) => {
      return sum + (record.moneySaved || 0);
    }, 0);

    // 2. Cigarettes Avoided: (số ngày * initialSmokingAmount) - tổng số điếu đã hút
    const totalDaysInPlan = daysSinceStart;
    const totalCigarettesPlanned =
      totalDaysInPlan * quitPlan.initialSmokingAmount;
    const totalCigarettesSmoked = dailyData.reduce((sum, record) => {
      return sum + (record.totalSmokedCount || 0);
    }, 0);
    const totalCigarettesAvoided = Math.max(
      0,
      totalCigarettesPlanned - totalCigarettesSmoked
    );

    // 3. Time Regained: số điếu tránh được * 3 phút (chuyển đổi sang giờ)
    const totalTimeRegained = Math.floor((totalCigarettesAvoided * 3) / 60);

    return {
      totalMoneySaved,
      totalCigarettesAvoided,
      totalTimeRegained,
    };
  };

  const { totalMoneySaved, totalCigarettesAvoided, totalTimeRegained } =
    calculateRealMetrics();

  const healthMilestones: HealthMilestone[] = [
    {
      timeframe: "20 phút",
      title: "Nhịp Tim Đã Bình Thường",
      description: "Nhịp tim và huyết áp của bạn trở về mức bình thường",
      icon: "❤️",
      achieved: daysSinceStart >= 1,
    },
    {
      timeframe: "12 giờ",
      title: "Mức Carbon Monoxide Trong Máu Đã Bình Thường",
      description: "Mức carbon monoxide trong máu của bạn trở về bình thường",
      icon: "🫁",
      achieved: daysSinceStart >= 1,
    },
    {
      timeframe: "1 tuần",
      title: "Vị Giác Và Khứu Giác Cải Thiện",
      description: "Vị giác và khứu giác của bạn bắt đầu cải thiện",
      icon: "🌱",
      achieved: daysSinceStart >= 7,
    },
    {
      timeframe: "2 tuần",
      title: "Tuần Hoàn Cải Thiện",
      description:
        "Tuần hoàn của bạn cải thiện và chức năng phổi hồi phục đáng kể",
      icon: "🔄",
      achieved: daysSinceStart >= 14,
    },
    {
      timeframe: "1 tháng",
      title: "Giảm Ho",
      description: "Ho và khó thở giảm đáng kể",
      icon: "😮‍💨",
      achieved: daysSinceStart >= 30,
    },
    {
      timeframe: "3 tháng",
      title: "Chức Năng Phổi Cải Thiện Rõ Rệt",
      description: "Chức năng phổi của bạn bắt đầu cải thiện rõ rệt",
      icon: "🫁",
      achieved: daysSinceStart >= 90,
    },
    {
      timeframe: "6 tháng",
      title: "Thời Gian Thưởng Bản Thân",
      description: "Bạn có thể tự thưởng cho bản thân một điều đặc biệt",
      icon: "🎁",
      achieved: daysSinceStart >= 180,
    },
    {
      timeframe: "1 năm",
      title: "Nguy Cơ Bệnh Tim Giảm Một Nửa",
      description: "Nguy cơ bệnh tim mạch của bạn giảm một nửa",
      icon: "💪",
      achieved: daysSinceStart >= 365,
    },
    {
      timeframe: "5 năm",
      title: "Nguy Cơ Đột Quỵ Giảm",
      description:
        "Nguy cơ đột quỵ của bạn giảm xuống bằng với người không hút thuốc",
      icon: "🧠",
      achieved: daysSinceStart >= 1825,
    },
  ];

  const motivationalQuotes = [
    "Thời gian tốt nhất để trồng cây là 20 năm trước, thời gian tốt thứ hai là bây giờ",
    "Mỗi điếu thuốc không hút là một chiến thắng đáng ăn mừng",
    "Tương lai của bạn sẽ cảm ơn bạn vì những lựa chọn bạn thực hiện hôm nay",
    "Sức mạnh không đến từ những gì bạn có thể làm. Nó đến từ việc vượt qua những gì bạn nghĩ là không thể",
    "Hành trình không thể thực hiện chỉ là hành trình bạn không bao giờ bắt đầu",
  ];

  const todayQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Đang tải dữ liệu...</h2>
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Vui lòng chờ trong giây lát</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Có lỗi xảy ra</h2>
            <p className="text-lg">{error}</p>
            <button
              onClick={fetchDailyData}
              className="mt-4 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Thử lại
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Bạn Hãy Nhớ Rằng</h2>
            <p className="text-lg italic">"{todayQuote}"</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-1 sm:gap-3 lg:gap-4">
        {/* Right Column */}
        {/* Plan Info Summary */}
        <div className="space-y-4">
          <AnimatedSection animation="fadeUp" delay={450}>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <DollarSign className="w-5 h-5" />
                  Tổng Tiền Đã Tiết Kiệm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-3xl font-bold text-green-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  {totalMoneySaved.toLocaleString()} VND
                </motion.div>
                <p className="text-sm text-gray-600 mt-2">
                  Trong {daysSinceStart} ngày hành trình
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={600}>
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="w-5 h-5" />
                  Số Điếu Thuốc Đã Tránh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-3xl font-bold text-blue-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                >
                  {totalCigarettesAvoided.toLocaleString()}
                </motion.div>
                <p className="text-sm text-gray-600 mt-2">
                  Điếu thuốc đã không hút
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeUp" delay={600}>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Clock className="w-5 h-5" />
                  Thời Gian Đã Giành Lại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-3xl font-bold text-purple-600"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                >
                  {totalTimeRegained.toLocaleString()} giờ
                </motion.div>
                <p className="text-sm text-gray-600 mt-2">
                  Giờ sống đã được giành lại
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
        {/* Left Column */}
        {/* Health Improvement Timeline */}
        <div className="xl:col-span-2 flex flex-col space-y-3 sm:space-y-5 h-full">
          <AnimatedSection animation="fadeUp" delay={400} className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Hành Trình Cải Thiện Sức Khỏe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthMilestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.timeframe}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                        milestone.achieved
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-2xl">{milestone.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {milestone.timeframe}
                          </Badge>
                          {milestone.achieved && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              ✅ Đạt được
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {milestone.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
