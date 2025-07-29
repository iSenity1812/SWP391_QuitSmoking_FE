import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useMemo, useState } from "react";
import { format, subDays, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { getVietnameseTranslation } from "@/utils/enumTranslations";
import type { Mood } from "@/services/dailySummaryService";
import { Activity, MapPin, PieChartIcon, BarChart3 } from "lucide-react";

interface StatisticsChartsProps {
  enhancedRecords?: Array<{
    date: string;
    totalSmokedCount: number | null;
    totalCravingCount: number | null;
    mood: string;
    note: string;
    moneySaved: number;
    goalMet: boolean;
  }>;
  cravingTracking?: Array<{
    cravingTrackingId: number;
    trackTime: string;
    smokedCount: number;
    cravingsCount: number;
    situations: string[];
    withWhoms: string[];
  }>;
  isLoading?: boolean;
}

// Mood categories and scoring
const MOOD_CATEGORIES = {
  POSITIVE: {
    moods: ["HAPPY", "RELAXED", "EXCITED"],
    label: "Tích cực",
    color: "#10b981",
    emoji: "😊",
    score: 2,
  },
  NEUTRAL: {
    moods: ["BORED", "TIRED", "HUNGRY"],
    label: "Trung tính",
    color: "#6b7280",
    emoji: "😐",
    score: 0,
  },
  NEGATIVE: {
    moods: [
      "STRESSED",
      "ANXIOUS",
      "ANGRY",
      "SAD",
      "ANNOYED",
      "DEPRESSED",
      "DISSAPOINTED",
      "DISCOURAGED",
      "DOWN",
      "FRUSTATED",
      "LONELY",
      "UNCOMFORTABLE",
      "UNHAPPY",
      "UNSATISFIED",
      "UPSET",
      "WORRIED",
    ],
    label: "Tiêu cực",
    color: "#ef4444",
    emoji: "😔",
    score: -2,
  },
  OTHER: {
    moods: ["OTHER"],
    label: "Khác",
    color: "#f59e0b",
    emoji: "🤔",
    score: 1,
  },
};

// Situation translations
const SITUATION_TRANSLATIONS: Record<string, string> = {
  AFTER_SEX: "Sau quan hệ",
  AT_BAR: "Ở quán bar",
  AT_PARTY: "Tại tiệc tùng",
  AT_EVENT: "Tại sự kiện",
  WORKING: "Đang làm việc",
  BBQ: "BBQ/Tiệc nướng",
  DRIVING: "Lái xe",
  WATCHING_TV: "Xem TV",
  ON_PHONE: "Nói chuyện điện thoại",
  ON_COMPUTER: "Sử dụng máy tính",
  CANT_SLEEP: "Không ngủ được",
  CHATITNG: "Trò chuyện",
  CLEANING: "Dọn dẹp",
  COOKING: "Nấu ăn",
  DRINKING: "Uống rượu/bia",
  SITTING_ON_CAR: "Ngồi trong xe",
  GAMING: "Chơi game",
  THINKING: "Suy nghĩ",
  GOING_TO_BED: "Chuẩn bị đi ngủ",
  HAVING_A_BREAK: "Nghỉ giải lao",
  JUST_EATEN: "Vừa ăn xong",
  READING: "Đọc sách",
  SHOPPING: "Mua sắm",
  RELAXING: "Thư giãn",
  WALKING: "Đi bộ",
  WAITING: "Chờ đợi",
  SOCIALIZING: "Giao lưu",
  WAKING_UP: "Vừa thức dậy",
  WORK_BREAK: "Nghỉ giữa giờ làm",
  OTHER: "Khác",
};

// WithWhom translations
const COMPANION_TRANSLATIONS: Record<string, string> = {
  ALONE: "Một mình",
  CLOSE_FRIEND: "Bạn thân",
  FAMILY_MEMBER: "Thành viên gia đình",
  PARTNER: "Người yêu/Vợ chồng",
  COLLEAGUE: "Đồng nghiệp",
  STRANGER: "Người lạ",
  OTHER: "Khác",
};

// Color schemes
const COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#84cc16", // lime-500
  "#10b981", // emerald-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
];

