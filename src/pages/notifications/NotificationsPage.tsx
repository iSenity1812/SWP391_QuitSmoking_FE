import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '../../components/ui/NotificationItem';
import { Check, Bell } from 'lucide-react';
import { useState } from 'react';

export const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
    deleteNotification,
    refetch
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-emerald-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Thông báo
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {notifications.length} thông báo • {unreadCount} chưa đọc
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                <option value="all">Tất cả</option>
                <option value="unread">Chưa đọc</option>
              </select>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo nào'}
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                {filter === 'unread'
                  ? 'Tất cả thông báo đã được đọc'
                  : 'Bạn sẽ thấy thông báo mới ở đây'
                }
              </p>
            </div>
          ) : (
            [...filteredNotifications]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notification) => (
                <NotificationItem
                  key={notification.notificationId}
                  notification={notification}
                  onDelete={deleteNotification}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}; 