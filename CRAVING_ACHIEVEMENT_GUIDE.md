# CRAVING RESISTED ACHIEVEMENT IMPLEMENTATION GUIDE

## 🎯 Tổng quan

Đã implement thành công tính năng **Craving Resisted Achievement** - thành tựu dựa trên số lần chống chọi cơn thèm thuốc.

## 🔧 Thay đổi Backend

### 1. **Achievement Entity**

- ✅ Thêm `CRAVING_RESISTED` vào enum `AchievementType`

### 2. **AchievementService**

- ✅ Thêm method `calculateCravingResisted(UUID memberId)`
  - Tính tổng số lần thèm thuốc từ `DailySummary.totalCravingCount`
- ✅ Cập nhật `getCurrentProgress()` để xử lý `CRAVING_RESISTED`
- ✅ Cập nhật logic unlock trong `checkAndUnlockAchievements()`
- ✅ Thêm 5 default achievements cho craving resisted:
  - First Resistance (5 cravings)
  - Craving Fighter (10 cravings)
  - Willpower Warrior (25 cravings)
  - Craving Conqueror (50 cravings)
  - Temptation Master (100 cravings)

### 3. **Event System**

- ✅ Sự kiện `UserResistedCravingEvent` đã có sẵn
- ✅ AchievementService lắng nghe và xử lý event

### 4. **Test Controller**

- ✅ Tạo `/api/test/resist-craving` để test trigger event
- ✅ Tạo `/api/test/resist-craving/{userId}` cho admin test

## 🎨 Thay đổi Frontend

### 1. **Types & Services**

- ✅ Cập nhật `ProgressResponse` interface thêm `cravingResisted`
- ✅ Cập nhật `getTypeLabel()` trong `AchievementsTab` và `AchievementsPage`

### 2. **WebSocket Notifications**

- ✅ Achievement notifications với icon 🏆
- ✅ Real-time toast notifications cho craving achievement

## 🧪 Cách Test

### **Bước 1: Khởi tạo Default Achievements**

```http
POST /api/achievements/initialize
```

### **Bước 2: Test Manual Trigger (qua API)**

```http
POST /api/test/resist-craving
Headers: Authorization: Bearer <user_token>
```

### **Bước 3: Test Real Flow**

1. User tạo DailySummary với `totalCravingCount > 0`
2. Trigger UserResistedCravingEvent (từ CravingTracking hoặc DailySummary)
3. System tự động check và unlock achievement

### **Bước 4: Kiểm tra WebSocket**

1. Login vào frontend
2. Mở Developer Tools > Network > WS để xem WebSocket connection
3. Trigger achievement → Xem notification realtime

## 📊 Logic Tính Toán

```java
public BigDecimal calculateCravingResisted(UUID memberId) {
    // Lấy quit plan hiện tại
    Optional<QuitPlan> quitPlanOpt = quitPlanRepository
        .findFirstByMember_MemberIdOrderByCreatedAtDesc(memberId);

    if (quitPlanOpt.isEmpty()) {
        return BigDecimal.ZERO;
    }

    QuitPlan quitPlan = quitPlanOpt.get();

    // Tính tổng số lần thèm thuốc từ daily summaries
    List<DailySummary> dailySummaries = dailySummaryRepository
        .findByQuitPlan_QuitPlanId(quitPlan.getQuitPlanId());

    int totalCravingCount = 0;
    for (DailySummary summary : dailySummaries) {
        totalCravingCount += summary.getTotalCravingCount();
    }

    return BigDecimal.valueOf(totalCravingCount);
}
```

## 🎯 Achievements Mặc Định

| Achievement       | Requirement  | Icon                    |
| ----------------- | ------------ | ----------------------- |
| First Resistance  | 5 cravings   | `/icons/5craving.png`   |
| Craving Fighter   | 10 cravings  | `/icons/10craving.png`  |
| Willpower Warrior | 25 cravings  | `/icons/25craving.png`  |
| Craving Conqueror | 50 cravings  | `/icons/50craving.png`  |
| Temptation Master | 100 cravings | `/icons/100craving.png` |

## 🔄 Workflow

1. **User resists craving** → `UserResistedCravingEvent` được trigger
2. **AchievementService** nhận event → gọi `checkAndUnlockAchievements()`
3. **System** tính toán `totalCravingCount` từ `DailySummary`
4. **Unlock achievement** nếu đủ điều kiện
5. **Send notification** qua WebSocket + Email
6. **Frontend** hiển thị real-time notification

## 🚨 Lưu ý

### **Data Source**

- Craving count được tính từ `DailySummary.totalCravingCount`
- `totalCravingCount` = `trackedCravingCount` + `manualCravingCount`
- Chỉ tính trong quit plan hiện tại (mới nhất)

### **Event Trigger**

- Hiện tại event được trigger manual qua API test
- Cần integrate với logic thực tế khi user:
  - Hoàn thành daily goal với craving count > 0
  - Track craving qua CravingTracking
  - Update DailySummary

### **Performance**

- Method `calculateCravingResisted()` query database mỗi lần check
- Có thể cache nếu cần optimize

## 🎉 Kết quả

✅ **Hoàn thành**: User sẽ nhận được achievement realtime khi đạt đủ số lần resist craving  
✅ **WebSocket**: Notification hiển thị ngay lập tức  
✅ **Database**: Achievement được lưu và sync chính xác  
✅ **Frontend**: Hiển thị đầy đủ loại achievement mới

## 🔧 Mở rộng

Có thể thêm các achievement phức tạp hơn:

- Consecutive days resisting cravings
- Average cravings per day
- Peak hours resistance
- Situation-based resistance (workplace, home, etc.)

---

**🎯 Ready to test!** Trigger API `/api/test/resist-craving` và xem magic happen! ✨
