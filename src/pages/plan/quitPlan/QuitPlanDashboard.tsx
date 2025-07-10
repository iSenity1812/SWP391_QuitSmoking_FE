"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"
import { OverviewTab } from "./dashboard/OverviewTab"
import { ProgressTab } from "./dashboard/ProgressTab"
import { BenefitsTab } from "./dashboard/BenefitTab"
import { useQuitPlan } from "@/services/quitPlanService"

export function QuitPlanDashboard() {
  const { quitPlan, isLoading, error, refetch } = useQuitPlan()
  const [activeTab, setActiveTab] = useState("overview")

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span className="text-lg font-medium text-gray-700">Loading your quit plan...</span>
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
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Error loading quit plan:</strong> {error}
            </AlertDescription>
          </Alert>

          <div className="text-center mt-6">
            <button
              onClick={refetch}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!quitPlan) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Active Quit Plan</h2>
            <p className="text-gray-600 mb-6">
              You don't have an active quit plan. Create one to start tracking your progress.
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all">
              Create Quit Plan
            </button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* câu động lực cho người dùng */}
      <div className="my-6 max-w-7xl mx-auto bg-orange-400 text-white p-4 rounded-lg shadow-lg">
        <div className="my-2 text-sm ">⚡ 
          Bạn hãy nhớ rằng, mục đích việc ghi nhận cơn thèm hoặc hút thuốc là để giúp bạn biết được tình trạng hiện tại của bạn như thế nào. 
          Hãy ghi nhận và theo dõi, từ đó cải thiện sức khỏe của bạn!</div>
      </div>
      
      <div className="p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/80 backdrop-blur-sm border border-emerald-200">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
                >
                  Kế Hoạch Của Tôi
                </TabsTrigger>
                <TabsTrigger
                  value="progress"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
                >
                  Hành Trình
                </TabsTrigger>
                <TabsTrigger
                  value="benefits"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
                >
                  Thành Tựu
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
                  <OverviewTab quitPlan={quitPlan} onViewProgress={() => setActiveTab("progress")} />
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
                  <ProgressTab quitPlan={quitPlan} />
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
                  <BenefitsTab quitPlan={quitPlan} />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}