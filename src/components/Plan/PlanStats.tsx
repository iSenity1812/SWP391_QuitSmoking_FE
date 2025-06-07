import type React from "react"
import { CalendarIcon, DollarSign, TrendingUp, Heart } from "lucide-react"
import { StatCard } from "./ui/StatCard"
import type { PlanCalculations } from "@/components/Plan/types/plan"

export const PlanStats: React.FC<PlanCalculations> = ({ days, saved, progress }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
                icon={CalendarIcon}
                title="Ngày Không Hút Thuốc"
                value={days.toString()}
                subtitle="ngày"
                gradient="from-emerald-400 to-emerald-600"
            />
            <StatCard
                icon={DollarSign}
                title="Tiền Tiết Kiệm"
                value={saved.toLocaleString("vi-VN")}
                subtitle="VNĐ"
                gradient="from-green-400 to-green-600"
            />
            <StatCard
                icon={TrendingUp}
                title="Tiến Trình"
                value={Math.round(progress).toString()}
                subtitle="%"
                gradient="from-blue-400 to-blue-600"
            />
            <StatCard
                icon={Heart}
                title="Điểm Sức Khỏe"
                value="Đang Cải Thiện"
                subtitle=""
                gradient="from-rose-400 to-rose-600"
            />
        </div>
    )
}
