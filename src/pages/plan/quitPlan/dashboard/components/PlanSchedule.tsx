import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    Brush,
    ReferenceLine
} from "recharts";
import { motion } from "framer-motion";

interface ReductionStep {
    day: number;
    cigarettesPerDay: number;
    actualCigarettes?: number | null;
    description?: string;
    date?: string;
}

// Cập nhật interface để userRecords là một mảng DailyChartData
interface DynamicReductionScheduleProps {
    initialCigarettes: number;
    totalDays: number;
    reductionType: "LINEAR" | "EXPONENTIAL" | "LOGARITHMIC";
    currentDay: number;
    userRecords?: { day: number; recommended: number; actual: number; date: string; }[]; // Đã thay đổi kiểu dữ liệu
    startDate?: Date;
}

function generateSchedule(
    initialCigarettes: number,
    totalDays: number,
    type: "LINEAR" | "EXPONENTIAL" | "LOGARITHMIC",
    startDate?: Date
): ReductionStep[] {
    const schedule: ReductionStep[] = [];
    const baseDate = startDate ?? new Date();

    // Handle edge cases for totalDays
    if (totalDays <= 0) {
        return schedule; // No plan days
    }
    if (totalDays === 1) {
        // If plan is only 1 day, goal is to quit immediately on that day
        const stepDate = new Date(baseDate.getTime()).toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        schedule.push({ day: 1, cigarettesPerDay: 0, date: stepDate });
        return schedule;
    }

    // Logic to generate the plan, mirroring the backend's QuitPlanCalculator.java
    if (initialCigarettes >= totalDays) {
        // Case 1: Initial cigarettes amount is greater than or equal to total days
        // Allows for at least 1 cigarette reduction per day
        for (let i = 0; i < totalDays; i++) {
            let currentCigarettesValue = 0;
            // t: time ratio from 0 (first day) to 1 (last day).
            // Use (totalDays - 1) to ensure t reaches 1 exactly on the last day of the calculation series
            const t = i / (totalDays - 1);

            switch (type) {
                case "LINEAR": // Linear reduction - uniform decrease each day
                    currentCigarettesValue = initialCigarettes * (1 - t);
                    break;
                case "EXPONENTIAL": { // Exponential reduction - faster decrease initially, then slows down
                    const epsilon = 0.1; // This epsilon is used in the backend for `k` calculation
                    const k = Math.log(initialCigarettes / epsilon) / (totalDays - 1);
                    currentCigarettesValue = initialCigarettes * Math.exp(-k * i);
                    break;
                }
                case "LOGARITHMIC": { // Logarithmic reduction - faster decrease initially, then slows down
                    const ratio = Math.log10(1 + 9 * t);
                    currentCigarettesValue = initialCigarettes * (1 - ratio);
                    break;
                }
                default:
                    // Default or error handling
                    currentCigarettesValue = initialCigarettes * (1 - t); // default to linear reduction
                    break;
            }

            // Round cigarettes to the nearest integer
            let roundedCigarettes = Math.round(currentCigarettesValue);

            // Ensure cigarettes are never negative (due to rounding or calculation errors)
            roundedCigarettes = Math.max(0, roundedCigarettes);

            // Force cigarettes to 0 on the last day to ensure complete cessation goal
            if (i === totalDays - 1) {
                roundedCigarettes = 0;
            }

            const stepDate = new Date(baseDate.getTime() + i * 86400000).toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            schedule.push({ day: i + 1, cigarettesPerDay: roundedCigarettes, date: stepDate });
        }
    } else {
        // Case 2: Initial cigarettes amount is less than total days
        // More suitable for a "block" reduction strategy (maintain cigarette level for a few days then reduce)

        // blockSize: number of days the user maintains a certain cigarette level
        const blockSize = (initialCigarettes === 0) ? totalDays : Math.floor(totalDays / initialCigarettes);
        let currentDay = 1;

        // Reduce cigarettes from initialCigarettes down to 1
        for (let cigsPerDay = initialCigarettes; cigsPerDay > 0; cigsPerDay--) {
            // Assign current cigarette level for `blockSize` days
            for (let j = 0; j < blockSize && currentDay <= totalDays; j++) {
                const stepDate = new Date(baseDate.getTime() + (currentDay - 1) * 86400000).toLocaleDateString("vi-VN", {
                    weekday: "short",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
                schedule.push({ day: currentDay++, cigarettesPerDay: cigsPerDay, date: stepDate });
            }
        }

        // After reducing to 1 cigarette, fill remaining days with 0 cigarettes
        while (currentDay <= totalDays) {
            const stepDate = new Date(baseDate.getTime() + (currentDay - 1) * 86400000).toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            schedule.push({ day: currentDay++, cigarettesPerDay: 0, date: stepDate });
        }
    }

    return schedule;
}

export const DynamicReductionSchedule: React.FC<DynamicReductionScheduleProps> = ({
    initialCigarettes,
    totalDays,
    reductionType,
    currentDay,
    userRecords = [], // Đã thay đổi giá trị mặc định thành mảng rỗng
    startDate,
}) => {
    interface CustomTooltipProps {
        active?: boolean
        payload?: Array<{
            payload: {
                day: number
                recommended: number
                actual: number
                date: string
            }
            value: number
            name: string
        }>
        label?: string | number
    }

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length >= 2) {
            const data = payload[0].payload;
            const recommended = payload[0].value;
            const actual = payload[1].value;

            return (
                <div
                    className="p-3 rounded-lg shadow-lg"
                    style={{
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #10b981",
                        borderRadius: 8,
                    }}
                >
                    <p className="font-medium text-gray-900">{`Ngày ${label}`}</p>
                    {data?.date && <p className="text-sm text-gray-600">{data.date}</p>}

                    <div className="mt-2 space-y-1">
                        <p className="text-emerald-600">
                            Giới hạn hôm nay: <strong>{recommended} điếu</strong>
                        </p>
                        <p style={{ color: "#6a040f" }}>
                            Đã hút: <strong>{actual} điếu</strong>
                        </p>

                        {actual > recommended && (
                            <p style={{ color: "#6a040f" }} className="text-xs font-medium">
                                ⚠️ Vượt giới hạn {actual - recommended} điếu!
                            </p>
                        )}
                        {actual === 0 && (
                            <p className="text-emerald-700 text-xs font-medium">
                                🎉 Không hút điếu nào!
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Chuyển đổi userRecords thành một Map để tra cứu nhanh chóng
    // userRecords là mảng các đối tượng { day, recommended, actual, date }
    const userRecordsMap = new Map(userRecords.map(record => [record.day, record.actual]));

    const schedule = generateSchedule(initialCigarettes, totalDays, reductionType, startDate).map((step) => ({
        ...step,
        // Lấy actualCigarettes từ userRecordsMap, nếu không có thì là 0
        actualCigarettes: userRecordsMap.get(step.day) ?? 0, // Đảm bảo giá trị mặc định là 0 nếu không có dữ liệu
    }));

    if (!schedule || schedule.length === 0) {
        return (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-blue-100 dark:border-slate-700 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Hành Trình Của Bạn
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-slate-600 dark:text-slate-300">Chưa có lịch trình giảm dần</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    const completed = Math.max(0, currentDay - 1);
    const progress = Math.round((completed / totalDays) * 100);

    return (
        <Card className="
        bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-blue-100 dark:border-slate-700 shadow-xl h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white text-2xl">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Hành Trình Của Bạn
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 flex-1 flex flex-col">
                {/* Overall Progress Section */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-emerald-800 dark:text-emerald-300">Tiến độ tổng thể:</h4>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                            Ngày {currentDay} / {totalDays}
                        </Badge>
                    </div>
                    <Progress value={progress} className="h-3 mb-2" />
                    <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                        {progress.toFixed(0)}% hoàn thành –{" "}
                        {currentDay <= totalDays ? "Đang tiến triển tốt!" : "Đã hoàn thành kế hoạch!"}
                    </p>
                </div>

                {/* Chart Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="w-full flex-1"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={schedule}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="day"
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: "Day", position: "insideBottomLeft", dx: -10, dy: 10 }}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: "Cigarettes", angle: -90, dx: -20, dy: -65, position: "insideBottomRight" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Brush
                                dataKey="day"
                                height={30}
                                stroke="#10b981"
                                travellerWidth={10}
                            />
                            <ReferenceLine x={currentDay} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: "Hôm Nay", position: "top", fill: "#3b82f6" }} />
                            <Line
                                type="monotone"
                                dataKey="cigarettesPerDay"
                                name="Recommended Limit"
                                stroke="#52b69a"
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2, fill: "#52b69a" }}
                                activeDot={{ r: 6, fill: "#1a759f", stroke: "#1a759f" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="actualCigarettes"
                                name="Cigarettes Taken"
                                stroke="#bb3e03"
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2, fill: "#bb3e03" }}
                                activeDot={{ r: 6, fill: "#6a040f", stroke: "#6a040f" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </CardContent>
        </Card>
    );
};
