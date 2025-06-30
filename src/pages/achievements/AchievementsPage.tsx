import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { achievementService } from "@/services/achievementService";
import { Lock } from "lucide-react";
import type { Achievement } from "@/types/achievement";
import MedalIcon from '@/components/ui/medalIcon';

export default function AchievementsPage() {
  const { user } = useAuth();
  const memberId = user?.userId || "";
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [unlockedMap, setUnlockedMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);
    Promise.all([
      achievementService.getAllAchievements(),
      achievementService.getMemberAchievements(memberId),
    ]).then(([all, memberAch]) => {
      setAllAchievements(all);
      setUnlockedIds(memberAch.map((ma: any) => ma.achievementId));
      // Map achievementId -> unlockedAt
      const map: Record<number, string> = {};
      memberAch.forEach((ma: any) => {
        map[ma.achievementId] = ma.unlockedAt;
      });
      setUnlockedMap(map);
    }).finally(() => setLoading(false));
  }, [memberId]);

  if (loading) return <div>Đang tải thành tựu...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Tất cả thành tựu</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {allAchievements.map((ach) => {
          const unlocked = unlockedIds.includes(ach.achievementId);
          return (
            <div
              key={ach.achievementId}
              className={`relative flex flex-col items-center p-3 rounded-lg border shadow transition-all duration-200
                ${unlocked ? "bg-white" : "bg-gray-100 opacity-60 grayscale"}`}
            >
              {ach.iconUrl ? (
                <img
                  src={ach.iconUrl}
                  alt={ach.name}
                  className={`w-14 h-14 mb-2 ${unlocked ? "" : "opacity-40 grayscale"}`}
                />
              ) : (
                <MedalIcon size={56} locked={!unlocked} />
              )}
              <div className="font-semibold text-center text-sm">{ach.name}</div>
              <div className="text-xs text-gray-500 text-center mb-1">{ach.description}</div>
              {unlocked && unlockedMap[ach.achievementId] && (
                <div className="text-xs text-green-600">Đạt: {new Date(unlockedMap[ach.achievementId]).toLocaleDateString()}</div>
              )}
              {!unlocked && (
                <span className="absolute top-2 right-2 text-xl text-gray-400 bg-white rounded-full p-1"><Lock size={18} /></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 