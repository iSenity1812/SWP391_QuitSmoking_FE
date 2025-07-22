import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { achievementService } from "@/services/achievementService";
import {
  Lock,
  Calendar,
  DollarSign,
  Cigarette,
  Shield,
  Heart,
  Users,
  Star,
  Clock,
  Trophy,
  Target,
  Crown,
  Award,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Achievement } from "@/types/achievement";

export default function AchievementsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const memberId = user?.userId || "";
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [unlockedMap, setUnlockedMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);

    // Gọi API để lấy achievements với trạng thái completed
    achievementService.getMemberAchievementsWithStatus(memberId).then((achievements: Achievement[]) => {
      console.log("Member achievements with completed status:", achievements);

      setAllAchievements(achievements);

      // Lấy danh sách ID của các achievement đã hoàn thành
      const completedIds = achievements
        .filter((achievement: Achievement) => achievement.completed)
        .map((achievement: Achievement) => achievement.id);

      setUnlockedIds(completedIds);

      // Map id -> completion date (nếu có)
      const map: Record<number, string> = {};
      achievements.forEach((achievement: Achievement) => {
        if (achievement.completed && achievement.completedAt) {
          map[achievement.id] = achievement.completedAt;
        }
      });
      setUnlockedMap(map);

      console.log("Completed IDs:", completedIds);
      console.log("Completed Map:", map);
    }).finally(() => setLoading(false));
  }, [memberId]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "DAYS_QUIT": return "Chuỗi ngày";
      case "MONEY_SAVED": return "Tiết kiệm tiền";
      case "CIGARETTES_NOT_SMOKED": return "Điếu thuốc tránh được";
      case "CRAVING_RESISTED": return "Chống chọi cơn thèm";
      case "RESILIENCE": return "Kiên trì";
      case "HEALTH": return "Sức khỏe";
      case "SOCIAL": return "Xã hội";
      case "SPECIAL": return "Đặc biệt";
      case "DAILY": return "Hàng ngày";
      default: return "Khác";
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "DAYS_QUIT": return "bg-emerald-500";
      case "MONEY_SAVED": return "bg-yellow-500";
      case "CIGARETTES_NOT_SMOKED": return "bg-red-500";
      case "CRAVING_RESISTED": return "bg-purple-500";
      case "RESILIENCE": return "bg-blue-500";
      case "HEALTH": return "bg-green-500";
      case "SOCIAL": return "bg-pink-500";
      case "SPECIAL": return "bg-orange-500";
      case "DAILY": return "bg-indigo-500";
      default: return "bg-gray-500";
    }
  }

  const getAchievementIcon = (type: string, unlocked: boolean) => {
    const iconClass = `w-12 h-12 ${unlocked ? "text-white" : "text-gray-400"}`;

    switch (type) {
      case "DAYS_QUIT": return <Calendar className={iconClass} />;
      case "MONEY_SAVED": return <DollarSign className={iconClass} />;
      case "CIGARETTES_NOT_SMOKED": return <Cigarette className={iconClass} />;
      case "CRAVING_RESISTED": return <Shield className={iconClass} />;
      case "RESILIENCE": return <Target className={iconClass} />;
      case "HEALTH": return <Heart className={iconClass} />;
      case "SOCIAL": return <Users className={iconClass} />;
      case "SPECIAL": return <Crown className={iconClass} />;
      case "DAILY": return <Clock className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  }

  const getProgressValue = (achievement: Achievement) => {
    // If achievement is unlocked, return 100%
    if (unlockedIds.includes(achievement.id)) {
      return 100;
    }

    // For locked achievements, we need to calculate based on current progress
    // This would require additional data from the API about current user stats
    // For now, return a mock progress based on achievement type
    const mockProgress = {
      'DAYS_QUIT': 45,
      'MONEY_SAVED': 30,
      'CIGARETTES_NOT_SMOKED': 60,
      'CRAVING_RESISTED': 25,
      'RESILIENCE': 70,
      'HEALTH': 40,
      'SOCIAL': 20,
      'SPECIAL': 10,
      'DAILY': 80
    };

    return mockProgress[achievement.achievementType as keyof typeof mockProgress] || 0;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Đang tải thành tựu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const groupedAchievements = allAchievements.reduce((acc, achievement) => {
    const type = achievement.achievementType || "OTHER";
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  // Filter achievements based on current filter
  const filteredGroupedAchievements = Object.entries(groupedAchievements).reduce((acc, [type, achievements]) => {
    const filtered = achievements.filter(achievement => {
      const unlocked = unlockedIds.includes(achievement.id);
      switch (filter) {
        case 'completed':
          return unlocked;
        case 'incomplete':
          return !unlocked;
        default:
          return true;
      }
    });

    if (filtered.length > 0) {
      acc[type] = filtered;
    }
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Thành tựu
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {unlockedIds.length}/{allAchievements.length} thành tựu đã hoàn thành
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(unlockedIds.length / allAchievements.length) * 100}%` }}
            ></div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'all'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
            >
              Tất cả ({allAchievements.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'completed'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
            >
              Đã hoàn thành ({unlockedIds.length})
            </button>
            <button
              onClick={() => setFilter('incomplete')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${filter === 'incomplete'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
            >
              Chưa hoàn thành ({allAchievements.length - unlockedIds.length})
            </button>
          </div>
        </div>

        {/* Achievement Groups */}
        <div className="space-y-8">
          {Object.entries(filteredGroupedAchievements).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {filter === 'completed' ? 'Chưa có thành tựu nào được hoàn thành' :
                  filter === 'incomplete' ? 'Tất cả thành tựu đã được hoàn thành!' :
                    'Không có thành tựu nào'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {filter === 'completed' ? 'Hãy tiếp tục nỗ lực để mở khóa thành tựu đầu tiên!' :
                  filter === 'incomplete' ? 'Chúc mừng bạn đã hoàn thành tất cả thành tựu!' :
                    'Thử thay đổi bộ lọc để xem thành tựu.'}
              </p>
            </div>
          ) : (
            Object.entries(filteredGroupedAchievements).map(([type, achievements]) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 ${getTypeColor(type)} rounded-lg`}>
                    {getAchievementIcon(type, true)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      {getTypeLabel(type)}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {achievements.filter(a => unlockedIds.includes(a.id)).length}/{achievements.length} hoàn thành
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => {
                    const unlocked = unlockedIds.includes(achievement.id);
                    const progress = getProgressValue(achievement);

                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${unlocked
                            ? `border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:border-emerald-700`
                            : `border-slate-200 bg-slate-50 dark:bg-slate-700/50 dark:border-slate-600`
                          }`}
                      >
                        {/* Lock Icon for Locked Achievements */}
                        {!unlocked && (
                          <div className="absolute top-3 right-3">
                            <Lock className="w-5 h-5 text-slate-400" />
                          </div>
                        )}

                        {/* Achievement Icon */}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${unlocked
                            ? `${getTypeColor(achievement.achievementType || "OTHER")} shadow-lg`
                            : `bg-slate-200 dark:bg-slate-600`
                          }`}>
                          {getAchievementIcon(achievement.achievementType || "OTHER", unlocked)}
                        </div>

                        {/* Achievement Info */}
                        <div className="space-y-2">
                          <h3 className={`font-semibold text-lg ${unlocked ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
                            }`}>
                            {achievement.name}
                          </h3>

                          <p className={`text-sm ${unlocked ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
                            }`}>
                            {achievement.description}
                          </p>

                          {/* Milestone Value */}
                          <div className="flex items-center gap-2 text-sm">
                            <Star className={`w-4 h-4 ${unlocked ? "text-yellow-500" : "text-slate-400"}`} />
                            <span className={unlocked ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}>
                              {achievement.milestoneValue ? `${achievement.milestoneValue}` : "Hoàn thành"}
                            </span>
                          </div>

                          {/* Completion Date */}
                          {unlocked && unlockedMap[achievement.id] && (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                              <Clock className="w-4 h-4" />
                              <span>
                                Đạt được: {new Date(unlockedMap[achievement.id]).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          )}

                          {/* Progress Bar for Locked Achievements */}
                          {!unlocked && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                                <span>Tiến độ</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Completion Badge */}
                        {unlocked && (
                          <div className="absolute -top-2 -right-2">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 