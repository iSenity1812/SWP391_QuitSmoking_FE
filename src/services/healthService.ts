import axios from 'axios';
import type { HealthMetric, HealthOverview } from '../types/health';
import { HealthMetricType, getHealthMetricDisplayName, getHealthMetricDescription } from '../types/health';

// Tạo instance axios riêng cho health API để gọi trực tiếp BE
const healthAxios = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Thêm interceptor để thêm JWT token
healthAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

const HEALTH_API_BASE = '/health';

// Fallback data khi backend không chạy - ĐƠN GIẢN VÀ RÕ RÀNG
const createFallbackOverview = (): HealthOverview => ({
  totalMetrics: 16,
  completedMetrics: 3,
  inProgressMetrics: 8,
  overallProgress: 45,
  topProgressMetrics: [],
  upcomingMilestones: [],
  recentAchievements: [],
  nextMilestone: "Cải thiện hô hấp",
  daysSinceQuit: 2,
  hoursSinceQuit: 48,
  quitDate: new Date().toISOString() // Add quitDate field
});

const createFallbackMetrics = (): HealthMetric[] => {
  const metrics: HealthMetric[] = [];
  const now = new Date();
  const quitDate = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)); // Giả sử bỏ thuốc 2 ngày trước
  
  // Tạo fallback data đơn giản cho tất cả health metrics
  Object.values(HealthMetricType).forEach((type, index) => {
    // Tính toán target date dựa trên loại metric
    let targetDate: string;
    let currentProgress: number;
    let isCompleted: boolean = false;
    let achievedDate: string | null = null;
    let timeRemainingHours: number | null = null;
    let timeRemainingFormatted: string;

    // Tính toán target date đơn giản
    switch (type) {
      case HealthMetricType.PULSE_RATE:
        targetDate = new Date(quitDate.getTime() + (20 * 60 * 1000)).toISOString(); // 20 phút
        currentProgress = 100; // Đã hoàn thành
        isCompleted = true;
        achievedDate = targetDate;
        timeRemainingFormatted = 'Đã hoàn thành';
        timeRemainingHours = 0;
        break;
      case HealthMetricType.BLOOD_PRESSURE:
        targetDate = new Date(quitDate.getTime() + (20 * 60 * 1000)).toISOString(); // 20 phút
        currentProgress = 100; // Đã hoàn thành
        isCompleted = true;
        achievedDate = targetDate;
        timeRemainingFormatted = 'Đã hoàn thành';
        timeRemainingHours = 0;
        break;
      case HealthMetricType.OXYGEN_LEVELS:
        targetDate = new Date(quitDate.getTime() + (8 * 60 * 60 * 1000)).toISOString(); // 8 giờ
        currentProgress = 100; // Đã hoàn thành
        isCompleted = true;
        achievedDate = targetDate;
        timeRemainingFormatted = 'Đã hoàn thành';
        timeRemainingHours = 0;
        break;
      case HealthMetricType.CARBON_MONOXIDE:
        targetDate = new Date(quitDate.getTime() + (24 * 60 * 60 * 1000)).toISOString(); // 24 giờ
        currentProgress = 100; // Đã hoàn thành
        isCompleted = true;
        achievedDate = targetDate;
        timeRemainingFormatted = 'Đã hoàn thành';
        timeRemainingHours = 0;
        break;
      case HealthMetricType.NICOTINE:
        targetDate = new Date(quitDate.getTime() + (72 * 60 * 60 * 1000)).toISOString(); // 72 giờ
        currentProgress = 67; // Đang tiến hành
        timeRemainingFormatted = '1 ngày';
        timeRemainingHours = 24;
        break;
      case HealthMetricType.SENSE_OF_TASTE:
        targetDate = new Date(quitDate.getTime() + (48 * 60 * 60 * 1000)).toISOString(); // 48 giờ
        currentProgress = 67; // Đang tiến hành
        timeRemainingFormatted = '1 ngày';
        timeRemainingHours = 24;
        break;
      case HealthMetricType.SENSE_OF_SMELL:
        targetDate = new Date(quitDate.getTime() + (48 * 60 * 60 * 1000)).toISOString(); // 48 giờ
        currentProgress = 67; // Đang tiến hành
        timeRemainingFormatted = '1 ngày';
        timeRemainingHours = 24;
        break;
      case HealthMetricType.BREATHING:
        targetDate = new Date(quitDate.getTime() + (72 * 60 * 60 * 1000)).toISOString(); // 72 giờ
        currentProgress = 52; // Đang tiến hành
        timeRemainingFormatted = '1 ngày 20 giờ';
        timeRemainingHours = 44;
        break;
      case HealthMetricType.COUGHING:
        targetDate = new Date(quitDate.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(); // 1 tuần
        currentProgress = 29; // Đang tiến hành
        timeRemainingFormatted = '5 ngày';
        timeRemainingHours = 120;
        break;
      case HealthMetricType.ENERGY_LEVELS:
        targetDate = new Date(quitDate.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString(); // 2 tuần
        currentProgress = 14; // Mới bắt đầu
        timeRemainingFormatted = '12 ngày';
        timeRemainingHours = 288;
        break;
      case HealthMetricType.LUNG_FUNCTION:
        targetDate = new Date(quitDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(); // 1 tháng
        currentProgress = 7; // Mới bắt đầu
        timeRemainingFormatted = '28 ngày';
        timeRemainingHours = 672;
        break;
      case HealthMetricType.CIRCULATION:
        targetDate = new Date(quitDate.getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString(); // 3 tháng
        currentProgress = 2; // Mới bắt đầu
        timeRemainingFormatted = '88 ngày';
        timeRemainingHours = 2112;
        break;
      case HealthMetricType.SKIN_IMPROVEMENT:
        targetDate = new Date(quitDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(); // 1 tháng
        currentProgress = 7; // Mới bắt đầu
        timeRemainingFormatted = '28 ngày';
        timeRemainingHours = 672;
        break;
      case HealthMetricType.STRESS_REDUCTION:
        targetDate = new Date(quitDate.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString(); // 2 tuần
        currentProgress = 14; // Mới bắt đầu
        timeRemainingFormatted = '12 ngày';
        timeRemainingHours = 288;
        break;
      case HealthMetricType.HEART_ATTACK_RISK:
        targetDate = new Date(quitDate.getTime() + (15 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 15 năm
        currentProgress = 0.04; // Mới bắt đầu
        timeRemainingFormatted = '14 năm 363 ngày';
        timeRemainingHours = 130680;
        break;
      case HealthMetricType.CANCER_RISK:
        targetDate = new Date(quitDate.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 10 năm
        currentProgress = 0.05; // Mới bắt đầu
        timeRemainingFormatted = '9 năm 363 ngày';
        timeRemainingHours = 87120;
        break;
      default:
        targetDate = new Date(quitDate.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(); // 7 ngày mặc định
        currentProgress = 29; // Mới bắt đầu
        timeRemainingFormatted = '5 ngày';
        timeRemainingHours = 120;
    }

    metrics.push({
      id: `fallback-${index}`,
      userId: 'fallback-user',
      metricType: type,
      displayName: getHealthMetricDisplayName(type),
      description: getHealthMetricDescription(type),
      currentProgress,
      targetDate,
      achievedDate,
      isCompleted,
      timeRemainingHours,
      timeRemainingFormatted,
      createdAt: quitDate.toISOString(),
      updatedAt: now.toISOString()
    });
  });
  
  return metrics;
};

export const healthService = {
  /**
   * Lấy tổng quan sức khỏe
   */
  async getHealthOverview(): Promise<HealthOverview> {
    try {
      const response = await healthAxios.get(`${HEALTH_API_BASE}/overview`);
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend không khả dụng, sử dụng fallback data:', error);
      return createFallbackOverview();
    }
  },

  /**
   * Lấy tất cả health metrics
   */
  async getAllHealthMetrics(): Promise<HealthMetric[]> {
    try {
      console.log('🔄 Fetching health metrics from backend...');
      const response = await healthAxios.get(`${HEALTH_API_BASE}/metrics`);
      console.log('✅ Backend response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Backend error, using fallback data:', error);
      console.warn('⚠️ Using fallback data - simplified without penalty logic');
      return createFallbackMetrics();
    }
  },

  /**
   * Lấy sample health metrics (không cần authentication)
   */
  async getSampleHealthMetrics(): Promise<HealthMetric[]> {
    try {
      console.log('🔄 Fetching sample health metrics from backend...');
      const response = await healthAxios.get(`${HEALTH_API_BASE}/test/sample-metrics`);
      console.log('✅ Sample metrics response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error fetching sample metrics:', error);
      console.warn('⚠️ Using fallback data for sample metrics');
      return createFallbackMetrics();
    }
  },

  /**
   * Lấy health metric theo loại
   */
  async getHealthMetricByType(metricType: HealthMetricType): Promise<HealthMetric> {
    try {
      const response = await healthAxios.get(`${HEALTH_API_BASE}/metrics/${metricType}`);
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend không khả dụng, sử dụng fallback data:', error);
      
      // Tạo fallback data đơn giản
      const now = new Date();
      const quitDate = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)); // Giả sử bỏ thuốc 2 ngày trước
      
      let targetDate: string;
      let currentProgress: number;
      let isCompleted: boolean = false;
      let achievedDate: string | null = null;
      let timeRemainingHours: number | null = null;
      let timeRemainingFormatted: string;

      // Tính toán target date đơn giản
      switch (metricType) {
        case HealthMetricType.PULSE_RATE:
          targetDate = new Date(quitDate.getTime() + (20 * 60 * 1000)).toISOString(); // 20 phút
          currentProgress = 100; // Đã hoàn thành
          isCompleted = true;
          achievedDate = targetDate;
          timeRemainingFormatted = 'Đã hoàn thành';
          timeRemainingHours = 0;
          break;
        case HealthMetricType.BLOOD_PRESSURE:
          targetDate = new Date(quitDate.getTime() + (20 * 60 * 1000)).toISOString(); // 20 phút
          currentProgress = 100; // Đã hoàn thành
          isCompleted = true;
          achievedDate = targetDate;
          timeRemainingFormatted = 'Đã hoàn thành';
          timeRemainingHours = 0;
          break;
        case HealthMetricType.OXYGEN_LEVELS:
          targetDate = new Date(quitDate.getTime() + (8 * 60 * 60 * 1000)).toISOString(); // 8 giờ
          currentProgress = 100; // Đã hoàn thành
          isCompleted = true;
          achievedDate = targetDate;
          timeRemainingFormatted = 'Đã hoàn thành';
          timeRemainingHours = 0;
          break;
        case HealthMetricType.CARBON_MONOXIDE:
          targetDate = new Date(quitDate.getTime() + (24 * 60 * 60 * 1000)).toISOString(); // 24 giờ
          currentProgress = 100; // Đã hoàn thành
          isCompleted = true;
          achievedDate = targetDate;
          timeRemainingFormatted = 'Đã hoàn thành';
          timeRemainingHours = 0;
          break;
        case HealthMetricType.NICOTINE:
          targetDate = new Date(quitDate.getTime() + (72 * 60 * 60 * 1000)).toISOString(); // 72 giờ
          currentProgress = 67; // Đang tiến hành
          timeRemainingFormatted = '1 ngày';
          timeRemainingHours = 24;
          break;
        case HealthMetricType.SENSE_OF_TASTE:
          targetDate = new Date(quitDate.getTime() + (48 * 60 * 60 * 1000)).toISOString(); // 48 giờ
          currentProgress = 67; // Đang tiến hành
          timeRemainingFormatted = '1 ngày';
          timeRemainingHours = 24;
          break;
        case HealthMetricType.SENSE_OF_SMELL:
          targetDate = new Date(quitDate.getTime() + (48 * 60 * 60 * 1000)).toISOString(); // 48 giờ
          currentProgress = 67; // Đang tiến hành
          timeRemainingFormatted = '1 ngày';
          timeRemainingHours = 24;
          break;
        case HealthMetricType.BREATHING:
          targetDate = new Date(quitDate.getTime() + (72 * 60 * 60 * 1000)).toISOString(); // 72 giờ
          currentProgress = 52; // Đang tiến hành
          timeRemainingFormatted = '1 ngày 20 giờ';
          timeRemainingHours = 44;
          break;
        case HealthMetricType.COUGHING:
          targetDate = new Date(quitDate.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(); // 1 tuần
          currentProgress = 29; // Đang tiến hành
          timeRemainingFormatted = '5 ngày';
          timeRemainingHours = 120;
          break;
        case HealthMetricType.ENERGY_LEVELS:
          targetDate = new Date(quitDate.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString(); // 2 tuần
          currentProgress = 14; // Mới bắt đầu
          timeRemainingFormatted = '12 ngày';
          timeRemainingHours = 288;
          break;
        case HealthMetricType.LUNG_FUNCTION:
          targetDate = new Date(quitDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(); // 1 tháng
          currentProgress = 7; // Mới bắt đầu
          timeRemainingFormatted = '28 ngày';
          timeRemainingHours = 672;
          break;
        case HealthMetricType.CIRCULATION:
          targetDate = new Date(quitDate.getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString(); // 3 tháng
          currentProgress = 2; // Mới bắt đầu
          timeRemainingFormatted = '88 ngày';
          timeRemainingHours = 2112;
          break;
        case HealthMetricType.SKIN_IMPROVEMENT:
          targetDate = new Date(quitDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(); // 1 tháng
          currentProgress = 7; // Mới bắt đầu
          timeRemainingFormatted = '28 ngày';
          timeRemainingHours = 672;
          break;
        case HealthMetricType.STRESS_REDUCTION:
          targetDate = new Date(quitDate.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString(); // 2 tuần
          currentProgress = 14; // Mới bắt đầu
          timeRemainingFormatted = '12 ngày';
          timeRemainingHours = 288;
          break;
        case HealthMetricType.HEART_ATTACK_RISK:
          targetDate = new Date(quitDate.getTime() + (15 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 15 năm
          currentProgress = 0.04; // Mới bắt đầu
          timeRemainingFormatted = '14 năm 363 ngày';
          timeRemainingHours = 130680;
          break;
        case HealthMetricType.CANCER_RISK:
          targetDate = new Date(quitDate.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 10 năm
          currentProgress = 0.05; // Mới bắt đầu
          timeRemainingFormatted = '9 năm 363 ngày';
          timeRemainingHours = 87120;
          break;
        default:
          targetDate = new Date(quitDate.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(); // 7 ngày mặc định
          currentProgress = 29; // Mới bắt đầu
          timeRemainingFormatted = '5 ngày';
          timeRemainingHours = 120;
      }

      return {
        id: `fallback-${metricType}`,
        userId: 'fallback-user',
        metricType,
        displayName: getHealthMetricDisplayName(metricType),
        description: getHealthMetricDescription(metricType),
        currentProgress,
        targetDate,
        achievedDate,
        isCompleted,
        timeRemainingHours,
        timeRemainingFormatted,
        createdAt: quitDate.toISOString(),
        updatedAt: now.toISOString()
      };
    }
  },

  /**
   * Lấy danh sách milestone sắp tới
   */
  async getUpcomingMilestones(limit: number = 5): Promise<HealthMetric[]> {
    try {
      const response = await healthAxios.get(`${HEALTH_API_BASE}/milestones/upcoming`, {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend không khả dụng, sử dụng fallback data:', error);
      return [];
    }
  },

  /**
   * Lấy danh sách thành tựu đã đạt được
   */
  async getAchievements(limit: number = 10): Promise<HealthMetric[]> {
    try {
      const response = await healthAxios.get(`${HEALTH_API_BASE}/achievements`, {
        params: { limit }
      });
      return response.data.data;
    } catch (error) {
      console.warn('⚠️ Backend không khả dụng, sử dụng fallback data:', error);
      return [];
    }
  },

  /**
   * Cập nhật tiến độ health metrics
   */
  async updateHealthMetricsProgress(): Promise<void> {
    try {
      console.log('🔄 Updating health metrics progress...');
      const response = await healthAxios.post(`${HEALTH_API_BASE}/update-progress`);
      console.log('✅ Progress update response:', response.data);
    } catch (error) {
      console.error('❌ Failed to update progress:', error);
      // Không throw error để tránh crash UI
    }
  }
}; 