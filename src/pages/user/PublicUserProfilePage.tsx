import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { achievementService } from "@/services/achievementService";
import { userService } from "@/services/userService";
import type { AchievementWithStatus } from "@/types/achievement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import axiosConfig from "@/config/axiosConfig";

interface UserProfile {
  userId: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt?: string;
}

export default function PublicUserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [progress, setProgress] = useState<{ daysQuit: number; moneySaved: number; cigarettesNotSmoked: number }>({ daysQuit: 0, moneySaved: 0, cigarettesNotSmoked: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      userService.getPublicProfile(userId),
      achievementService.getAllAchievementsForUser(userId),
      achievementService.getMemberProgress(userId),
    ])
      .then(([profileRes, achievementsRes, progressRes]) => {
        setProfile(profileRes.data);
        setAchievements(achievementsRes);
        setProgress(progressRes);
      })
      .catch(() => setError("Không thể tải thông tin người dùng."))
      .finally(() => setLoading(false));
  }, [userId]);

  // Kiểm tra đã follow chưa
  useEffect(() => {
    if (!userId || !currentUser || userId === currentUser.userId) return;
    axiosConfig.get(`/api/follow/is-following/${userId}`, { headers: { 'X-User-Id': currentUser.userId } })
      .then(res => setIsFollowing(res.data))
      .catch(() => setIsFollowing(false));
  }, [userId, currentUser]);

  const handleFollow = async () => {
    if (!currentUser) return;
    setFollowLoading(true);
    await axiosConfig.post(`/api/follow/${userId}`, null, { headers: { 'X-User-Id': currentUser.userId } });
    setIsFollowing(true);
    setFollowLoading(false);
  };

  const handleUnfollow = async () => {
    if (!currentUser) return;
    setFollowLoading(true);
    await axiosConfig.delete(`/api/follow/${userId}`, { headers: { 'X-User-Id': currentUser.userId } });
    setIsFollowing(false);
    setFollowLoading(false);
  };

  if (loading) return <div className="p-8 text-center">Đang tải thông tin...</div>;
  if (error || !profile) return <div className="p-8 text-center text-red-500">{error || "Không tìm thấy người dùng."}</div>;

  const isCurrentUser = currentUser && currentUser.userId === userId;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-10">
      <Card className="w-full max-w-2xl mb-8">
        <CardHeader className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-2 text-5xl">
            👤
          </div>
          <CardTitle className="text-2xl font-bold">{profile.username}</CardTitle>
          <div className="text-slate-500 dark:text-slate-300">{profile.email}</div>
          {profile.createdAt && <div className="text-xs text-slate-400 mt-1">Tham gia: {new Date(profile.createdAt).toLocaleDateString()}</div>}
          {/* Nút Theo dõi/Bỏ theo dõi */}
          {!isCurrentUser && currentUser && (
            isFollowing ? (
              <button
                onClick={handleUnfollow}
                disabled={followLoading}
                className="mt-3 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Đang theo dõi
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
              >
                Theo dõi
              </button>
            )
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
            <div>
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{progress.daysQuit}</div>
              <div className="text-xs text-slate-500">Ngày không hút thuốc</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">{progress.moneySaved.toLocaleString('vi-VN')}₫</div>
              <div className="text-xs text-slate-500">Tiền tiết kiệm</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{progress.cigarettesNotSmoked}</div>
              <div className="text-xs text-slate-500">Điếu thuốc tránh được</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Thành tựu đã đạt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.length === 0 && <div className="col-span-4 text-center text-slate-400">Chưa có thành tựu nào.</div>}
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex flex-col items-center p-2 border rounded-lg shadow transition-all
                  ${ach.completed ? 'bg-green-100 dark:bg-green-900 border-green-400' : 'bg-slate-800 border-slate-700'}
                `}
              >
                {ach.completed ? (
                  <CheckCircle2 className="text-green-500 w-8 h-8 mb-1" />
                ) : (
                  <span className="text-3xl mb-1">🏆</span>
                )}
                <div className="font-semibold text-sm text-center">{ach.name}</div>
                <div className="text-xs text-slate-400 text-center">{ach.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 