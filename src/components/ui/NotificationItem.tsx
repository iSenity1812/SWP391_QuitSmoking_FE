import type { Notification } from '../../types/notification';
import { useNotifications } from '@/hooks/useNotifications';
import { Trash2, Clock } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onDelete: (notificationId: number) => void;
}

export const NotificationItem = ({ notification, onDelete }: NotificationItemProps) => {
  const { markAsRead } = useNotifications();

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.notificationId);
  };

  const getNotificationIcon = () => {
    switch (notification.notificationType) {
      case 'ACHIEVEMENT':
        return '🏆';
      case 'APPOINTMENT':
        return '📅';
      case 'SYSTEM':
        return '🔔';
      default:
        return '📢';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-b border-slate-100 dark:border-slate-600 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
        !notification.isRead ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getNotificationIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-semibold text-sm ${
              !notification.isRead 
                ? 'text-slate-800 dark:text-white' 
                : 'text-slate-600 dark:text-slate-300'
            }`}>
              {notification.title}
            </h4>
            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            {notification.content}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">
              {formatTime(notification.createdAt)}
            </span>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 