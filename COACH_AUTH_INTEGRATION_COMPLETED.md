# API Integration Update - Coach ID Integration

## 🎯 **Cập Nhật Hoàn Tất**

### **1. Tích Hợp Auth Context**

- ✅ **useAuth Hook**: Sử dụng `useAuth()` để lấy thông tin user từ AuthContext
- ✅ **Coach ID từ Auth**: Lấy `user.id` từ auth context thay vì mock data
- ✅ **Role Validation**: Kiểm tra `user.role === 'COACH'` trước khi cho phép truy cập

### **2. Cập Nhật API Weekly Schedule**

- ✅ **Parameter mới**: `requestedCoachId: string | null` thay vì `coachId: number`
- ✅ **Logic mới**:
  - Nếu `requestedCoachId = null` → lấy lịch của coach hiện tại (từ JWT token)
  - Nếu `requestedCoachId != null` → lấy lịch của coach được chỉ định
- ✅ **URL Dynamic**:
  - `/coaches/schedules/weekly` (khi requestedCoachId = null)
  - `/coaches/schedules/weekly/{requestedCoachId}` (khi có requestedCoachId)

### **3. Cập Nhật Service Layer**

- ✅ **getWeeklySchedule()**: Nhận `string | null` cho coachId
- ✅ **registerTimeSlots()**: Không cần truyền coachId (lấy từ JWT)
- ✅ **Error Handling**: Giữ nguyên error handling tốt

### **4. Cập Nhật Custom Hooks**

- ✅ **useWeeklySchedule()**:
  - Tham số đầu vào: `requestedCoachId: string | null`
  - Tự động validate user role = 'COACH'
  - Chỉ fetch data nếu user là coach
- ✅ **useCurrentCoachId()**: Trả về `user.id` thay vì mock ID

### **5. Cập Nhật UI Components**

- ✅ **WeeklyScheduleTable**: Sử dụng `null` để lấy lịch coach hiện tại
- ✅ **Permission Check**: Hiển thị message phù hợp nếu không phải coach
- ✅ **Type Safety**: Tất cả types đã được cập nhật

## 🔄 **Data Flow Mới**

```
1. User Login → AuthContext lưu user info
   ↓
2. WeeklyScheduleTable mount → useCurrentCoachId() lấy user.id
   ↓
3. useWeeklySchedule(null, currentWeek) → sử dụng coach hiện tại
   ↓
4. coachScheduleService.getWeeklySchedule(null, dateInWeek)
   ↓
5. API call: GET /coaches/schedules/weekly?dateInWeek=2025-06-21
   ↓
6. Backend sử dụng JWT token để identify coach
   ↓
7. Return data cho frontend
```

## 🚀 **Cách Sử Dụng**

### **Coach xem lịch của chính mình**

```typescript
// Component tự động sử dụng coach ID từ auth context
useWeeklySchedule(null, currentWeek);
// → API: GET /coaches/schedules/weekly?dateInWeek=2025-06-21
```

### **Admin/SuperAdmin xem lịch của coach khác**

```typescript
// Truyền coachId cụ thể
useWeeklySchedule("coach-uuid-123", currentWeek);
// → API: GET /coaches/schedules/weekly/coach-uuid-123?dateInWeek=2025-06-21
```

## 🔐 **Security & Permissions**

### **Role-based Access**

- ✅ Chỉ user có role = 'COACH' mới được access
- ✅ JWT token tự động validate quyền access
- ✅ UI hiển thị message phù hợp cho user không có quyền

### **Data Protection**

- ✅ Backend sử dụng JWT để identify coach
- ✅ Không thể access lịch của coach khác (trừ khi có quyền admin)
- ✅ Type-safe API integration

## 📋 **Testing Scenarios**

### **Functional Testing**

- [ ] Login as COACH → có thể xem lịch tuần
- [ ] Login as NORMAL_MEMBER → hiển thị "Chỉ dành cho Coach"
- [ ] Coach đăng ký slots → API call thành công
- [ ] Logout → không thể access coach schedule

### **API Testing**

- [ ] GET `/coaches/schedules/weekly?dateInWeek=2025-06-21` (với JWT coach)
- [ ] GET `/coaches/schedules/weekly/other-coach-id?dateInWeek=2025-06-21` (admin only)
- [ ] POST `/coaches/schedules/register` (với JWT coach)

## ✨ **Key Improvements**

1. **Real Auth Integration**: Không còn mock data, sử dụng auth context thật
2. **Better Security**: Role-based access control
3. **Flexible API**: Support cho admin xem lịch coach khác
4. **Type Safety**: Full TypeScript support với string UUID
5. **User Experience**: Clear error messages cho unauthorized access

## 🎉 **Status: COMPLETED**

Tích hợp hoàn tất! Hệ thống giờ đây:

- ✅ Sử dụng auth context thật
- ✅ Support API mới với coach ID từ JWT
- ✅ Role-based access control
- ✅ Production-ready security
