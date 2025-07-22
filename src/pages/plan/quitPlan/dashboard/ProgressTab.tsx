"use client"

import { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { format, subDays } from "date-fns"
import { TooltipProvider } from "@/components/ui/tooltip"
import { quitPlanService } from "@/services/quitPlanService"
import type { QuitPlanResponseDTO } from "@/services/quitPlanService"
import type { DailySummaryResponse } from "@/services/dailySummaryService"
import { dailySummaryService } from "@/services/dailySummaryService"
import { useDailyDataForDayRange, type DailyChartDataResponse, DataVisualizationService } from "@/services/dataVisualizationService"
import { DiaryInputModal } from "./components/DiaryInputModal"
import { getVietnameseTranslation } from "@/utils/enumTranslations"
import type { Situation, WithWhom } from "@/services/cravingTrackingService"
import type { Mood } from "@/services/dailySummaryService"
import {
  PlanDetailsCard,
  DailyDiaryCard,
  SummaryCards,
  StatisticsCharts,
  StatisticsCards,
  RestartConfirmationModal
} from "./components"

// Temporary functions - should be imported from utils
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message)
}

// Interface for enhanced records combining chart data with notes
interface EnhancedDailyRecord {
  dailySummaryId?: number;
  date: string;
  totalSmokedCount: number | null;
  totalCravingCount: number | null;
  mood: string;
  note: string;
  moneySaved: number;
  goalMet: boolean;
}

interface ProgressTabProps {
  quitPlan: QuitPlanResponseDTO;
  refetchQuitPlan: () => Promise<void>;
  dailySummary: DailySummaryResponse | null;
  refetchDailySummary: () => Promise<void>;
}

