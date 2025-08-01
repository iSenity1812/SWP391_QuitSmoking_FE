# Health Countdown Dynamic Fix

## Vấn đề đã được sửa

### 🔧 **Vấn đề ban đầu:**
- Thời gian bị đứng lại, không chạy động
- Logic tính toán thời gian có lỗi trong việc sử dụng `Date.now()`

### ✅ **Giải pháp đã áp dụng:**

#### 1. **Sử dụng `useRef` để lưu trữ thời gian bắt đầu**
```typescript
const startTimeRef = useRef<number>(Date.now());
const initialHoursRef = useRef<number | null>(timeRemainingHours);
```

#### 2. **Reset thời gian bắt đầu khi props thay đổi**
```typescript
useEffect(() => {
  // Reset start time when props change
  startTimeRef.current = Date.now();
  initialHoursRef.current = timeRemainingHours;
}, [timeRemainingHours]);
```

#### 3. **Logic tính toán thời gian chính xác**
```typescript
const calculateTime = () => {
  const now = Date.now();
  const elapsedSeconds = (now - startTimeRef.current) / 1000;
  const totalRemainingSeconds = Math.max(0, (initialHoursRef.current || 0) * 3600 - elapsedSeconds);
  
  // Tính toán ngày, giờ, phút, giây
  const days = Math.floor(totalRemainingSeconds / (3600 * 24));
  const hours = Math.floor((totalRemainingSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalRemainingSeconds % 3600) / 60);
  const seconds = Math.floor(totalRemainingSeconds % 60);

  setTimeLeft({ days, hours, minutes, seconds });
};
```

## Components đã được sửa

### 1. **HealthCountdownTimer.tsx**
- **Chức năng:** Đếm ngược thời gian còn lại cho health metrics
- **Logic:** `totalRemainingSeconds = initialHours * 3600 - elapsedSeconds`

### 2. **QuitTimeCountdown.tsx**
- **Chức năng:** Đếm lên thời gian đã bỏ thuốc
- **Logic:** `totalElapsedSeconds = initialHours * 3600 + elapsedSeconds`

### 3. **HealthHeaderCountdown.tsx**
- **Chức năng:** Hiển thị thời gian bỏ thuốc trong header
- **Logic:** Tương tự QuitTimeCountdown (đếm lên)

## Cách hoạt động

### **Real-time Updates:**
1. **Khởi tạo:** Lưu thời gian bắt đầu vào `startTimeRef`
2. **Cập nhật:** Mỗi giây tính toán thời gian đã trôi qua
3. **Hiển thị:** Cập nhật state với thời gian mới
4. **Cleanup:** Xóa timer khi component unmount

### **Tính toán chính xác:**
- Sử dụng `Date.now()` để lấy timestamp hiện tại
- Tính `elapsedSeconds = (now - startTime) / 1000`
- Áp dụng logic đếm ngược hoặc đếm lên tùy theo component

## Kết quả

✅ **Thời gian chạy động mỗi giây**
✅ **Hiển thị chính xác: Ngày, Giờ, Phút, Giây**
✅ **Animation mượt mà với Framer Motion**
✅ **Performance tối ưu với useRef**
✅ **Cleanup timer để tránh memory leaks**

## Test

Để test xem có hoạt động đúng không:
1. Mở health tab
2. Quan sát thời gian trong header và các metric
3. Thời gian sẽ cập nhật mỗi giây
4. Kiểm tra console để xem có lỗi gì không

## Lưu ý kỹ thuật

- **useRef vs useState:** Sử dụng useRef để lưu giá trị không cần re-render
- **Dependencies:** Chỉ reset khi props thay đổi, không reset mỗi lần render
- **Performance:** Tính toán thời gian hiệu quả với milliseconds
- **Accuracy:** Đảm bảo độ chính xác với `Date.now()` 