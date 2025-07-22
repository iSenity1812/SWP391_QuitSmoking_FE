import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Award, X } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
}

interface AchievementNotificationData {
  achievement: Achievement;
  message?: string;
}

export function AchievementNotificationToast() {
  const { notifications } = useWebSocket();
  const [achievementNotification, setAchievementNotification] = useState<AchievementNotificationData | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Lắng nghe notification achievement từ WebSocket
    const achievementNotif = notifications.find(n => n.type === 'ACHIEVEMENT' && !n.isRead);

    if (achievementNotif && !show) {
      // Parse achievement data từ content
      try {
        const achievementData: AchievementNotificationData = {
          achievement: {
            id: Date.now(), // Temporary ID
            name: achievementNotif.content.replace('Bạn đã đạt được thành tựu: ', ''),
            description: 'Chúc mừng bạn đã hoàn thành thành tựu này!',
          }
        };

        setAchievementNotification(achievementData);
        setShow(true);

        // Auto hide after 5 seconds
        setTimeout(() => {
          setShow(false);
        }, 5000);
      } catch (error) {
        console.error('Error parsing achievement notification:', error);
      }
    }
  }, [notifications, show]);

  const handleClose = () => {
    setShow(false);
    setAchievementNotification(null);
  };

  const handleViewAchievements = () => {
    handleClose();
    // Navigate to achievements page
    window.location.href = '/achievements';
  };

  if (!show || !achievementNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-3">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Thành tựu mới! 🎉
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Chúc mừng bạn!
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg p-4 mb-4 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-400">
              {achievementNotification.achievement.name}
            </h4>
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {achievementNotification.achievement.description}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleViewAchievements}
            size="sm"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            <Award className="h-4 w-4 mr-2" />
            Xem thành tựu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
