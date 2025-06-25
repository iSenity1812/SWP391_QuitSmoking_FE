import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Filter,
  Search,
  Trophy,
  Target,
  Award,
  CalendarDays,
  Coins,
  PiggyBank,
  Banknote,
  Gem,
  Plane,
  CheckCircle,
  TrendingDown,
  Shield,
  RefreshCw,
  Sunrise,
  Heart,
  Activity,
  Users,
  Sparkles,
  Gift,
  Flame,
} from "lucide-react"
import type { User } from "../../../../types/user-types"

interface AchievementsTabProps {
  user: User
}

const getAchievementIcon = (iconName: string) => {
  switch (iconName) {
    case "calendar":
      return <CalendarDays className="h-8 w-8" />
    case "trophy":
      return <Trophy className="h-8 w-8" />
    case "award":
      return <Award className="h-8 w-8" />
    case "medal":
      return <Award className="h-8 w-8" /> // Using Award for medal as it's similar
    case "crown":
      return <Award className="h-8 w-8" /> // Using Award for crown
    case "flame":
      return <Flame className="h-8 w-8" />
    case "coins":
      return <Coins className="h-8 w-8" />
    case "piggy-bank":
      return <PiggyBank className="h-8 w-8" />
    case "banknote":
      return <Banknote className="h-8 w-8" />
    case "gem":
      return <Gem className="h-8 w-8" />
    case "plane":
      return <Plane className="h-8 w-8" />
    case "check-circle":
      return <CheckCircle className="h-8 w-8" />
    case "trending-down":
      return <TrendingDown className="h-8 w-8" />
    case "target":
      return <Target className="h-8 w-8" />
    case "shield":
      return <Shield className="h-8 w-8" />
    case "refresh-cw":
      return <RefreshCw className="h-8 w-8" />
    case "sunrise":
      return <Sunrise className="h-8 w-8" />
    case "heart":
      return <Heart className="h-8 w-8" />
    case "activity":
      return <Activity className="h-8 w-8" />
    case "users":
      return <Users className="h-8 w-8" />
    case "sparkles":
      return <Sparkles className="h-8 w-8" />
    case "gift":
      return <Gift className="h-8 w-8" />
    case "calendar-days":
      return <CalendarDays className="h-8 w-8" />
    default:
      return <Award className="h-8 w-8" /> // Default icon
  }
}

export function AchievementsTab({ user }: AchievementsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Thành tựu của bạn</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {user.achievementCategories.map((category) => (
          <Button key={category.id} variant="outline" size="sm" className="text-xs">
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg relative overflow-hidden">
          <CardContent className="p-6 text-center relative z-10">
            <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Trophy className="h-8 w-8" />
            </div>
            <p className="text-4xl font-bold mb-2">{user.achievements.filter((a) => a.completed).length}</p>
            <p className="text-emerald-100 text-sm">Đã hoàn thành</p>
          </CardContent>
          {/* Decorative cloud elements */}
          <div className="absolute top-4 right-4 w-12 h-8 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-10 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-8 w-8 h-6 bg-white/10 rounded-full"></div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg relative overflow-hidden">
          <CardContent className="p-6 text-center relative z-10">
            <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8" />
            </div>
            <p className="text-4xl font-bold mb-2">{user.achievements.filter((a) => !a.completed).length}</p>
            <p className="text-blue-100 text-sm">Chưa hoàn thành</p>
          </CardContent>
          {/* Decorative cloud elements */}
          <div className="absolute top-6 left-6 w-10 h-6 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-6 right-6 w-14 h-8 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/3 right-4 w-6 h-4 bg-white/10 rounded-full"></div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg relative overflow-hidden">
          <CardContent className="p-6 text-center relative z-10">
            <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center"></div>
            <p className="text-4xl font-bold mb-2">
              {Math.round((user.achievements.filter((a) => a.completed).length / user.achievements.length) * 100)}%
            </p>
            <p className="text-purple-100 text-sm">Tỷ lệ hoàn thành</p>
          </CardContent>
          {/* Decorative cloud elements */}
          <div className="absolute top-4 left-4 w-8 h-6 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-12 h-8 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-4 left-1/3 w-6 h-4 bg-white/10 rounded-full"></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`relative ${achievement.completed
              ? "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border-emerald-200 dark:border-emerald-800"
              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              }`}
          >
            <CardContent className="p-6">
              <div className="text-center">
                {/* Category Badge */}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${achievement.category === "time"
                      ? "border-blue-300 text-blue-600"
                      : achievement.category === "saving"
                        ? "border-green-300 text-green-600"
                        : achievement.category === "health"
                          ? "border-red-300 text-red-600"
                          : achievement.category === "social"
                            ? "border-purple-300 text-purple-600"
                            : "border-gray-300 text-gray-600"
                      }`}
                  >
                    {achievement.category === "time"
                      ? "Thời gian"
                      : achievement.category === "saving"
                        ? "Tiết kiệm"
                        : achievement.category === "health"
                          ? "Sức khỏe"
                          : achievement.category === "social"
                            ? "Cộng đồng"
                            : achievement.category === "resilience"
                              ? "Kiên cường"
                              : achievement.category === "special"
                                ? "Đặc biệt"
                                : achievement.category === "quantity"
                                  ? "Số lượng"
                                  : "Hàng ngày"}
                  </Badge>
                </div>

                <div
                  className={`rounded-full p-4 mb-4 inline-block ${achievement.completed ? "bg-emerald-100 dark:bg-emerald-900" : "bg-slate-100 dark:bg-slate-700"
                    }`}
                >
                  {getAchievementIcon(achievement.icon)}
                </div>
                <h3
                  className={`font-semibold mb-2 ${achievement.completed
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-500 dark:text-slate-400"
                    }`}
                >
                  {achievement.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.description}</p>

                {achievement.completed ? (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                  >
                    Hoàn thành {achievement.date}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-400">
                    Chưa hoàn thành
                  </Badge>
                )}
              </div>
            </CardContent>

            {/* Progress indicator for incomplete achievements */}
            {!achievement.completed && achievement.daysRequired && (
              <div className="absolute bottom-0 left-0 right-0 bg-slate-200 dark:bg-slate-700 h-1">
                <div
                  className="bg-emerald-500 h-1 transition-all duration-300"
                  style={{
                    width: `${Math.min((user.daysSmokeFreee / achievement.daysRequired) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
