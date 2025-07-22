# Hướng dẫn sử dụng WebSocket trong Frontend

## Tổng quan

WebSocket đã được setup để nhận thông báo realtime từ backend, đặc biệt là:

- Thông báo thành tựu mới (Achievement notifications)
- Thông báo hệ thống general

## Cách sử dụng

### 1. Import và sử dụng Hook

```tsx
import { useWebSocket } from "@/hooks/useWebSocket";

function YourComponent() {
  const {
    connected,
    notifications,
    markNotificationAsRead,
    clearNotifications,
  } = useWebSocket();

  // connected: boolean - trạng thái kết nối
  // notifications: WebSocketNotification[] - danh sách thông báo
  // markNotificationAsRead: (index: number) => void - đánh dấu đã đọc
  // clearNotifications: () => void - xóa tất cả thông báo
}
```

### 2. Thêm vào Layout/Header

```tsx
// Trong Header component
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { WebSocketStatus } from "@/components/WebSocketStatus";

function Header() {
  return (
    <header>
      {/* Các component khác */}
      <WebSocketStatus /> {/* Hiển thị trạng thái kết nối */}
      <NotificationDropdown /> {/* Dropdown thông báo với badge */}
    </header>
  );
}
```

### 3. Thêm Achievement Toast Notification

```tsx
// Trong App.tsx hoặc Layout chính
import { AchievementNotificationToast } from "@/components/AchievementNotificationToast";

function App() {
  return (
    <div>
      {/* App content */}
      <AchievementNotificationToast /> {/* Toast notification cho achievement */}
    </div>
  );
}
```

## Cách Backend gửi thông báo

### 1. Thông báo thành tựu (từ AchievementService)

Backend đã setup trong `AchievementService.unlockAchievement()`:

```java
// Backend sẽ tự động gửi notification khi user unlock achievement
Notification notification = new Notification();
notification.setUserId(memberId);
notification.setTitle("Thành tựu mới!");
notification.setContent("Bạn đã đạt được thành tựu: " + achievement.getName());
notification.setType("ACHIEVEMENT");
notificationService.createNotification(notification);
```

### 2. Thông báo thường (sử dụng NotificationService)

```java
// Trong bất kỳ Service nào
@Autowired
private NotificationService notificationService;

public void sendNotificationToUser(UUID userId, String title, String content) {
    Notification notification = new Notification();
    notification.setUserId(userId);
    notification.setTitle(title);
    notification.setContent(content);
    notification.setType("GENERAL");
    notificationService.createNotification(notification);
}
```

## Endpoint WebSocket

- **WebSocket URL**: `http://localhost:8080/ws`
- **User Notifications**: `/user/{userId}/topic/notifications`
- **Achievement Notifications**: `/user/{userId}/topic/achievements`

## Tính năng

### ✅ Đã implemented:

- [x] Kết nối WebSocket tự động khi user login
- [x] Ngắt kết nối khi user logout
- [x] Nhận thông báo realtime
- [x] Browser notification (với permission)
- [x] Achievement toast notification
- [x] Notification dropdown với badge count
- [x] Mark as read functionality
- [x] Connection status indicator

### 🔄 Có thể mở rộng:

- [ ] Notification sound
- [ ] Notification persistence (lưu vào localStorage)
- [ ] Retry connection on failure
- [ ] Different notification types (warning, error, info)
- [ ] Notification history page

## Environment Variables cần thiết

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Testing

1. **Khởi động Backend** với WebSocket enabled
2. **Login** vào Frontend
3. **Trigger achievement** trong app (complete daily goal, etc.)
4. **Xem notification** xuất hiện:
   - Toast notification trên màn hình
   - Browser notification (nếu được phép)
   - Badge count trên notification icon
   - Dropdown list notification

## Troubleshooting

### WebSocket không kết nối được:

1. Kiểm tra Backend đã chạy chưa
2. Kiểm tra CORS configuration
3. Kiểm tra environment variable `VITE_API_BASE_URL`
4. Mở Developer Tools > Network để xem WebSocket connection

### Không nhận được notification:

1. Kiểm tra user đã login chưa
2. Kiểm tra Backend có call `notificationService.createNotification()` không
3. Kiểm tra userId đúng chưa
4. Xem Console log để debug

### Browser notification không hoạt động:

1. Kiểm tra browser permission
2. Gọi `requestNotificationPermission()` manually
3. Một số browser chặn notification trên localhost

## Example Usage trong component

```tsx
import { useWebSocket } from "@/hooks/useWebSocket";

function UserDashboard() {
  const { connected, notifications } = useWebSocket();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <h1>Dashboard</h1>
      {!connected && (
        <div className="alert alert-warning">
          Mất kết nối với server. Một số tính năng có thể không hoạt động.
        </div>
      )}

      {unreadCount > 0 && (
        <div className="alert alert-info">
          Bạn có {unreadCount} thông báo mới!
        </div>
      )}
    </div>
  );
}
```