export function ProgressTab({ quitPlan, refetchQuitPlan, dailySummary: todayDailySummary, refetchDailySummary }: ProgressTabProps) {
  const navigate = useNavigate()
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [isRestarting, setIsRestarting] = useState(false)
  const [restartSuccess, setRestartSuccess] = useState(false)
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DailySummaryResponse | null>(null)

  // Hybrid approach: Get chart data from dataVisualizationService, then fetch notes from dailySummaryService
  const startDate = subDays(new Date(), 29) // Get last 30 days
  const endDate = new Date()

  const {
    data: chartData,
    isLoading: isChartDataLoading,
    error: chartDataError,
    refetch: refetchChartData,
  } = useDailyDataForDayRange(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))

  // State for storing enhanced records with notes
  const [enhancedRecords, setEnhancedRecords] = useState<EnhancedDailyRecord[]>([])
  const [isEnhancingRecords, setIsEnhancingRecords] = useState(false)
  const [enhanceError, setEnhanceError] = useState<string | null>(null)

  const totalSmoked = enhancedRecords.reduce((sum, record) => sum + (record.totalSmokedCount || 0), 0)
  const totalCravings = enhancedRecords.reduce((sum, record) => sum + (record.totalCravingCount || 0), 0)
  // Check if there's a daily summary record for today specifically
  const hasDataForToday = todayDailySummary !== null

  // State for craving statistics
  const [cravingStats, setCravingStats] = useState({
    totalCravings: 0,
    commonSituations: [] as { situation: string; count: number }[],
    commonCompanions: [] as { companion: string; count: number }[]
  })
  const [isCravingStatsLoading, setIsCravingStatsLoading] = useState(false)

  // State for mood statistics
  const [moodStats, setMoodStats] = useState({
    totalMoodRecords: 0,
    commonMoods: [] as { mood: string; count: number }[]
  })
  const [isMoodStatsLoading, setIsMoodStatsLoading] = useState(false)

  // Function to enhance chart data with notes from dailySummaryService
  const enhanceRecordsWithNotes = useCallback(async () => {
    if (!chartData || chartData.length === 0) return

    setIsEnhancingRecords(true)
    setEnhanceError(null)

    try {
      // Filter chart data that has actual recorded values (not null/0)
      const recordsWithData = chartData.filter((item: DailyChartDataResponse) =>
        item.totalSmokedCount !== null ||
        item.totalCravingCount !== null ||
        item.mood !== null
      )

      console.log('📊 [ProgressTab] Chart data with actual values:', recordsWithData.length)

      // Fetch notes for each record from dailySummaryService
      const enhancedData = await Promise.allSettled(
        recordsWithData.map(async (item: DailyChartDataResponse) => {
          try {
            const dailySummary = await dailySummaryService.getDailySummaryByDate(item.date)
            return {
              dailySummaryId: dailySummary?.dailySummaryId,
              date: item.date,
              totalSmokedCount: item.totalSmokedCount,
              totalCravingCount: item.totalCravingCount,
              mood: item.mood,
              note: dailySummary?.note || '',
              moneySaved: item.moneySaved,
              goalMet: (item.totalSmokedCount ?? 0) <= Math.max(0, Math.floor((item.totalSmokedCount ?? 0) * 0.8)) // Simple goal calculation
            } as EnhancedDailyRecord
          } catch (error) {
            console.warn(`Failed to fetch note for ${item.date}:`, error)
            return {
              date: item.date,
              totalSmokedCount: item.totalSmokedCount,
              totalCravingCount: item.totalCravingCount,
              mood: item.mood,
              note: '',
              moneySaved: item.moneySaved,
              goalMet: false
            } as EnhancedDailyRecord
          }
        })
      )

      const successfulRecords = enhancedData
        .filter((result): result is PromiseFulfilledResult<EnhancedDailyRecord> =>
          result.status === 'fulfilled'
        )
        .map(result => result.value)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setEnhancedRecords(successfulRecords)
      console.log('✅ [ProgressTab] Enhanced records:', successfulRecords.length)
    } catch (error) {
      console.error('❌ [ProgressTab] Error enhancing records:', error)
      setEnhanceError('Không thể tải chi tiết ghi chú')
    } finally {
      setIsEnhancingRecords(false)
    }
  }, [chartData])

  // Function to fetch and calculate craving statistics from hourly data
  const fetchCravingStatistics = useCallback(async () => {
    if (!chartData || chartData.length === 0) return

    setIsCravingStatsLoading(true)

    try {
      const dataVisualizationService = DataVisualizationService.getInstance()

      // Get hourly data for ALL days that have any records (smoking or craving)
      const daysWithData = chartData.filter(day =>
        (day.totalCravingCount && day.totalCravingCount > 0) ||
        (day.totalSmokedCount && day.totalSmokedCount > 0)
      )

      const allSituations: string[] = []
      const allCompanions: string[] = []
      let totalInteractions = 0

      // Fetch hourly data for each day with any data
      for (const day of daysWithData) {
        try {
          const hourlyData = await dataVisualizationService.getHourlyDataForDay(day.date)

          for (const hour of hourlyData) {
            // Count all interactions (both smoking and craving) and collect situations/companions
            const hasAnyActivity = (hour.cravingCount && hour.cravingCount > 0) ||
              (hour.smokedCount && hour.smokedCount > 0)

            if (hasAnyActivity) {
              totalInteractions += (hour.cravingCount || 0) + (hour.smokedCount || 0)
              allSituations.push(...hour.situations)
              allCompanions.push(...hour.withWhoms)
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch hourly data for ${day.date}:`, error)
        }
      }

      // Count occurrences of each situation and companion
      const situationCounts = allSituations.reduce((acc, situation) => {
        const translated = getVietnameseTranslation(situation as Situation)
        acc[translated] = (acc[translated] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const companionCounts = allCompanions.reduce((acc, companion) => {
        const translated = getVietnameseTranslation(companion as WithWhom)
        acc[translated] = (acc[translated] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Define default situations and companions to ensure we always have 5
      const defaultSituations = [
        'Sau bữa ăn', 'Khi căng thẳng', 'Khi làm việc', 'Khi thư giãn', 'Giờ nghỉ làm việc'
      ]
      const defaultCompanions = [
        'Một mình', 'Với bạn thân', 'Với thành viên gia đình', 'Với đồng nghiệp', 'Với người yêu'
      ]

      // Get top 5 situations with highest counts, but ensure we show at least 5
      const topSituations = Object.entries(situationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Take only top 5
        .map(([situation, count]) => ({ situation, count }))

      // If we have less than 5, fill with defaults
      const finalSituations = [...topSituations]
      const usedSituations = new Set(topSituations.map(s => s.situation))

      // Only add defaults if we have less than 5
      if (finalSituations.length < 5) {
        for (const defaultSit of defaultSituations) {
          if (!usedSituations.has(defaultSit) && finalSituations.length < 5) {
            finalSituations.push({ situation: defaultSit, count: 0 })
          }
        }
      }

      // Get top 5 companions with highest counts, but ensure we show at least 5
      const topCompanions = Object.entries(companionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Take only top 5
        .map(([companion, count]) => ({ companion, count }))

      // If we have less than 5, fill with defaults
      const finalCompanions = [...topCompanions]
      const usedCompanions = new Set(topCompanions.map(c => c.companion))

      // Only add defaults if we have less than 5
      if (finalCompanions.length < 5) {
        for (const defaultComp of defaultCompanions) {
          if (!usedCompanions.has(defaultComp) && finalCompanions.length < 5) {
            finalCompanions.push({ companion: defaultComp, count: 0 })
          }
        }
      }

      setCravingStats({
        totalCravings: totalInteractions,
        commonSituations: finalSituations, // Top 5 situations only
        commonCompanions: finalCompanions // Top 5 companions only
      })

      console.log('✅ [ProgressTab] Smoking & Craving statistics calculated:', {
        totalInteractions,
        situations: finalSituations.length,
        companions: finalCompanions.length,
        daysAnalyzed: daysWithData.length
      })
    } catch (error) {
      console.error('❌ [ProgressTab] Error fetching craving statistics:', error)
      // Set default empty data if error
      setCravingStats({
        totalCravings: 0,
        commonSituations: [
          { situation: 'Sau bữa ăn', count: 0 },
          { situation: 'Khi căng thẳng', count: 0 },
          { situation: 'Khi làm việc', count: 0 },
          { situation: 'Khi thư giãn', count: 0 },
          { situation: 'Giờ nghỉ làm việc', count: 0 }
        ],
        commonCompanions: [
          { companion: 'Một mình', count: 0 },
          { companion: 'Với bạn thân', count: 0 },
          { companion: 'Với thành viên gia đình', count: 0 },
          { companion: 'Với đồng nghiệp', count: 0 },
          { companion: 'Với người yêu', count: 0 }
        ]
      })
    } finally {
      setIsCravingStatsLoading(false)
    }
  }, [chartData])

  // Function to fetch and calculate mood statistics from enhanced records
  const fetchMoodStatistics = useCallback(async () => {
    if (!enhancedRecords || enhancedRecords.length === 0) return

    setIsMoodStatsLoading(true)

    try {
      // Filter records that have mood data
      const recordsWithMood = enhancedRecords.filter(record => record.mood && record.mood.trim() !== '')

      const allMoods: string[] = recordsWithMood.map(record => record.mood)
      const totalMoodRecords = allMoods.length

      // Count occurrences of each mood
      const moodCounts = allMoods.reduce((acc, mood) => {
        const translated = getVietnameseTranslation(mood as Mood)
        acc[translated] = (acc[translated] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Define default moods to ensure we always have 5
      const defaultMoods = [
        'Bình thường', 'Vui', 'Căng thẳng', 'Thư giãn', 'Tự tin'
      ]

      // Get top 5 moods with highest counts
      const topMoods = Object.entries(moodCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Take only top 5
        .map(([mood, count]) => ({ mood, count }))

      // If we have less than 5, fill with defaults
      const finalMoods = [...topMoods]
      const usedMoods = new Set(topMoods.map(m => m.mood))

      // Only add defaults if we have less than 5
      if (finalMoods.length < 5) {
        for (const defaultMood of defaultMoods) {
          if (!usedMoods.has(defaultMood) && finalMoods.length < 5) {
            finalMoods.push({ mood: defaultMood, count: 0 })
          }
        }
      }

      setMoodStats({
        totalMoodRecords: totalMoodRecords,
        commonMoods: finalMoods // Top 5 moods only
      })

      console.log('✅ [ProgressTab] Mood statistics calculated:', {
        totalMoodRecords,
        moods: finalMoods.length,
        recordsAnalyzed: recordsWithMood.length
      })
    } catch (error) {
      console.error('❌ [ProgressTab] Error fetching mood statistics:', error)
      // Set default empty data if error
      setMoodStats({
        totalMoodRecords: 0,
        commonMoods: [
          { mood: 'Bình thường', count: 0 },
          { mood: 'Vui', count: 0 },
          { mood: 'Căng thẳng', count: 0 },
          { mood: 'Thư giãn', count: 0 },
          { mood: 'Tự tin', count: 0 }
        ]
      })
    } finally {
      setIsMoodStatsLoading(false)
    }
  }, [enhancedRecords])

  // Enhance records when chart data changes
  useEffect(() => {
    enhanceRecordsWithNotes()
    fetchCravingStatistics()
  }, [enhanceRecordsWithNotes, fetchCravingStatistics])

  // Fetch mood statistics when enhanced records change
  useEffect(() => {
    fetchMoodStatistics()
  }, [fetchMoodStatistics])

  // Alias for consistency with existing code
  const actualRecords = enhancedRecords
  const isRecentDataLoading = isChartDataLoading || isEnhancingRecords
  const recentDataError = chartDataError || enhanceError

  // Handlers
  const handleRestartPlan = () => {
    setShowRestartConfirm(true)
  }

  const handleCloseRestartModal = () => {
    if (!isRestarting && !restartSuccess) {
      setShowRestartConfirm(false)
      setRestartSuccess(false)
    }
  }

  const handleConfirmRestart = async () => {
    setIsRestarting(true)
    try {
      await quitPlanService.giveUpQuitPlan(quitPlan.quitPlanId)
      setRestartSuccess(true)
      setTimeout(() => {
        navigate("/plan/create")
      }, 3000)
    } catch (error) {
      console.error("Error giving up quit plan:", error)
      toast.error("Không thể từ bỏ kế hoạch. Vui lòng thử lại sau")
      setIsRestarting(false)
      setShowRestartConfirm(false)
    }
  }

  const closeDiaryModal = () => {
    setIsDiaryModalOpen(false)
    setEditingRecord(null) // Reset editing record when closing modal
  }

  const openDiaryModal = () => {
    setEditingRecord(null) // No editing record for create mode
    setIsDiaryModalOpen(true)
  }

  const openEditDialog = (record: DailySummaryResponse) => {
    setEditingRecord(record) // Set the record to edit
    setIsDiaryModalOpen(true)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Plan Details Header */}
        <div className="max-w-7xl mx-auto space-y-6">
          <PlanDetailsCard
            quitPlan={quitPlan as any}
            refetchQuitPlan={refetchQuitPlan}
            onRestartPlan={handleRestartPlan}
            isRestarting={isRestarting}
          />

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-1 sm:gap-3 lg:gap-4">
            {/* Left Column - Daily Diary */}
            <div className="xl:col-span-4 flex flex-col space-y-3 sm:space-y-5 h-full">
              <div className="flex-1">
                <DailyDiaryCard
                  actualRecords={actualRecords}
                  isRecentDataLoading={isRecentDataLoading}
                  recentDataError={recentDataError}
                  hasDataForToday={hasDataForToday}
                  quitPlan={quitPlan as any}
                  onOpenDiaryModal={openDiaryModal}
                  openEditDialog={openEditDialog}
                />
              </div>
            </div>

            {/* Right Column - Summary Cards */}
            <SummaryCards
              totalSmoked={totalSmoked}
              totalCravings={totalCravings}
              todayDailySummary={todayDailySummary || undefined}
            />
          </div>
        </div>


        {/* Statistics Charts */}
        <StatisticsCharts />

        {/* Statistics Cards */}
        <StatisticsCards
          cravingStats={cravingStats}
          moodStats={moodStats}
          isCravingStatsLoading={isCravingStatsLoading}
          isMoodStatsLoading={isMoodStatsLoading}
        />

        {/* Restart Confirmation Modal */}
        <RestartConfirmationModal
          isOpen={showRestartConfirm}
          onClose={handleCloseRestartModal}
          onConfirm={handleConfirmRestart}
          isRestarting={isRestarting}
          restartSuccess={restartSuccess}
        />

        {/* Diary Input Modal */}
        <DiaryInputModal
          isOpen={isDiaryModalOpen}
          onClose={closeDiaryModal}
          quitPlan={quitPlan}
          editingRecord={editingRecord || undefined}
          onRecordSuccess={() => {
            refetchDailySummary()
            refetchChartData()
          }}
        />
      </div>
    </TooltipProvider>
  )
}
