import axiosConfig from "@/config/axiosConfig";
import type { Notification, NotificationCreateRequest, UnreadCountResponse } from "../types/notification";

export const notificationService = {
  // Lấy tất cả notification của user
  getNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await axiosConfig.get<Notification[]>(`/notification/user/${userId}`);
    return response.data;
  },

  // Lấy notification chưa đọc
  getUnreadNotifications: async (userId: string): Promise<Notification[]> => {
    const response = await axiosConfig.get<Notification[]>(`/notification/user/${userId}/unread`);
    return response.data;
  },

  // Đánh dấu đã đọc
  markAsRead: async (notificationId: number): Promise<void> => {
    await axiosConfig.put(`/notification/mark-as-read/${notificationId}`);
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async (userId: string): Promise<void> => {
    await axiosConfig.put(`/notification/mark-all-as-read/${userId}`);
  },

  // Xóa notification
  deleteNotification: async (notificationId: number): Promise<void> => {
    await axiosConfig.delete(`/notification/${notificationId}`);
  },

  // Đếm notification chưa đọc
  getUnreadCount: async (userId: string): Promise<number> => {
    const response = await axiosConfig.get<UnreadCountResponse>(`/notification/user/${userId}/count`);
    return response.data.count;
  },

  // Tạo notification (cho admin/coach)
  createNotification: async (request: NotificationCreateRequest): Promise<Notification> => {
    const response = await axiosConfig.post<Notification>('/notification', request);
    return response.data;
  }
}; 