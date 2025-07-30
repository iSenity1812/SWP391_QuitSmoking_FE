"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { OverviewTab } from "./dashboard/OverviewTab";
import { ProgressTab } from "./dashboard/ProgressTab";
import BenefitTab from "./dashboard/BenefitTab";
import { FailedPlanModal } from "./dashboard/components/FailedPlanModal";
import { CompletedPlanModal } from "./dashboard/components/CompletedPlanModal";
import { useQuitPlan } from "@/services/quitPlanService";
import { DeepBreathingExercise } from "@/pages/feature/BreathingExercise";
import { format } from "date-fns";
import { useDailySummary } from "@/services/dailySummaryService";
import {
  dataVisualizationService,
  type DailyChartDataResponse,
} from "@/services/dataVisualizationService";
import { useNavigate } from "react-router-dom";
import HealthDashboard from "@/pages/health/HealthDashboard";

export function QuitPlanDashboard() {
  const navigate = useNavigate();

  // Lấy dữ liệu kế hoạch bỏ thuốc của người dùng hiện tại
  const { quitPlan, isLoading, error, refetch } = useQuitPlan();
  const [activeTab, setActiveTab] = useState("overview");

  const todayDateFormatted = format(new Date(), "yyyy-MM-dd");
  const {
    dailySummary: todayDailySummary,
    isLoading: isTodaySummaryLoading,
    error: todaySummaryError,
    refetch: refetchTodaySummary,
  } = useDailySummary(todayDateFormatted);

  // State để lưu trữ các bản tóm tắt hàng ngày lịch sử (dùng cho biểu đồ)
  // Sử dụng DailyChartDataResponse từ dataVisualizationService
  const [historicalDailySummaries, setHistoricalDailySummaries] = useState<
    DailyChartDataResponse[]
  >([]);
  const [
    isHistoricalDailySummariesLoading,
    setIsHistoricalDailySummariesLoading,
  ] = useState(true);
  const [historicalDailySummariesError, setHistoricalDailySummariesError] =
    useState<string | null>(null);

  // Hàm để lấy các bản tóm tắt hàng ngày lịch sử
  const fetchHistoricalDailySummaries = useCallback(async () => {
    // Chỉ fetch nếu có quitPlan và các ngày bắt đầu/kết thúc hợp lệ
    if (quitPlan && quitPlan.startDate && quitPlan.goalDate) {
      setIsHistoricalDailySummariesLoading(true);
      setHistoricalDailySummariesError(null);
      try {
        // Gọi service để lấy dữ liệu trong khoảng ngày từ dataVisualizationService
        const data = await dataVisualizationService.getDailyDataForDayRange(
          quitPlan.startDate,
          quitPlan.goalDate
        );
        setHistoricalDailySummaries(data);
      } catch (err) {
        setHistoricalDailySummariesError(
          err instanceof Error
            ? err.message
            : "Failed to fetch historical daily summaries"
        );
      } finally {
        setIsHistoricalDailySummariesLoading(false);
      }
    } else {
      // Đặt lại trạng thái nếu không có quitPlan
      setHistoricalDailySummaries([]);
      setIsHistoricalDailySummariesLoading(false);
    }
  }, [quitPlan]); // Dependency là quitPlan để re-fetch khi quitPlan thay đổi

  // useEffect để gọi hàm fetchHistoricalDailySummaries khi component mount hoặc quitPlan thay đổi
  useEffect(() => {
    fetchHistoricalDailySummaries();
  }, [fetchHistoricalDailySummaries]);

  // useEffect để navigate khi không có quitPlan
  useEffect(() => {
    if (!isLoading && !quitPlan) {
      navigate("/plan/create");
    }
  }, [isLoading, quitPlan, navigate]);

  // Hiển thị trạng thái tải
  if (isLoading || isTodaySummaryLoading || isHistoricalDailySummariesLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-lg font-medium text-gray-700">
                Đang tải kế hoạch cai thuốc của bạn...
              </span>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị trạng thái lỗi
  if (error || todaySummaryError || historicalDailySummariesError) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              <strong>Lỗi khi tải dữ liệu: </strong>
              {error || todaySummaryError || historicalDailySummariesError}
            </AlertDescription>
          </Alert>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                refetch(); // Thử tải lại quitPlan
                refetchTodaySummary(); // Thử tải lại dailySummary hôm nay
                fetchHistoricalDailySummaries(); // Thử tải lại dailySummaries lịch sử
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị khi không có kế hoạch cai thuốc nào - navigate được xử lý trong useEffect
  if (!quitPlan) {
    return null; // Hoặc có thể return loading spinner
  }

  // Check if current plan is FAILED or COMPLETED
  const isCurrentPlanFailed = quitPlan?.status === "FAILED";
  const isCurrentPlanCompleted = quitPlan?.status === "COMPLETED";
  const shouldShowModal = isCurrentPlanFailed || isCurrentPlanCompleted;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Failed Plan Modal */}
      {quitPlan && isCurrentPlanFailed && (
        <FailedPlanModal
          isOpen={isCurrentPlanFailed}
          quitPlan={quitPlan}
          onRefresh={() => {
            refetch();
            refetchTodaySummary();
            fetchHistoricalDailySummaries();
          }}
        />
      )}
      {/* Completed Plan Modal */}
      {quitPlan && isCurrentPlanCompleted && (
        <CompletedPlanModal
          isOpen={isCurrentPlanCompleted}
          quitPlan={quitPlan}
          onRefresh={() => {
            refetch();
            refetchTodaySummary();
            fetchHistoricalDailySummaries();
          }}
        />
      )}
      {/* Dashboard Content Container */}
      <div className={shouldShowModal ? "pointer-events-none opacity-50" : ""}>
        {/* câu động lực cho người dùng */}
        <div className="my-6 max-w-7xl mx-auto bg-orange-400 dark:bg-orange-600 text-white p-4 rounded-lg shadow-lg">
          <div className="my-2 text-sm ">
            ⚡ Bạn hãy nhớ rằng, mục đích việc ghi nhận cơn thèm hoặc hút thuốc
            là để giúp bạn biết được tình trạng hiện tại của bạn như thế nào.
            Hãy ghi nhận và theo dõi, từ đó cải thiện sức khỏe của bạn!
          </div>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <TabsList className="!bg-white/80 !backdrop-blur-sm !border !border-emerald-200 !rounded-lg !p-1 grid w-full max-w-4xl grid-cols-5">
                  <TabsTrigger
                    value="overview"
                    className="!bg-transparent data-[state=active]:!bg-gradient-to-r data-[state=active]:!from-emerald-500 data-[state=active]:!to-teal-600 data-[state=active]:!text-white !rounded-md !transition-all !duration-200"
                  >
                    Kế Hoạch Của Tôi
                  </TabsTrigger>
                  <TabsTrigger
                    value="progress"
                    className="!bg-transparent data-[state=active]:!bg-gradient-to-r data-[state=active]:!from-emerald-500 data-[state=active]:!to-teal-600 data-[state=active]:!text-white !rounded-md !transition-all !duration-200"
                  >
                    Hành Trình
                  </TabsTrigger>
                  <TabsTrigger
                    value="health"
                    className="!bg-transparent data-[state=active]:!bg-gradient-to-r data-[state=active]:!from-emerald-500 data-[state=active]:!to-teal-600 data-[state=active]:!text-white !rounded-md !transition-all !duration-200"
                  >
                    Sức Khỏe
                  </TabsTrigger>
                  <TabsTrigger
                    value="benefits"
                    className="!bg-transparent data-[state=active]:!bg-gradient-to-r data-[state=active]:!from-emerald-500 data-[state=active]:!to-teal-600 data-[state=active]:!text-white !rounded-md !transition-all !duration-200"
                  >
                    Thành Tựu
                  </TabsTrigger>
                  <TabsTrigger
                    value="breathing_exercises"
                    className="!bg-transparent data-[state=active]:!bg-gradient-to-r data-[state=active]:!from-emerald-500 data-[state=active]:!to-teal-600 data-[state=active]:!text-white !rounded-md !transition-all !duration-200"
                  >
                    Hỗ Trợ
                  </TabsTrigger>
                </TabsList>
              </div>

              <AnimatePresence mode="wait">
                <TabsContent value="overview" className="mt-6">
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OverviewTab
                      quitPlan={quitPlan}
                      refetchQuitPlan={refetch} // Hàm refetch quitPlan
                      onViewProgress={() => setActiveTab("progress")}
                      dailySummary={todayDailySummary} // Truyền dailySummary của ngày hôm nay
                      refetchDailySummary={refetchTodaySummary} // Hàm refetch dailySummary hôm nay
                      dailyData={historicalDailySummaries} // Truyền dữ liệu lịch sử cho biểu đồ
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="progress" className="mt-6">
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProgressTab
                      quitPlan={quitPlan}
                      refetchQuitPlan={refetch}
                      dailySummary={todayDailySummary}
                      refetchDailySummary={refetchTodaySummary}
                      refetchHistoricalData={fetchHistoricalDailySummaries}
                    />
                  </motion.div>
                </TabsContent>

                <TabsContent value="health" className="mt-6">
                  <motion.div
                    key="health"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HealthDashboard />
                  </motion.div>
                </TabsContent>

                <TabsContent value="benefits" className="mt-6">
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BenefitTab quitPlan={quitPlan} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="breathing_exercises">
                  <motion.div
                    key="breathing_exercises"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DeepBreathingExercise />
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </div>{" "}
      {/* End of dashboard content container */}
    </div>
  );
}
