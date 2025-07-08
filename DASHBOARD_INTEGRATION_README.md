# Dashboard Revenue API Integration

## 📋 Tổng quan

Tích hợp API doanh thu theo tháng vào AdminDashboard component, thay thế mock data bằng real data từ backend. **Hiển thị 6 tháng gần nhất (bao gồm tháng hiện tại)**.

## 🔧 Các files đã được tạo/cập nhật

### 1. Services

- `src/services/api/dashboardService.ts` - Service để call API dashboard
- `src/types/dashboard.ts` - Type definitions cho API responses
- `src/utils/chartUtils.ts` - Utilities để transform data và format

### 2. Components

- `src/pages/admin/component/AdminDashBoard.tsx` - Updated để sử dụng real API

### 3. Testing

- `src/utils/testDashboardIntegration.ts` - Test utilities

## 🚀 Cách sử dụng

### Backend Requirements

1. Đảm bảo backend đang chạy trên `http://localhost:8080`
2. API endpoint: `GET /api/dashboard/revenue/by-period`
3. User cần có role `SUPER_ADMIN`
4. Token authentication hợp lệ

### Frontend Testing

1. Login với account SUPER_ADMIN
2. Navigate đến Admin Dashboard
3. Revenue chart sẽ tự động load data thật

### Manual API Testing

```javascript
// Trong browser console
await testDashboardIntegration();
```

## 📊 API Endpoint Details

### Request

```
GET /api/dashboard/revenue/by-period?groupBy=MONTH&startDate=2024-07-01&endDate=2025-07-01
```

### Response

```json
{
  "status": 200,
  "message": "Lấy doanh thu theo khoảng thời gian thành công",
  "data": [
    {
      "period": "2025-07",
      "periodStart": "2025-07-01T00:00:00",
      "periodEnd": "2025-08-01T00:00:00",
      "revenue": 708000,
      "transactionCount": 2,
      "successCount": 2,
      "failedCount": 0,
      "successRate": 100
    }
  ]
}
```

## 🎯 Features

### ✅ Implemented

- ✅ Real API integration
- ✅ Loading states với skeleton
- ✅ Error handling với retry button
- ✅ Data transformation cho chart format
- ✅ Currency formatting (VND)
- ✅ Auto refresh every 30 seconds
- ✅ TypeScript strict typing
- ✅ Responsive error messages

### 🔄 Chart Behavior

- **Loading**: Skeleton loader khi đang fetch data
- **Success**: Hiển thị chart với data thật
- **Error**: Error message + retry button
- **Empty Data**: Fallback empty chart với 0 values

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Error**

   ```
   Solution: Check backend CORS configuration for localhost:5173
   ```

2. **401 Unauthorized**

   ```
   Solution: Login lại hoặc check token expiration
   ```

3. **403 Forbidden**

   ```
   Solution: Đảm bảo user có role SUPER_ADMIN
   ```

4. **Network Error**
   ```
   Solution: Check backend server đang chạy
   ```

### Debug Steps

1. Open browser DevTools
2. Check Console cho error messages
3. Check Network tab cho API calls
4. Verify token trong localStorage
5. Run manual test: `await testDashboardIntegration()`

## 📈 Data Flow

```
Component Mount
    ↓
Calculate Date Range (12 months)
    ↓
Call API với MONTH groupBy
    ↓
Transform Response Data
    ↓
Update Chart Component
    ↓
Auto Refresh every 30s
```

## 🔒 Security

- Authentication required (Bearer token)
- Role-based access control (SUPER_ADMIN only)
- Error messages không expose sensitive info
- Request validation trên backend

## 📱 Responsive Design

- Chart responsive trên mobile/desktop
- Loading states responsive
- Error messages responsive

## 🎨 UI/UX Features

- Smooth loading animations
- Clear error messages
- Retry functionality
- Last updated timestamp
- Vietnamese currency formatting
- Dark/Light theme support

## 🔧 Troubleshooting

### API trả về dữ liệu nhưng chart không hiển thị:

1. Kiểm tra console logs cho transformRevenueData
2. Verify data format từ API
3. Check chart component props
4. Ensure chartData được update trong state

### Chart hiển thị quá nhiều tháng:

- Đã sửa logic để chỉ hiển thị 6 tháng gần nhất
- calculateDateRange() tính từ 6 tháng trước đến hiện tại
- generateFallbackData() tạo 6 tháng fallback data

### Debugging:

```js
// Chạy trong browser console
testDashboardIntegration();
```

## 📊 Data Flow (6 tháng)

1. **calculateDateRange()** → Tính 6 tháng gần nhất
2. **API call** → Lấy dữ liệu trong range 6 tháng
3. **transformRevenueData()** → Transform và fill missing months
4. **Chart render** → Hiển thị 6 tháng data
5. **Fallback** → Nếu lỗi, show 6 tháng với revenue = 0
