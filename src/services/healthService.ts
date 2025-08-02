import { type } from 'os';
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
    hoursSinceQuit: 0
});

const createFallbackMetrics = (): HealthMetric[] => {
    const metrics: HealthMetric[] = [];
    const now = new Date();

    // Tạo fallback data cho tất cả health metrics với target dates thực tế
    Object.values(HealthMetricType).forEach((type, index) => {
        // Tính toán target date dựa trên loại metric
        let targetDate: string;
        let currentProgress: number;
        let isCompleted: boolean = false;
        let achievedDate: string | null = null;
        let timeRemainingHours: number | null = null;
        let timeRemainingFormatted: string;

        // Tính toán dựa trên thời gian cần thiết cho từng loại metric
        const quitDate = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)); // Giả sử bỏ thuốc 2 ngày trước

        switch (type) {
            case HealthMetricType.PULSE_RATE:
                targetDate = new Date(quitDate.getTime() + (20 * 60 * 1000)).toISOString(); // 20 phút
                break;
            case HealthMetricType.OXYGEN_LEVELS:
                targetDate = new Date(quitDate.getTime() + (8 * 60 * 60 * 1000)).toISOString(); // 8 giờ
                break;
            case HealthMetricType.CARBON_MONOXIDE:
                targetDate = new Date(quitDate.getTime() + (24 * 60 * 60 * 1000)).toISOString(); // 24 giờ
                break;
            case HealthMetricType.NICOTINE_EXPELLED:
                targetDate = new Date(quitDate.getTime() + (72 * 60 * 60 * 1000)).toISOString(); // 72 giờ
                break;
            case HealthMetricType.TASTE_SMELL:
                targetDate = new Date(quitDate.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString(); // 3 ngày
                break;
            case HealthMetricType.BREATHING:
                targetDate = new Date(quitDate.getTime() + (3 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 3 ngày 20 giờ
                break;
            case HealthMetricType.ENERGY_LEVELS:
                targetDate = new Date(quitDate.getTime() + (4 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 4 ngày 20 giờ
                break;
            case HealthMetricType.BAD_BREATH_GONE:
                targetDate = new Date(quitDate.getTime() + (7 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 7 ngày 20 giờ
                break;
            case HealthMetricType.GUMS_TEETH:
                targetDate = new Date(quitDate.getTime() + (14 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 14 ngày 20 giờ
                break;
            case HealthMetricType.TEETH_BRIGHTNESS:
                targetDate = new Date(quitDate.getTime() + (14 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 14 ngày 20 giờ
                break;
            case HealthMetricType.CIRCULATION:
                targetDate = new Date(quitDate.getTime() + (2 * 30 * 24 * 60 * 60 * 1000) + (28 * 24 * 60 * 60 * 1000)).toISOString(); // 2 tháng 28 ngày
                break;
            case HealthMetricType.GUM_TEXTURE:
                targetDate = new Date(quitDate.getTime() + (2 * 30 * 24 * 60 * 60 * 1000) + (28 * 24 * 60 * 60 * 1000)).toISOString(); // 2 tháng 28 ngày
                break;
            case HealthMetricType.IMMUNITY_LUNG_FUNCTION:
                targetDate = new Date(quitDate.getTime() + (4 * 30 * 24 * 60 * 60 * 1000) + (17 * 24 * 60 * 60 * 1000)).toISOString(); // 4 tháng 17 ngày
                break;
            case HealthMetricType.HEART_DISEASE_RISK:
                targetDate = new Date(quitDate.getTime() + (365 * 24 * 60 * 60 * 1000)).toISOString(); // 1 năm
                break;
            case HealthMetricType.LUNG_CANCER_RISK:
                targetDate = new Date(quitDate.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 10 năm
                break;
            case HealthMetricType.HEART_ATTACK_RISK:
                targetDate = new Date(quitDate.getTime() + (15 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 15 năm
                break;
            default:
                targetDate = new Date(quitDate.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(); // 7 ngày mặc định
        }

        // Tính toán progress dựa trên thời gian đã trôi qua
        const targetTime = new Date(targetDate).getTime();
        const elapsedTime = now.getTime() - quitDate.getTime();
        const totalDuration = targetTime - quitDate.getTime();

        if (elapsedTime >= totalDuration) {
            currentProgress = 100;
            isCompleted = true;
            achievedDate = targetDate;
            timeRemainingFormatted = 'Đã hoàn thành';
            timeRemainingHours = 0;
        } else if (elapsedTime > 0) {
            currentProgress = Math.round((elapsedTime / totalDuration) * 100);
            timeRemainingHours = Math.max(0, Math.round((totalDuration - elapsedTime) / (60 * 60 * 1000)));
            timeRemainingFormatted = `${Math.floor(timeRemainingHours / 24)} ngày ${timeRemainingHours % 24} giờ`;
        } else {
            currentProgress = 0;
            timeRemainingHours = Math.round(totalDuration / (60 * 60 * 1000));
            timeRemainingFormatted = `${Math.floor(timeRemainingHours / 24)} ngày ${timeRemainingHours % 24} giờ`;
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
            const response = await axios.get(`${HEALTH_API_BASE}/overview`);
            return response.data.data;
        } catch (error) {
            // console.warn('Backend không khả dụng, sử dụng fallback data:', error); // TẮT LOG
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
            // console.warn('Backend không khả dụng, sử dụng fallback data:', error); // TẮT LOG
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
            // console.warn('Backend không khả dụng, sử dụng fallback data:', error); // TẮT LOG

            // Tạo fallback data với target date thực tế
            const now = new Date();
            const quitDate = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)); // Giả sử bỏ thuốc 2 ngày trước

            let targetDate: string;
            let currentProgress: number;
            let isCompleted: boolean = false;
            let achievedDate: string | null = null;
            let timeRemainingHours: number | null = null;
            let timeRemainingFormatted: string;

            // Tính toán target date dựa trên loại metric
            switch (metricType) {
                case HealthMetricType.PULSE_RATE:
                    targetDate = new Date(quitDate.getTime() + (20 * 60 * 1000)).toISOString(); // 20 phút
                    break;
                case HealthMetricType.OXYGEN_LEVELS:
                    targetDate = new Date(quitDate.getTime() + (8 * 60 * 60 * 1000)).toISOString(); // 8 giờ
                    break;
                case HealthMetricType.CARBON_MONOXIDE:
                    targetDate = new Date(quitDate.getTime() + (24 * 60 * 60 * 1000)).toISOString(); // 24 giờ
                    break;
                case HealthMetricType.NICOTINE_EXPELLED:
                    targetDate = new Date(quitDate.getTime() + (72 * 60 * 60 * 1000)).toISOString(); // 72 giờ
                    break;
                case HealthMetricType.TASTE_SMELL:
                    targetDate = new Date(quitDate.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString(); // 3 ngày
                    break;
                case HealthMetricType.BREATHING:
                    targetDate = new Date(quitDate.getTime() + (3 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 3 ngày 20 giờ
                    break;
                case HealthMetricType.ENERGY_LEVELS:
                    targetDate = new Date(quitDate.getTime() + (4 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 4 ngày 20 giờ
                    break;
                case HealthMetricType.BAD_BREATH_GONE:
                    targetDate = new Date(quitDate.getTime() + (7 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 7 ngày 20 giờ
                    break;
                case HealthMetricType.GUMS_TEETH:
                    targetDate = new Date(quitDate.getTime() + (14 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 14 ngày 20 giờ
                    break;
                case HealthMetricType.TEETH_BRIGHTNESS:
                    targetDate = new Date(quitDate.getTime() + (14 * 24 * 60 * 60 * 1000) + (20 * 60 * 60 * 1000)).toISOString(); // 14 ngày 20 giờ
                    break;
                case HealthMetricType.CIRCULATION:
                    targetDate = new Date(quitDate.getTime() + (2 * 30 * 24 * 60 * 60 * 1000) + (28 * 24 * 60 * 60 * 1000)).toISOString(); // 2 tháng 28 ngày
                    break;
                case HealthMetricType.GUM_TEXTURE:
                    targetDate = new Date(quitDate.getTime() + (2 * 30 * 24 * 60 * 60 * 1000) + (28 * 24 * 60 * 60 * 1000)).toISOString(); // 2 tháng 28 ngày
                    break;
                case HealthMetricType.IMMUNITY_LUNG_FUNCTION:
                    targetDate = new Date(quitDate.getTime() + (4 * 30 * 24 * 60 * 60 * 1000) + (17 * 24 * 60 * 60 * 1000)).toISOString(); // 4 tháng 17 ngày
                    break;
                case HealthMetricType.HEART_DISEASE_RISK:
                    targetDate = new Date(quitDate.getTime() + (365 * 24 * 60 * 60 * 1000)).toISOString(); // 1 năm
                    break;
                case HealthMetricType.LUNG_CANCER_RISK:
                    targetDate = new Date(quitDate.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 10 năm
                    break;
                case HealthMetricType.HEART_ATTACK_RISK:
                    targetDate = new Date(quitDate.getTime() + (15 * 365 * 24 * 60 * 60 * 1000)).toISOString(); // 15 năm
                    break;
                default:
                    targetDate = new Date(quitDate.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(); // 7 ngày mặc định
            }

            // FIXED: Sử dụng progress cố định cho fallback data
            // Không tính toán dựa trên thời gian thực để tránh tăng liên tục
            const targetTime = new Date(targetDate).getTime();
            const totalDuration = targetTime - quitDate.getTime();

            // Sử dụng progress cố định dựa trên loại metric
            switch (metricType) {
                case HealthMetricType.PULSE_RATE:
                    currentProgress = 100; // Đã hoàn thành (20 phút)
                    isCompleted = true;
                    achievedDate = targetDate;
                    break;
                case HealthMetricType.OXYGEN_LEVELS:
                    currentProgress = 88; // Gần hoàn thành
                    break;
                case HealthMetricType.CARBON_MONOXIDE:
                    currentProgress = 96; // Gần hoàn thành
                    break;
                case HealthMetricType.NICOTINE_EXPELLED:
                    currentProgress = 65; // Đang tiến hành
                    break;
                case HealthMetricType.TASTE_SMELL:
                    currentProgress = 51; // Đang tiến hành
                    break;
                case HealthMetricType.BREATHING:
                    currentProgress = 51; // Đang tiến hành
                    break;
                case HealthMetricType.ENERGY_LEVELS:
                    currentProgress = 41; // Đang tiến hành
                    break;
                case HealthMetricType.BAD_BREATH_GONE:
                    currentProgress = 25; // Mới bắt đầu
                    break;
                default:
                    currentProgress = Math.floor(Math.random() * 30) + 10; // 10-40% ngẫu nhiên
            }

            // Tính toán time remaining cố định
            timeRemainingHours = Math.round(totalDuration / (60 * 60 * 1000));
            timeRemainingFormatted = `${Math.floor(timeRemainingHours / 24)} ngày ${timeRemainingHours % 24} giờ`;

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
            const response = await axios.get(`${HEALTH_API_BASE}/milestones/upcoming`, {
                params: { limit }
            });
            return response.data.data;
        } catch (error) {
            // console.warn('Backend không khả dụng, sử dụng fallback data:', error); // TẮT LOG
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
            // console.warn('Backend không khả dụng, sử dụng fallback data:', error); // TẮT LOG
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
            // console.warn('Không thể cập nhật tiến độ, backend không khả dụng:', error); // TẮT LOG
            // Không throw error để tránh crash UI
        }
    }
}; 