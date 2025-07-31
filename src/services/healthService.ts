import axios from '../config/axiosConfig';
import type { HealthMetric, HealthOverview } from '../types/health';
import { HealthMetricType, getHealthMetricDisplayName, getHealthMetricDescription } from '../types/health';

const HEALTH_API_BASE = '/health';

// Fallback data khi backend không chạy
const createFallbackOverview = (): HealthOverview => ({
    totalMetrics: 15,
    completedMetrics: 0,
    inProgressMetrics: 0,
    overallProgress: 0,
    topProgressMetrics: [],
    upcomingMilestones: [],
    recentAchievements: [],
    nextMilestone: 'Bắt đầu hành trình bỏ thuốc',
    daysSinceQuit: 0,
    hoursSinceQuit: 0,
    isInGracePeriod: false,
    gracePeriodRemainingHours: 0
});

const createFallbackMetrics = (): HealthMetric[] => {
    const metrics: HealthMetric[] = [];

    // Tạo fallback data cho tất cả health metrics
    Object.values(HealthMetricType).forEach((type, index) => {
        metrics.push({
            id: `fallback-${index}`,
            userId: 'fallback-user',
            metricType: type,
            displayName: getHealthMetricDisplayName(type),
            description: getHealthMetricDescription(type),
            currentProgress: 0,
            targetDate: null,
            achievedDate: null,
            isCompleted: false,
            timeRemainingHours: null,
            timeRemainingFormatted: 'Chưa bắt đầu',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
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
            const response = await axios.get(`${HEALTH_API_BASE}/overview`);
            return response.data.data;
        } catch (error) {
            console.warn('Backend không khả dụng, sử dụng fallback data:', error);
            return createFallbackOverview();
        }
    },

    /**
     * Lấy tất cả health metrics
     */
    async getAllHealthMetrics(): Promise<HealthMetric[]> {
        try {
            const response = await axios.get(`${HEALTH_API_BASE}/metrics`);
            return response.data.data;
        } catch (error) {
            console.warn('Backend không khả dụng, sử dụng fallback data:', error);
            return createFallbackMetrics();
        }
    },

    /**
     * Lấy health metric theo loại
     */
    async getHealthMetricByType(metricType: HealthMetricType): Promise<HealthMetric> {
        try {
            const response = await axios.get(`${HEALTH_API_BASE}/metrics/${metricType}`);
            return response.data.data;
        } catch (error) {
            console.warn('Backend không khả dụng, sử dụng fallback data:', error);
            return {
                id: `fallback-${metricType}`,
                userId: 'fallback-user',
                metricType,
                displayName: getHealthMetricDisplayName(metricType),
                description: getHealthMetricDescription(metricType),
                currentProgress: 0,
                targetDate: null,
                achievedDate: null,
                isCompleted: false,
                timeRemainingHours: null,
                timeRemainingFormatted: 'Chưa bắt đầu',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        }
    },

    /**
     * Lấy danh sách milestone sắp tới
     */
    async getUpcomingMilestones(limit: number = 5): Promise<HealthMetric[]> {
        try {
            const response = await axios.get(`${HEALTH_API_BASE}/milestones/upcoming`, {
                params: { limit }
            });
            return response.data.data;
        } catch (error) {
            console.warn('Backend không khả dụng, sử dụng fallback data:', error);
            return [];
        }
    },

    /**
     * Lấy danh sách thành tựu đã đạt được
     */
    async getAchievements(limit: number = 10): Promise<HealthMetric[]> {
        try {
            const response = await axios.get(`${HEALTH_API_BASE}/achievements`, {
                params: { limit }
            });
            return response.data.data;
        } catch (error) {
            console.warn('Backend không khả dụng, sử dụng fallback data:', error);
            return [];
        }
    },

    /**
     * Cập nhật tiến độ health metrics
     */
    async updateHealthMetricsProgress(): Promise<void> {
        try {
            await axios.post(`${HEALTH_API_BASE}/metrics/update-progress`);
        } catch (error) {
            console.warn('Không thể cập nhật tiến độ, backend không khả dụng:', error);
            // Không throw error để tránh crash UI
        }
    }
}; 