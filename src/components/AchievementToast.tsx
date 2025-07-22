import React, { useEffect, useState } from 'react';
import type { AchievementNotification } from '../hooks/useWebSocket';

interface AchievementToastProps {
  className?: string; // Component tự lắng nghe global event
}

interface ToastData {
  id: string;
  achievement: AchievementNotification;
  show: boolean;
}

export const AchievementToast: React.FC<AchievementToastProps> = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    console.log('[AchievementToast] Component mounted, setting up event listener');

    const handleAchievementUnlocked = (event: CustomEvent) => {
      console.log('[AchievementToast] Received achievement-unlocked event:', event.detail);
      const { achievement } = event.detail;
      const toastId = `achievement-${achievement.achievementId}-${Date.now()}`;

      const newToast: ToastData = {
        id: toastId,
        achievement,
        show: true
      };

      console.log('[AchievementToast] Creating new toast:', newToast);
      setToasts(prev => {
        const updated = [...prev, newToast];
        console.log('[AchievementToast] Updated toasts state:', updated);
        return updated;
      });

      // Auto remove toast after 5 seconds
      setTimeout(() => {
        console.log('[AchievementToast] Auto-removing toast:', toastId);
        setToasts(prev => prev.filter(toast => toast.id !== toastId));
      }, 5000);
    };

    window.addEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    console.log('[AchievementToast] Event listener registered for achievement-unlocked');

    return () => {
      console.log('[AchievementToast] Removing event listener');
      window.removeEventListener('achievement-unlocked', handleAchievementUnlocked as EventListener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            bg-gradient-to-r from-yellow-400 to-orange-500 
            text-white p-4 rounded-lg shadow-lg 
            transform transition-all duration-300 ease-in-out
            ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            max-w-sm min-w-[320px]
          `}
        >
          <div className="flex items-start space-x-3">
            {/* Achievement Icon */}
            <div className="flex-shrink-0">
              {toast.achievement.achievementIcon ? (
                <img
                  src={toast.achievement.achievementIcon}
                  alt="Achievement Icon"
                  className="w-12 h-12 rounded-full bg-white p-1"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
              )}
            </div>

            {/* Achievement Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-lg">
                  🎉 {toast.achievement.title}
                </h3>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-white/80 hover:text-white text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <p className="font-semibold text-yellow-100 mb-1">
                {toast.achievement.achievementName}
              </p>

              <p className="text-sm text-yellow-50 opacity-90">
                {toast.achievement.achievementDescription}
              </p>

              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {toast.achievement.achievementType}
                </span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {toast.achievement.milestoneValue}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar animation */}
          <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{
                animation: 'shrinkProgress 5s linear forwards'
              }}
            />
          </div>
        </div>
      ))}

      {/* CSS Animation */}
      <style>{`
        @keyframes shrinkProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default AchievementToast;
