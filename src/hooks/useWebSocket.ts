import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './useAuth';

export interface WebSocketNotification {
  id?: number;
  userId: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  isRead: boolean;
}

export interface AchievementNotification {
  type: 'ACHIEVEMENT';
  title: string;
  message: string;
  achievementId: number;
  achievementName: string;
  achievementDescription: string;
  achievementIcon: string;
  achievementType: string;
  milestoneValue: number;
  timestamp: string;
}

export function useWebSocket() {
  const { user } = useAuth();
  const stompClient = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<WebSocketNotification[]>([]);
  const [achievementNotifications, setAchievementNotifications] = useState<AchievementNotification[]>([]);

  const connect = () => {
    if (!user?.userId) return;

    // Tạo kết nối WebSocket
    const socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('[WebSocket Debug]:', str);
      },
      onConnect: () => {
        console.log('WebSocket connected');
        setConnected(true);

        // Subscribe to user-specific notifications
        client.subscribe(`/user/${user.userId}/topic/notifications`, (message) => {
          try {
            const notification: WebSocketNotification = JSON.parse(message.body);
            console.log('Received notification:', notification);

            // Thêm notification mới vào danh sách
            setNotifications(prev => [notification, ...prev]);

            // Hiển thị browser notification với tùy chỉnh cho achievement
            if ('Notification' in window && Notification.permission === 'granted') {
              const title = notification.type === 'ACHIEVEMENT' ? '🏆 ' + notification.title : notification.title;
              new Notification(title, {
                body: notification.content,
                icon: '/vite.svg' // Có thể thay đổi icon
              });
            }
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        });

        // Subscribe to achievement notifications
        client.subscribe(`/user/${user.userId}/topic/achievements`, (message) => {
          try {
            console.log('[WebSocket] Raw achievement message received:', message.body);
            const achievementData: AchievementNotification = JSON.parse(message.body);
            console.log('[WebSocket] Parsed achievement notification:', achievementData);

            // Lưu achievement notification vào state để có thể sử dụng cho toast
            setAchievementNotifications(prev => [achievementData, ...prev]);

            // Tạo notification cho achievement
            const notification: WebSocketNotification = {
              userId: user.userId,
              title: 'Thành tựu mới! 🏆',
              content: achievementData.message,
              type: 'ACHIEVEMENT',
              createdAt: new Date().toISOString(),
              isRead: false
            };

            setNotifications(prev => [notification, ...prev]);

            // Achievement notification với style đặc biệt
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🏆 Thành tựu mới!', {
                body: achievementData.message,
                icon: achievementData.achievementIcon || '/vite.svg',
                badge: achievementData.achievementIcon || '/vite.svg'
              });
            }

            // Trigger custom event để các component khác có thể lắng nghe và hiển thị toast
            console.log('[WebSocket] Dispatching achievement-unlocked event:', achievementData);
            const customEvent = new CustomEvent('achievement-unlocked', {
              detail: {
                achievement: achievementData,
                notification: notification
              }
            });
            window.dispatchEvent(customEvent);
            console.log('[WebSocket] Achievement-unlocked event dispatched successfully');

          } catch (error) {
            console.error('[WebSocket] Error parsing achievement notification:', error);
          }
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setConnected(false);
      },
      onStompError: (error) => {
        console.error('WebSocket STOMP error:', error);
        setConnected(false);
      }
    });

    stompClient.current = client;
    client.activate();
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      stompClient.current = null;
      setConnected(false);
    }
  };

  const sendMessage = (destination: string, message: unknown) => {
    if (stompClient.current && connected) {
      stompClient.current.publish({
        destination,
        body: JSON.stringify(message)
      });
    }
  };

  const markNotificationAsRead = (index: number) => {
    setNotifications(prev =>
      prev.map((notif, i) =>
        i === index ? { ...notif, isRead: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  useEffect(() => {
    if (user?.userId) {
      connect();
      requestNotificationPermission();
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  return {
    connected,
    notifications,
    achievementNotifications,
    markNotificationAsRead,
    clearNotifications,
    sendMessage,
    requestNotificationPermission
  };
}
