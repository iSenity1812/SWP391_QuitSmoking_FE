# FE_combined - Quit Smoking Frontend

## Mô tả
FE_combined là sự kết hợp của:
- **FE_s**: Tất cả các module hoạt động tốt (Blog, VNPay, Leaderboard, Follow, Achievement, Booking, Coach, Appointment)
- **Health Metrics**: Module health_metrics từ FE (health components, services, types, pages)

## Cấu trúc

### ✅ Các module hoạt động tốt (từ FE_s):
- **Blog System**: Quản lý bài viết, comments, dialogs
- **VNPay Payment**: Thanh toán online
- **Leaderboard**: Bảng xếp hạng người dùng
- **Follow System**: Hệ thống follow/unfollow
- **Achievement System**: Hệ thống thành tựu
- **Booking System**: Đặt lịch hẹn với coach
- **Coach System**: Quản lý coach, lịch trình
- **Appointment System**: Quản lý cuộc hẹn
- **User Management**: Quản lý người dùng, profile
- **Task System**: Hệ thống nhiệm vụ, quiz
- **Plan System**: Kế hoạch bỏ thuốc (cơ bản)
- **Learning System**: Hệ thống học tập, chương trình

### ✅ Health Metrics (từ FE):
- **Health Components**: 17 components health (HealthOverviewCard, HealthMetricCard, CountdownTimer, etc.)
- **Health Service**: `healthService.ts` (17KB) - API calls cho health metrics
- **Health Types**: `health.ts` (6.5KB) - TypeScript interfaces
- **Health Pages**: `health/` và `health-benefits/` folders
- **Daily Summary**: `dailySummaryService.tsx` (10KB) - Theo dõi hàng ngày
- **Quit Plan**: `quitPlanService.tsx` (20KB) - Quản lý kế hoạch bỏ thuốc

## Tích hợp

### Health Metrics Integration:
- **Health Components**: Tích hợp vào user dashboard
- **Health Service**: Kết nối với BE_combined health endpoints
- **Daily Summary**: Theo dõi tiến độ hàng ngày
- **Quit Plan**: Quản lý kế hoạch bỏ thuốc nâng cao

## Cách chạy

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## API Endpoints

### Health Metrics:
- `GET /api/health/overview` - Lấy tổng quan health
- `GET /api/health/metrics` - Lấy tất cả health metrics
- `POST /api/health/update-progress` - Cập nhật tiến độ

### Các endpoints khác:
- Blog: `/api/blogs/*`
- VNPay: `/api/vnpay/*`
- Leaderboard: `/api/leaderboard/*`
- Follow: `/api/follow/*`
- Achievement: `/api/achievements/*`
- Booking: `/api/booking/*`
- Coach: `/api/coach/*`
- Appointment: `/api/appointment/*`

## Cấu trúc thư mục

```
FE_combined/
├── src/
│   ├── components/
│   │   ├── health/          # Health components (17 files)
│   │   ├── ui/             # UI components
│   │   ├── auth/           # Authentication components
│   │   └── coach/          # Coach components
│   ├── pages/
│   │   ├── health/         # Health pages
│   │   ├── health-benefits/ # Health benefits pages
│   │   ├── blog/           # Blog pages
│   │   ├── booking/        # Booking pages
│   │   ├── coach/          # Coach pages
│   │   └── ...            # Other pages
│   ├── services/
│   │   ├── healthService.ts        # Health API service
│   │   ├── quitPlanService.tsx     # Quit plan service
│   │   ├── dailySummaryService.tsx # Daily summary service
│   │   ├── blogService.ts          # Blog service
│   │   ├── vnpayService.ts         # VNPay service
│   │   └── ...                    # Other services
│   └── types/
│       ├── health.ts       # Health types
│       ├── blog.ts         # Blog types
│       └── ...            # Other types
```

## Lưu ý
- Tất cả module từ FE_s hoạt động bình thường
- Health metrics được tích hợp hoàn chỉnh
- Không có conflict giữa các module
- Tương thích với BE_combined

## Dependencies
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Framer Motion
