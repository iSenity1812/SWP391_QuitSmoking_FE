import { Cigarette, Flame, HeartHandshake } from "lucide-react"
import { getVietnameseTranslation } from "@/utils/enumTranslations"
import type { Mood } from "@/services/dailySummaryService"

interface SummaryCardsProps {
    totalSmoked: number
    totalCravings: number
    todayDailySummary?: {
        mood?: string
    }
}

export function SummaryCards({ totalSmoked, totalCravings, todayDailySummary }: SummaryCardsProps) {
    return (
        <div className="space-y-4">
            <div>
                <div className="bg-red-50 px-3 py-5 rounded-lg border border-red-200">
                    <div className="flex items-center gap-4">
                        <Cigarette className="w-5 h-5 text-red-600" />
                        <div className="text-md text-red-600 font-medium">Tổng Số Thuốc Đã Hút</div>
                    </div>
                    <div className="text-xl font-bold text-center text-red-700">{totalSmoked}</div>
                </div>
            </div>

            <div>
                <div className="bg-orange-50 px-3 py-5 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-4">
                        <Flame className="w-5 h-5 text-orange-600" />
                        <div className="text-md text-orange-600 font-medium">Tổng Lần Thèm Thuốc</div>
                    </div>
                    <div className="text-xl text-center font-bold text-orange-700">{totalCravings}</div>
                </div>
            </div>

            <div>
                <div className="bg-blue-50 px-3 py-5 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-4">
                        <HeartHandshake className="w-5 h-5 text-sky-600" />
                        <div className="text-md text-sky-600 font-medium">Tâm Trạng Hôm Nay</div>
                    </div>
                    <div className="text-md text-center font-medium text-blue-700">
                        {todayDailySummary?.mood
                            ? getVietnameseTranslation(todayDailySummary.mood as Mood)
                            : "Chưa được ghi nhận"}
                    </div>
                </div>
            </div>
        </div>
    )
}
