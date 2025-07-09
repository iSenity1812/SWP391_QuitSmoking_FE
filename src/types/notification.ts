export interface Notification {
  notificationId: number;
  title: string;
  content: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
  fromUserId?: string;
  userId: string;
}

export interface NotificationResponse {
  data: Notification[];
  total: number;
  unreadCount: number;
}

export interface NotificationCreateRequest {
  notification: {
    title: string;
    content: string;
    notificationType: string;
    userId: string;
    fromUserId?: string;
  };
  fcmToken?: string;
}

export interface UnreadCountResponse {
  count: number;
} 