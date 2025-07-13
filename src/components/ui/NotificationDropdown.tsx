import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '../../components/ui/NotificationItem';
import { Check, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  const { notifications, unreadCount, markAllAsRead, deleteNotification } = useNotifications();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-emerald-100 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200 min-w-[320px] max-w-[400px]">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-b border-emerald-200 dark:border-slate-600">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white">Thông báo</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Check className="w-3 h-3" />
                Đánh dấu đã đọc
              </button>
            )}
            <Link
              to="/notifications"
              onClick={onClose}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          [...notifications]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                onDelete={deleteNotification}
              />
            ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
          <Link
            to="/notifications"
            onClick={onClose}
            className="block text-center text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Xem {notifications.length - 5} thông báo khác
          </Link>
        </div>
      )}
    </div>
  );
}; 