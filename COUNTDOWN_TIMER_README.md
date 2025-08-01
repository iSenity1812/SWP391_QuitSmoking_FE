# Countdown Timer System

## Tổng quan

Hệ thống Countdown Timer đã được thêm vào để hiển thị thời gian real-time cho các health metrics, tương tự như ứng dụng Smoke Free. Hệ thống này bao gồm:

### 🎯 Các Component Chính

#### 1. **HealthCountdownTimer**
- **Vị trí**: Trong mỗi HealthMetricCard
- **Chức năng**: Hiển thị countdown thời gian còn lại để đạt milestone
- **Format**: `3d 20h 45m 32s`
- **Màu sắc**: Thay đổi theo thời gian còn lại (red → orange → yellow → blue)

#### 2. **QuitTimeCountdown**
- **Vị trí**: Trong HealthOverviewCard
- **Chức năng**: Hiển thị thời gian đã bỏ thuốc (tăng dần)
- **Format**: `5 ngày 12 giờ 30 phút`
- **Màu sắc**: Thay đổi theo thời gian bỏ thuốc (yellow → orange → blue → green → purple)

#### 3. **HealthHeaderCountdown**
- **Vị trí**: Header của HealthTab
- **Chức năng**: Hiển thị tổng quan thời gian bỏ thuốc và milestone tiếp theo
- **Format**: `5d 12h 30m 45s`

### ⚡ Custom Hook: useCountdown

```typescript
const { remainingHours, formattedTime, isCompleted, reset } = useCountdown({
  initialHours: 72, // Thời gian ban đầu
  isCompleted: false, // Trạng thái hoàn thành
  updateInterval: 1000, // Cập nhật mỗi giây
  onComplete: () => console.log('Countdown completed!')
});
```

### 🎨 Tính năng Visual

#### **Color Coding**
- **Red**: < 1 giờ còn lại (urgent)
- **Orange**: < 1 ngày còn lại (warning)
- **Yellow**: < 1 tuần còn lại (attention)
- **Blue**: > 1 tuần còn lại (normal)

#### **Background Colors**
- Mỗi countdown có background color tương ứng với mức độ urgency
- Border radius và padding phù hợp với design system

### 🔧 Performance Optimizations

#### **useMemo & useCallback**
- Tối ưu hóa việc tính toán thời gian
- Tránh re-render không cần thiết

#### **Interval Management**
- Tự động cleanup timer khi component unmount
- Chỉ update khi cần thiết

#### **Battery Optimization**
- Update interval có thể điều chỉnh
- Pause khi tab không active (có thể implement thêm)

### 📱 Mobile Friendly

- **Touch-friendly**: Kích thước phù hợp cho mobile
- **Responsive**: Tự động điều chỉnh theo screen size
- **Font**: Sử dụng font-mono cho countdown để dễ đọc

### 🚀 Cách Sử Dụng

#### **Trong HealthMetricCard**
```tsx
<HealthCountdownTimer
  timeRemainingHours={metric.timeRemainingHours}
  isCompleted={metric.isCompleted}
  className="font-medium"
/>
```

#### **Trong HealthOverviewCard**
```tsx
<QuitTimeCountdown
  hoursSinceQuit={overview.hoursSinceQuit}
  className="font-semibold"
/>
```

#### **Trong HealthTab Header**
```tsx
<HealthHeaderCountdown
  hoursSinceQuit={overview.hoursSinceQuit}
  nextMilestone={overview.nextMilestone}
  className="mb-4"
/>
```

### 🔄 Auto-refresh Integration

- Countdown timer hoạt động song song với auto-refresh system
- Khi backend update data, countdown sẽ reset với giá trị mới
- Không bị conflict giữa real-time countdown và server data

### 🎉 Milestone Celebrations

Khi countdown đạt 0 (hoàn thành milestone):
- Hiển thị "Đã hoàn thành" với màu xanh
- Có thể thêm animation celebration (future enhancement)
- Tích hợp với achievement system

### 📊 Analytics

- Có thể track user engagement với countdown
- Monitor performance impact
- A/B testing với các format khác nhau

## Kết luận

Hệ thống Countdown Timer đã được implement một cách cẩn thận với:
- ✅ Performance optimization
- ✅ Mobile-friendly design
- ✅ Color coding theo urgency
- ✅ Integration với existing system
- ✅ Custom hook reusability
- ✅ Real-time updates

Tương tự Smoke Free, countdown timer sẽ tăng đáng kể user engagement và tạo cảm giác progress real-time! 