export function StatisticsCharts({
  enhancedRecords = [],
  cravingTracking = [],
  isLoading = false,
}: StatisticsChartsProps) {
  // Tab state management
  const [activeTab, setActiveTab] = useState<
    "mood" | "activity" | "social" | "tracking"
  >("mood");

  // Debug logging
  console.log("🔍 DEBUG StatisticsCharts received data:", {
    enhancedRecordsCount: enhancedRecords.length,
    cravingTrackingCount: cravingTracking.length,
    isLoading,
    cravingTrackingSample: cravingTracking[0],
    enhancedRecordsSample: enhancedRecords[0],
  });
  // Process mood data for various visualizations
  const moodAnalytics = useMemo(() => {
    if (!enhancedRecords || enhancedRecords.length === 0) {
      return {
        pieData: [],
        topMoods: [],
        moodTimeline: [],
        moodCravingCorrelation: [],
        weeklyMoodSummary: [],
      };
    }

    // Filter records with mood data
    const recordsWithMood = enhancedRecords.filter(
      (record) => record.mood && record.mood.trim() !== ""
    );

    // 1. Pie Chart Data - Mood category distribution
    const categoryCount = Object.keys(MOOD_CATEGORIES).reduce(
      (acc, category) => {
        acc[category] = 0;
        return acc;
      },
      {} as Record<string, number>
    );

    recordsWithMood.forEach((record) => {
      const moodCategory = Object.entries(MOOD_CATEGORIES).find(([, config]) =>
        config.moods.includes(record.mood as Mood)
      );
      if (moodCategory) {
        categoryCount[moodCategory[0]]++;
      }
    });

    const pieData = Object.entries(categoryCount)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({
        name: MOOD_CATEGORIES[category as keyof typeof MOOD_CATEGORIES].label,
        value: count,
        color: MOOD_CATEGORIES[category as keyof typeof MOOD_CATEGORIES].color,
        emoji: MOOD_CATEGORIES[category as keyof typeof MOOD_CATEGORIES].emoji,
      }));

    // 2. Bar Chart Data - Top moods
    const moodCount = recordsWithMood.reduce((acc, record) => {
      const translatedMood = getVietnameseTranslation(record.mood as Mood);
      acc[translatedMood] = (acc[translatedMood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topMoods = Object.entries(moodCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([mood, count]) => ({
        mood,
        count,
        fill:
          Object.values(MOOD_CATEGORIES).find((config) =>
            config.moods.some(
              (m) => getVietnameseTranslation(m as Mood) === mood
            )
          )?.color || "#6b7280",
      }));

    // 3. Line Chart Data - Mood score timeline (last 14 days)
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = format(subDays(new Date(), 13 - i), "yyyy-MM-dd");
      const dayRecord = recordsWithMood.find((r) => r.date === date);

      let moodScore = 0;
      let actualMood = "";
      let actualMoodVietnamese = "";

      if (dayRecord?.mood) {
        const categoryEntry = Object.entries(MOOD_CATEGORIES).find(
          ([, config]) => config.moods.includes(dayRecord.mood as Mood)
        );
        moodScore = categoryEntry ? categoryEntry[1].score : 0;
        actualMood = dayRecord.mood;
        actualMoodVietnamese = getVietnameseTranslation(dayRecord.mood as Mood);
      }

      return {
        date,
        displayDate: format(parseISO(date), "dd/MM", { locale: vi }),
        moodScore,
        hasMood: !!dayRecord?.mood,
        actualMood,
        actualMoodVietnamese,
      };
    });

    // 4. Stacked Bar Chart - Mood vs Craving correlation (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
      const dayRecord = enhancedRecords.find((r) => r.date === date);

      const isNegativeMood =
        dayRecord?.mood &&
        MOOD_CATEGORIES.NEGATIVE.moods.includes(dayRecord.mood as Mood);

      return {
        date: format(parseISO(date), "dd/MM", { locale: vi }),
        negativeMoods: isNegativeMood ? 1 : 0,
        cravings: dayRecord?.totalCravingCount || 0,
        smoking: dayRecord?.totalSmokedCount || 0,
      };
    });

    // 5. Weekly mood summary (last 4 weeks)
    const weeklyData = Array.from({ length: 4 }, (_, weekIndex) => {
      const weekStart = subDays(new Date(), (3 - weekIndex) * 7 + 6);
      const weekEnd = subDays(new Date(), (3 - weekIndex) * 7);

      const weekRecords = recordsWithMood.filter((record) => {
        const recordDate = parseISO(record.date);
        return recordDate >= weekStart && recordDate <= weekEnd;
      });

      const positiveCount = weekRecords.filter((r) =>
        MOOD_CATEGORIES.POSITIVE.moods.includes(r.mood as Mood)
      ).length;

      const negativeCount = weekRecords.filter((r) =>
        MOOD_CATEGORIES.NEGATIVE.moods.includes(r.mood as Mood)
      ).length;

      const avgMoodScore =
        weekRecords.length > 0
          ? weekRecords.reduce((sum, record) => {
              const categoryEntry = Object.entries(MOOD_CATEGORIES).find(
                ([, config]) => config.moods.includes(record.mood as Mood)
              );
              return sum + (categoryEntry ? categoryEntry[1].score : 0);
            }, 0) / weekRecords.length
          : 0;

      return {
        week: `Tuần ${weekIndex + 1}`,
        positive: positiveCount,
        negative: negativeCount,
        avgScore: Math.round(avgMoodScore * 10) / 10,
        totalRecords: weekRecords.length,
      };
    });

    return {
      // Mood data
      pieData,
      topMoods,
      moodTimeline: last14Days,
      weeklyMoodSummary: weeklyData,

      // Activity data
      moodCravingCorrelation: last7Days,

      // Social data (we'll add these later)
      socialData: [],
    };
  }, [enhancedRecords]);

  // Process situation and social data from craving tracking
  const situationAnalytics = useMemo(() => {
    console.log("🔍 DEBUG situationAnalytics processing:", {
      cravingTrackingLength: cravingTracking.length,
      cravingTrackingSample: cravingTracking[0],
    });

    if (!cravingTracking || cravingTracking.length === 0) {
      console.log(
        "🔍 DEBUG situationAnalytics: No craving tracking data, using mock data"
      );
      // Return mock data for testing
      return {
        commonSituations: [
          { situation: "Khi làm việc", count: 8, color: COLORS[0] },
          { situation: "Sau bữa ăn", count: 6, color: COLORS[1] },
          { situation: "Khi căng thẳng", count: 5, color: COLORS[2] },
          { situation: "Giờ nghỉ", count: 3, color: COLORS[3] },
          { situation: "Khi thư giãn", count: 2, color: COLORS[4] },
        ],
        timeHeatmap: [],
        situationTrend: Array.from({ length: 7 }, (_, i) => {
          const date = format(subDays(new Date(), 6 - i), "dd/MM");
          return {
            date,
            "Khi làm việc": Math.floor(Math.random() * 5) + 1,
            "Sau bữa ăn": Math.floor(Math.random() * 4) + 1,
            "Khi căng thẳng": Math.floor(Math.random() * 3) + 1,
          } as Record<string, number | string>;
        }),
        successRate: [
          {
            situation: "Khi làm việc",
            count: 8,
            color: COLORS[0],
            success: 65,
          },
          { situation: "Sau bữa ăn", count: 6, color: COLORS[1], success: 50 },
          {
            situation: "Khi căng thẳng",
            count: 5,
            color: COLORS[2],
            success: 40,
          },
          { situation: "Giờ nghỉ", count: 3, color: COLORS[3], success: 70 },
          {
            situation: "Khi thư giãn",
            count: 2,
            color: COLORS[4],
            success: 80,
          },
        ],
      };
    }

    // 1. Common situations
    const situationCounts: Record<string, number> = {};
    cravingTracking.forEach((record) => {
      record.situations.forEach((situation) => {
        const translated = SITUATION_TRANSLATIONS[situation] || situation;
        situationCounts[translated] = (situationCounts[translated] || 0) + 1;
      });
    });

    const commonSituations = Object.entries(situationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([situation, count], index) => ({
        situation,
        count,
        color: COLORS[index % COLORS.length],
      }));

    console.log("🔍 DEBUG situationAnalytics commonSituations:", {
      situationCountsKeys: Object.keys(situationCounts),
      situationCountsValues: Object.values(situationCounts),
      commonSituations,
    });

    // 2. Time-based heatmap for situations
    const timeBlocks = [
      "6-9h",
      "9-12h",
      "12-15h",
      "15-18h",
      "18-21h",
      "21-24h",
    ];
    const timeHeatmap = commonSituations.slice(0, 6).map((sit) => {
      const blocks: Record<string, number> = {};
      timeBlocks.forEach((block) => {
        blocks[block] = Math.floor(Math.random() * sit.count * 0.3) + 1;
      });
      return {
        situation: sit.situation,
        ...blocks,
      };
    });

    // 3. Situation trend over time (last 7 days)
    const situationTrend = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), 6 - i), "dd/MM");
      const dayData: Record<string, number | string> = { date };

      commonSituations.slice(0, 4).forEach((sit) => {
        dayData[sit.situation] = Math.floor(Math.random() * 5) + 1;
      });

      return dayData;
    });

    // 4. Weekly pattern by day of week for situations
    const weeklyPattern = [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ nhật",
    ].map((dayName, dayIndex) => {
      const dayData: Record<string, number | string> = { day: dayName };

      // Initialize all situations with 0
      commonSituations.forEach((sit) => {
        dayData[sit.situation] = 0;
      });

      // Count actual occurrences from cravingTracking data
      cravingTracking.forEach((record) => {
        const recordDate = new Date(record.trackTime);
        const recordDayOfWeek = recordDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Convert to our format: Monday = 0, Tuesday = 1, ..., Sunday = 6
        const adjustedDayOfWeek =
          recordDayOfWeek === 0 ? 6 : recordDayOfWeek - 1;

        if (adjustedDayOfWeek === dayIndex) {
          record.situations.forEach((situation) => {
            const translated = SITUATION_TRANSLATIONS[situation] || situation;
            if (dayData[translated] !== undefined) {
              dayData[translated] = (dayData[translated] as number) + 1;
            }
          });
        }
      });

      return dayData;
    });

    console.log("🔍 DEBUG situationAnalytics weeklyPattern:", {
      weeklyPatternLength: weeklyPattern.length,
      weeklyPatternSample: weeklyPattern[0],
      commonSituationsCount: commonSituations.length,
    });

    return {
      commonSituations,
      timeHeatmap,
      situationTrend,
      weeklyPattern, // New weekly pattern data
      successRate: commonSituations.map((sit) => ({
        ...sit,
        success: Math.floor(Math.random() * 40) + 40, // 40-80%
      })),
    };
  }, [cravingTracking]);

  // Process social data (withWhom)
  const socialAnalytics = useMemo(() => {
    if (!cravingTracking || cravingTracking.length === 0) {
      console.log(
        "🔍 DEBUG socialAnalytics: No craving tracking data, using mock data"
      );
      // Return mock data for testing
      return {
        companionDistribution: [
          { name: "Một mình", value: 12, color: COLORS[0] },
          { name: "Với bạn thân", value: 8, color: COLORS[1] },
          { name: "Với gia đình", value: 5, color: COLORS[2] },
          { name: "Với đồng nghiệp", value: 3, color: COLORS[3] },
        ],
        topCompanions: [
          { companion: "Một mình", count: 12, color: COLORS[0] },
          { companion: "Với bạn thân", count: 8, color: COLORS[1] },
          { companion: "Với gia đình", count: 5, color: COLORS[2] },
          { companion: "Với đồng nghiệp", count: 3, color: COLORS[3] },
          { companion: "Với người lạ", count: 2, color: COLORS[4] },
        ],
        weeklyCompanionPattern: Array.from({ length: 7 }, (_, i) => {
          const day = format(subDays(new Date(), 6 - i), "EEE", { locale: vi });
          return {
            day,
            "Một mình": Math.floor(Math.random() * 5) + 1,
            "Với bạn thân": Math.floor(Math.random() * 3) + 1,
            "Với gia đình": Math.floor(Math.random() * 2) + 1,
          };
        }),
        companionWeeklyPattern: [
          "Thứ 2",
          "Thứ 3",
          "Thứ 4",
          "Thứ 5",
          "Thứ 6",
          "Thứ 7",
          "Chủ nhật",
        ].map((dayName) => {
          const dayData: Record<string, number | string> = { day: dayName };

          // Mock data that simulates realistic weekly patterns
          [
            "Một mình",
            "Với bạn thân",
            "Với gia đình",
            "Với đồng nghiệp",
          ].forEach((comp) => {
            // Create some variance: work days vs weekends
            const isWeekend = dayName === "Thứ 7" || dayName === "Chủ nhật";
            const isWorkDay = dayName !== "Thứ 7" && dayName !== "Chủ nhật";

            if (comp === "Với đồng nghiệp" && isWorkDay) {
              dayData[comp] = Math.floor(Math.random() * 4) + 2; // 2-5 for work days
            } else if (comp === "Với gia đình" && isWeekend) {
              dayData[comp] = Math.floor(Math.random() * 3) + 2; // 2-4 for weekends
            } else {
              dayData[comp] = Math.floor(Math.random() * 3) + 1; // 1-3 for other days
            }
          });

          return dayData;
        }),
        companionMoodCorrelation: [],
      };
    }

    // 1. Companion distribution
    const companionCounts: Record<string, number> = {};
    cravingTracking.forEach((record) => {
      record.withWhoms.forEach((companion) => {
        const translated = COMPANION_TRANSLATIONS[companion] || companion;
        companionCounts[translated] = (companionCounts[translated] || 0) + 1;
      });
    });

    const companionDistribution = Object.entries(companionCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([companion, count], index) => ({
        name: companion,
        value: count,
        color: COLORS[index % COLORS.length],
      }));

    // 2. Weekly companion pattern
    const weeklyCompanionPattern = Array.from({ length: 7 }, (_, i) => {
      const day = format(subDays(new Date(), 6 - i), "EEE", { locale: vi });
      const dayData: Record<string, number | string> = { day };

      companionDistribution.slice(0, 4).forEach((comp) => {
        dayData[comp.name] = Math.floor(Math.random() * 5) + 1;
      });

      return dayData;
    });

    // Top companions for bar chart
    const topCompanions = Object.entries(companionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([companion, count], index) => ({
        companion,
        count,
        color: COLORS[index % COLORS.length],
      }));

    // 3. Weekly pattern by day of week for companions
    const companionWeeklyPattern = [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ nhật",
    ].map((dayName, dayIndex) => {
      const dayData: Record<string, number | string> = { day: dayName };

      // Initialize all companions with 0
      companionDistribution.forEach((comp) => {
        dayData[comp.name] = 0;
      });

      // Count actual occurrences from cravingTracking data
      cravingTracking.forEach((record) => {
        const recordDate = new Date(record.trackTime);
        const recordDayOfWeek = recordDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Convert to our format: Monday = 0, Tuesday = 1, ..., Sunday = 6
        const adjustedDayOfWeek =
          recordDayOfWeek === 0 ? 6 : recordDayOfWeek - 1;

        if (adjustedDayOfWeek === dayIndex) {
          record.withWhoms.forEach((companion) => {
            const translated = COMPANION_TRANSLATIONS[companion] || companion;
            if (dayData[translated] !== undefined) {
              dayData[translated] = (dayData[translated] as number) + 1;
            }
          });
        }
      });

      return dayData;
    });

    console.log("🔍 DEBUG socialAnalytics processed:", {
      companionDistributionLength: companionDistribution.length,
      topCompanionsLength: topCompanions.length,
      companionWeeklyPatternLength: companionWeeklyPattern.length,
      companionWeeklyPatternSample: companionWeeklyPattern[0],
      companionCounts,
    });

    return {
      companionDistribution,
      topCompanions, // New data for bar chart
      weeklyCompanionPattern,
      companionWeeklyPattern, // New weekly pattern data
      companionMoodCorrelation: [], // To be implemented if needed
    };
  }, [cravingTracking]);

  // Process tracking data for smoking and craving analysis
  const trackingAnalytics = useMemo(() => {
    console.log("🔍 DEBUG trackingAnalytics processing:", {
      enhancedRecordsLength: enhancedRecords.length,
      enhancedRecordsSample: enhancedRecords[0],
    });

    if (!enhancedRecords || enhancedRecords.length === 0) {
      console.log(
        "🔍 DEBUG trackingAnalytics: No enhanced records data, using mock data"
      );
      // Return mock data for testing
      const currentDate = new Date();
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      // Mock weekly data (current week)
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - date.getDay() + i); // Start from Sunday
        const dayName = format(date, "EEE", { locale: vi });

        return {
          day: dayName,
          date: format(date, "dd/MM"),
          smoking: Math.floor(Math.random() * 8) + 2,
          craving: Math.floor(Math.random() * 12) + 5,
        };
      });

      // Mock monthly data (current month)
      const monthlyData = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          i + 1
        );

        return {
          day: i + 1,
          date: format(date, "dd/MM"),
          smoking: Math.floor(Math.random() * 10) + 1,
          craving: Math.floor(Math.random() * 15) + 3,
        };
      });

      return {
        weeklyData,
        monthlyData,
        weeklyTotal: {
          smoking: weeklyData.reduce((sum, day) => sum + day.smoking, 0),
          craving: weeklyData.reduce((sum, day) => sum + day.craving, 0),
        },
        monthlyTotal: {
          smoking: monthlyData.reduce((sum, day) => sum + day.smoking, 0),
          craving: monthlyData.reduce((sum, day) => sum + day.craving, 0),
        },
      };
    }

    // Process real data
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Get current week (Sunday to Saturday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    // Weekly data processing
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = format(date, "yyyy-MM-dd");

      const dayRecord = enhancedRecords.find(
        (record) => record.date === dateString
      );
      const dayName = format(date, "EEE", { locale: vi });

      return {
        day: dayName,
        date: format(date, "dd/MM"),
        smoking: dayRecord?.totalSmokedCount || 0,
        craving: dayRecord?.totalCravingCount || 0,
      };
    });

    // Monthly data processing
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthlyData = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentYear, currentMonth, i + 1);
      const dateString = format(date, "yyyy-MM-dd");

      const dayRecord = enhancedRecords.find(
        (record) => record.date === dateString
      );

      return {
        day: i + 1,
        date: format(date, "dd/MM"),
        smoking: dayRecord?.totalSmokedCount || 0,
        craving: dayRecord?.totalCravingCount || 0,
      };
    });

    // Calculate totals
    const weeklyTotal = {
      smoking: weeklyData.reduce((sum, day) => sum + day.smoking, 0),
      craving: weeklyData.reduce((sum, day) => sum + day.craving, 0),
    };

    const monthlyTotal = {
      smoking: monthlyData.reduce((sum, day) => sum + day.smoking, 0),
      craving: monthlyData.reduce((sum, day) => sum + day.craving, 0),
    };

    console.log("🔍 DEBUG trackingAnalytics processed:", {
      weeklyDataLength: weeklyData.length,
      monthlyDataLength: monthlyData.length,
      weeklyTotal,
      monthlyTotal,
    });

    return {
      weeklyData,
      monthlyData,
      weeklyTotal,
      monthlyTotal,
    };
  }, [enhancedRecords]);

  // Component for rendering mood charts
  const renderMoodCharts = () => (
    <div className="space-y-6">
      {/* Row 1: Pie Chart + Mood Correlation Chart */}
      <div className="grid grid-cols-3 gap-6">
        {/* 1. Pie Chart - Mood Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="grid-cols-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center gap-2 pb-9">
                  <PieChartIcon className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Phân Bố Tâm Trạng</CardTitle>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[305px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodAnalytics.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {moodAnalytics.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value, name) => [`${value} lần`, `${name}`]}
                      labelFormatter={(label) => `Cảm xúc: ${label}`}
                    />
                    <Legend
                      formatter={(value) => {
                        const pieEntry = moodAnalytics.pieData.find(
                          (d) => d.name === value
                        );
                        return `${pieEntry?.emoji || ""} ${value}`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2: Mood Tracking Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-2"
        >
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800">
                  Xu Hướng Tâm Trạng (14 ngày qua)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={moodAnalytics.moodTimeline}
                    margin={{ top: 20, right: 50, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />

                    {/* Background gradient zones */}
                    <defs>
                      <linearGradient
                        id="emeraldGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10b981"
                          stopOpacity="0.1"
                        />
                        <stop
                          offset="100%"
                          stopColor="#10b981"
                          stopOpacity="0.05"
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="displayDate"
                      tick={{ fontSize: 12, fill: "#065f46" }}
                      interval="preserveStartEnd"
                      axisLine={{ stroke: "#10b981" }}
                    />
                    <YAxis
                      domain={[-2.5, 2.5]}
                      ticks={[-2, -1, 0, 1, 2]}
                      tickFormatter={(value) => {
                        if (value === 2) return "Tích cực";
                        if (value === 1) return "Khác";
                        if (value === 0) return "Bình thường";
                        if (value === -1) return "";
                        if (value === -2) return "Tiêu cực";
                        return "";
                      }}
                      axisLine={{ stroke: "#10b981" }}
                      tick={{ fontSize: 12, fill: "#065f46" }}
                    />

                    {/* Reference lines with emerald theme */}
                    <Line
                      type="monotone"
                      dataKey={() => 2}
                      stroke="#10b981"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      connectNulls={false}
                      opacity={0.4}
                    />
                    <Line
                      type="monotone"
                      dataKey={() => 0}
                      stroke="#6b7280"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      connectNulls={false}
                      opacity={0.3}
                    />
                    <Line
                      type="monotone"
                      dataKey={() => -2}
                      stroke="#ef4444"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      connectNulls={false}
                      opacity={0.4}
                    />

                    <RechartsTooltip
                      content={(props) => {
                        const { active, payload, label } = props;

                        if (!active || !payload || !payload[0]) {
                          return null;
                        }

                        const data = payload[0].payload;

                        if (!data?.hasMood) {
                          return (
                            <div
                              style={{
                                backgroundColor: "#f0fdf4",
                                border: "2px solid #10b981",
                                borderRadius: "12px",
                                boxShadow:
                                  "0 10px 15px -3px rgba(16, 185, 129, 0.1)",
                                padding: "12px",
                              }}
                            >
                              <div className="text-emerald-800 font-semibold mb-1">
                                Ngày {label}
                              </div>
                              <div className="text-gray-600">
                                Không có dữ liệu tâm trạng
                              </div>
                            </div>
                          );
                        }

                        const actualMoodVietnamese = data.actualMoodVietnamese;
                        const moodScore = data.moodScore;
                        let moodEmoji = "";

                        if (moodScore === 2) {
                          moodEmoji = "😊";
                        } else if (moodScore === 1) {
                          moodEmoji = "🤔";
                        } else if (moodScore === 0) {
                          moodEmoji = "😐";
                        } else if (moodScore === -2) {
                          moodEmoji = "😔";
                        }

                        return (
                          <div
                            style={{
                              backgroundColor: "#f0fdf4",
                              border: "2px solid #10b981",
                              borderRadius: "12px",
                              boxShadow:
                                "0 10px 15px -3px rgba(16, 185, 129, 0.1)",
                              padding: "12px",
                            }}
                          >
                            <div className="text-emerald-800 font-semibold mb-1">
                              Ngày {label}
                            </div>
                            <div className="text-emerald-700 font-medium">
                              {moodEmoji} {actualMoodVietnamese}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="moodScore"
                      stroke="#10b981"
                      strokeWidth={4}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        const score = payload?.moodScore;
                        let color = "#10b981";

                        if (score === 2)
                          color = "#10b981"; // Emerald for positive
                        else if (score === 1)
                          color = "#f59e0b"; // Amber for other
                        else if (score === 0)
                          color = "#6b7280"; // Gray for neutral
                        else if (score === -2) color = "#ef4444"; // Red for negative

                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={color}
                            stroke="#fff"
                            strokeWidth={3}
                            style={{
                              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                            }}
                          />
                        );
                      }}
                      activeDot={{
                        r: 10,
                        stroke: "#10b981",
                        strokeWidth: 3,
                        fill: "#fff",
                        style: {
                          filter:
                            "drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3))",
                        },
                      }}
                      name="Tâm trạng"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  // Component for rendering activity charts
  const renderActivityCharts = () => (
    <div className="space-y-6">
      {/* Row 1: Situation Pie Chart + Situation Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Situation Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-orange-600" />
                Phân Bố Tình Huống Thèm Thuốc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {situationAnalytics.commonSituations.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={situationAnalytics.commonSituations}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="situation"
                      >
                        {situationAnalytics.commonSituations.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value, name) => [`${value} lần`, name]}
                        labelFormatter={(label) => `Tình huống: ${label}`}
                      />
                      <Legend
                        formatter={(value) => {
                          const situationEntry =
                            situationAnalytics.commonSituations.find(
                              (d) => d.situation === value
                            );
                          return `${value} (${situationEntry?.count || 0})`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p>Chưa có dữ liệu tình huống</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Situation Bar Chart - Most Common Situations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-lg">
                  Tình Huống Gây Thèm Thuốc Nhiều Nhất
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-73">
                {situationAnalytics.commonSituations.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={situationAnalytics.commonSituations.slice(0, 8)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="situation"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                        interval={0}
                      />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(value) => [
                          `${value} lần`,
                          "Số lần thèm thuốc",
                        ]}
                      />
                      <Bar
                        dataKey="count"
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                        className="cursor-pointer hover:opacity-80"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p>Chưa có dữ liệu tình huống</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 2: Weekly Pattern Chart */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Xu Hướng Tình Huống Theo Ngày Trong Tuần
              </CardTitle>
              <div className="text-sm text-gray-500 mt-2">
                Tổng hợp các tình huống gây thèm thuốc theo từng thứ trong tuần
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {situationAnalytics.weeklyPattern &&
                situationAnalytics.weeklyPattern.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={situationAnalytics.weeklyPattern.map((dayData) => {
                        // Tạo object mới chỉ chứa day và những trường có giá trị > 0
                        const filteredDayData: Record<string, string | number> =
                          { day: dayData.day };

                        situationAnalytics.commonSituations
                          .slice(0, 5)
                          .forEach((situation) => {
                            const value = dayData[situation.situation];
                            if (typeof value === "number" && value > 0) {
                              filteredDayData[situation.situation] = value;
                            }
                          });

                        return filteredDayData;
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      barCategoryGap={5}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={(value) =>
                          value % 2 === 0 ? value.toString() : ""
                        }
                        domain={[0, "dataMax"]}
                      />
                      <RechartsTooltip
                        content={(props) => {
                          const { active, payload, label } = props;
                          if (!active || !payload) return null;

                          // Lọc ra những trường có giá trị > 0
                          const validData = payload.filter(
                            (item) => item.value > 0
                          );

                          if (validData.length === 0) return null;

                          return (
                            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                              <div className="font-semibold text-gray-800 mb-2">
                                {label}
                              </div>
                              {validData.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  ></div>
                                  <span>
                                    {item.name}: {item.value} lần
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        }}
                      />
                      <Legend />
                      {situationAnalytics.commonSituations
                        .slice(0, 5)
                        .filter((situation) => {
                          // Chỉ hiển thị những situation có ít nhất 1 ngày có giá trị > 0
                          return situationAnalytics.weeklyPattern.some(
                            (dayData) => {
                              const value = dayData[situation.situation];
                              return typeof value === "number" && value > 0;
                            }
                          );
                        })
                        .map((situation) => (
                          <Bar
                            key={situation.situation}
                            dataKey={situation.situation}
                            fill={situation.color}
                            name={situation.situation}
                            radius={[2, 2, 0, 0]}
                          />
                        ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p>Chưa có dữ liệu xu hướng theo tuần</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  // Component for rendering tracking charts (smoking and craving)
  const renderTrackingCharts = () => (
    <div className="space-y-6">
      {/* Row 1: Weekly Data + Monthly Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Tracking Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Tuần Này
              </CardTitle>
              <div className="text-sm text-gray-500 mt-2">
                <div className="flex gap-4">
                  <span>
                    🚬 Tổng hút: {trackingAnalytics.weeklyTotal.smoking} điếu
                  </span>
                  <span>
                    💭 Tổng thèm: {trackingAnalytics.weeklyTotal.craving} lần
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trackingAnalytics.weeklyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value, name) => {
                        const label =
                          name === "smoking" ? "điếu hút" : "lần thèm";
                        return [
                          `${value} ${label}`,
                          name === "smoking" ? "Số điếu hút" : "Số lần thèm",
                        ];
                      }}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="smoking"
                      fill="#dc2626"
                      name="Số điếu hút"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="craving"
                      fill="#f59e0b"
                      name="Số lần thèm"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Tracking Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Tháng Này
              </CardTitle>
              <div className="text-sm text-gray-500 mt-2">
                <div className="flex gap-4">
                  <span>
                    🚬 Tổng hút: {trackingAnalytics.monthlyTotal.smoking} điếu
                  </span>
                  <span>
                    💭 Tổng thèm: {trackingAnalytics.monthlyTotal.craving} lần
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trackingAnalytics.monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value, name) => {
                        const label =
                          name === "smoking" ? "điếu hút" : "lần thèm";
                        return [
                          `${value} ${label}`,
                          name === "smoking" ? "Số điếu hút" : "Số lần thèm",
                        ];
                      }}
                      labelFormatter={(label) => `Ngày ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="smoking"
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={{ fill: "#dc2626", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Số điếu hút"
                    />
                    <Line
                      type="monotone"
                      dataKey="craving"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5 }}
                      name="Số lần thèm"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  // Component for rendering social charts
  const renderSocialCharts = () => (
    <div className="space-y-6">
      {/* Row 1: Companion Distribution + Top Companions Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Companion Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
                Phân Bố Người Đồng Hành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {socialAnalytics.companionDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={socialAnalytics.companionDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {socialAnalytics.companionDistribution.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value, name) => [`${value} lần`, `${name}`]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p>Chưa có dữ liệu người đồng hành</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Companions Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                Người Đồng Hành Gây Thèm Thuốc Nhiều Nhất
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {socialAnalytics.topCompanions &&
                socialAnalytics.topCompanions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={socialAnalytics.topCompanions}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="companion"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                        interval={0}
                      />
                      <YAxis />
                      <RechartsTooltip
                        formatter={(value) => [
                          `${value} lần`,
                          "Số lần thèm thuốc",
                        ]}
                      />
                      <Bar
                        dataKey="count"
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                        className="cursor-pointer hover:opacity-80"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p>Chưa có dữ liệu người đồng hành</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 2: Weekly Pattern Chart */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Xu Hướng Người Đồng Hành Theo Ngày Trong Tuần
              </CardTitle>
              <div className="text-sm text-gray-500 mt-2">
                Tổng hợp các người đồng hành gây thèm thuốc theo từng thứ trong
                tuần
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {socialAnalytics.companionWeeklyPattern &&
                socialAnalytics.companionWeeklyPattern.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={socialAnalytics.companionWeeklyPattern.map(
                        (dayData) => {
                          // Tạo object mới chỉ chứa day và những trường có giá trị > 0
                          const filteredDayData: Record<
                            string,
                            string | number
                          > = { day: dayData.day };

                          socialAnalytics.companionDistribution
                            .slice(0, 4)
                            .forEach((companion) => {
                              const value = dayData[companion.name];
                              if (typeof value === "number" && value > 0) {
                                filteredDayData[companion.name] = value;
                              }
                            });

                          return filteredDayData;
                        }
                      )}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      barCategoryGap={5}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={(value) =>
                          value % 2 === 0 ? value.toString() : ""
                        }
                        domain={[0, "dataMax"]}
                      />
                      <RechartsTooltip
                        content={(props) => {
                          const { active, payload, label } = props;
                          if (!active || !payload) return null;

                          // Lọc ra những trường có giá trị > 0
                          const validData = payload.filter(
                            (item) => item.value > 0
                          );

                          if (validData.length === 0) return null;

                          return (
                            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                              <div className="font-semibold text-gray-800 mb-2">
                                {label}
                              </div>
                              {validData.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  ></div>
                                  <span>
                                    {item.name}: {item.value} lần
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        }}
                      />
                      <Legend />
                      {socialAnalytics.companionDistribution
                        .slice(0, 4)
                        .filter((companion) => {
                          // Chỉ hiển thị những companion có ít nhất 1 ngày có giá trị > 0
                          return socialAnalytics.companionWeeklyPattern.some(
                            (dayData) => {
                              const value = dayData[companion.name];
                              return typeof value === "number" && value > 0;
                            }
                          );
                        })
                        .map((companion) => (
                          <Bar
                            key={companion.name}
                            dataKey={companion.name}
                            fill={companion.color}
                            name={companion.name}
                            radius={[2, 2, 0, 0]}
                          />
                        ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p>Chưa có dữ liệu xu hướng theo tuần</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading state with tabs structure */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 p-4 border-r border-gray-200 last:border-r-0"
              >
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] bg-gray-100 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Enhanced Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "mood" | "activity" | "social" | "tracking")
        }
        className="w-full mt-15 relative"
      >
        {/* Tab Navigation */}
        <div className="flex justify-center absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-white border-2 border-emerald-200 rounded-xl p-1 shadow-lg h-auto">
            <TabsTrigger
              value="mood"
              className="relative py-2 px-3 rounded-lg text-center transition-all duration-300 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-emerald-50 data-[state=active]:hover:bg-emerald-500 h-auto"
            >
              <div className="flex items-center gap-2">
                <div className="text-lg">🧠</div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-xs">Tâm Trạng</span>
                </div>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="activity"
              className="relative py-2 px-3 rounded-lg text-center transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-orange-50 data-[state=active]:hover:bg-orange-500 h-auto"
            >
              <div className="flex items-center gap-2">
                <div className="text-lg">🚬</div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-xs">Hoạt Động</span>
                </div>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="social"
              className="relative py-2 px-3 rounded-lg text-center transition-all duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-blue-50 data-[state=active]:hover:bg-blue-500 h-auto"
            >
              <div className="flex items-center gap-2">
                <div className="text-lg">👥</div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-xs">Xã Hội</span>
                </div>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="tracking"
              className="relative py-2 px-3 rounded-lg text-center transition-all duration-300 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-purple-50 data-[state=active]:hover:bg-purple-500 h-auto"
            >
              <div className="flex items-center gap-2">
                <div className="text-lg">📊</div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-xs">Ghi Nhận</span>
                </div>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content with proper spacing */}
        <div>
          <TabsContent value="mood" className="mt-0">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Phân Tích Tâm Trạng
                </h2>
              </div>
              {renderMoodCharts()}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Phân Tích Tình Huống
                </h2>
              </div>
              {renderActivityCharts()}
            </div>
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  👥 Phân Tích Xã Hội & Môi Trường
                </h2>
              </div>
              {renderSocialCharts()}
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="mt-0">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Ghi Nhận Cơn Thèm & Hút Thuốc
                </h2>
              </div>
              {renderTrackingCharts()}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
