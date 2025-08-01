# Health Countdown Components Update

## Overview
Đã cập nhật các component health countdown để sử dụng cùng logic và style với `CountdownTimer` trong quit_plan, tạo ra trải nghiệm nhất quán và real-time cho người dùng.

## Components Updated

### 1. HealthCountdownTimer.tsx
**File:** `FE/src/components/health/HealthCountdownTimer.tsx`

**Thay đổi chính:**
- Loại bỏ dependency vào `useCountdown` hook
- Sử dụng logic tương tự như `CountdownTimer` trong quit_plan
- Hiển thị thời gian theo format: Ngày, Giờ, Phút, Giây
- Sử dụng `useState` và `useEffect` với `setInterval(1000)` để cập nhật real-time
- Thêm animation với Framer Motion

**Logic mới:**
```typescript
const calculateTime = () => {
  const now = new Date();
  const totalRemainingSeconds = Math.max(0, timeRemainingHours * 3600 - (now.getTime() - Date.now()) / 1000);
  
  const days = Math.floor(totalRemainingSeconds / (3600 * 24));
  const hours = Math.floor((totalRemainingSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalRemainingSeconds % 3600) / 60);
  const seconds = Math.floor(totalRemainingSeconds % 60);

  setTimeLeft({ days, hours, minutes, seconds });
};
```

### 2. QuitTimeCountdown.tsx
**File:** `FE/src/components/health/QuitTimeCountdown.tsx`

**Thay đổi chính:**
- Chuyển từ đếm ngược sang đếm lên (count-up) để hiển thị thời gian đã bỏ thuốc
- Sử dụng cùng logic real-time với `CountdownTimer`
- Hiển thị format: Ngày, Giờ, Phút, Giây
- Thêm animation và styling nhất quán

**Logic mới:**
```typescript
const calculateTime = () => {
  const now = new Date();
  const totalElapsedSeconds = hoursSinceQuit * 3600 + (now.getTime() - Date.now()) / 1000;
  
  const days = Math.floor(totalElapsedSeconds / (3600 * 24));
  const hours = Math.floor((totalElapsedSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalElapsedSeconds % 3600) / 60);
  const seconds = Math.floor(totalElapsedSeconds % 60);

  setTimeElapsed({ days, hours, minutes, seconds });
};
```

### 3. HealthHeaderCountdown.tsx
**File:** `FE/src/components/health/HealthHeaderCountdown.tsx`

**Thay đổi chính:**
- Cập nhật layout để hiển thị thời gian bỏ thuốc nổi bật
- Sử dụng cùng logic real-time với các component khác
- Thêm thông tin về milestone tiếp theo
- Styling phù hợp với header gradient

## Key Features

### Real-time Updates
- Tất cả component đều cập nhật mỗi giây
- Sử dụng `setInterval(1000)` để đảm bảo độ chính xác
- Cleanup timer khi component unmount

### Consistent Styling
- Sử dụng cùng color scheme với quit_plan
- Gradient backgrounds và animations
- Responsive design cho mobile và desktop

### Performance Optimized
- Sử dụng `useState` và `useEffect` thay vì custom hook
- Minimal re-renders với proper dependencies
- Efficient time calculations

## Usage Examples

### HealthCountdownTimer
```typescript
<HealthCountdownTimer
  timeRemainingHours={48} // 48 giờ còn lại
  isCompleted={false}
  className="font-medium"
/>
```

### QuitTimeCountdown
```typescript
<QuitTimeCountdown
  hoursSinceQuit={72} // 72 giờ đã bỏ thuốc
  className="font-semibold"
/>
```

### HealthHeaderCountdown
```typescript
<HealthHeaderCountdown
  hoursSinceQuit={72}
  nextMilestone="1 tuần"
  className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6"
/>
```

## Benefits

1. **Consistency**: Tất cả countdown timer đều có cùng look và feel
2. **Real-time**: Cập nhật liên tục mỗi giây
3. **User Experience**: Trải nghiệm mượt mà với animations
4. **Maintainability**: Code dễ bảo trì và mở rộng
5. **Performance**: Tối ưu hóa re-renders và memory usage

## Technical Notes

- Sử dụng `Date.now()` để lấy timestamp hiện tại
- Tính toán thời gian dựa trên milliseconds để đảm bảo độ chính xác
- Cleanup timers để tránh memory leaks
- Responsive design với Tailwind CSS
- Animation với Framer Motion cho smooth transitions 