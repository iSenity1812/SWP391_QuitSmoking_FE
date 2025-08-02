import { useState, useEffect, useCallback, useRef } from 'react';
import { healthService } from '../services/healthService';
import type { HealthMetric, HealthOverview } from '../types/health';
import { HealthMetricType } from '../types/health';
import { toast } from 'sonner';

export const useHealth = () => {
    const [overview, setOverview] = useState<HealthOverview | null>(null);
    const [metrics, setMetrics] = useState<HealthMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

    // Auto-refresh interval (5 seconds)
    const AUTO_REFRESH_INTERVAL = 5 * 1000; // 5 seconds
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchOverview = useCallback(async () => {
        try {
            const data = await healthService.getHealthOverview();
            setOverview(data);
            setError(null);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching health overview:', err);
            // Không set error nếu backend không chạy, vì đã có fallback data
            if (err instanceof Error && err.message.includes('Network Error')) {
                console.warn('Backend không khả dụng, sử dụng fallback data');
            } else {
                setError('Không thể tải tổng quan sức khỏe');
            }
        }
    }, []);

    const fetchMetrics = useCallback(async () => {
        try {
            console.log('🔄 Fetching metrics in useHealth hook...');
            const data = await healthService.getAllHealthMetrics();
            console.log('✅ Metrics data received:', data);
            setMetrics(data);
            setError(null);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('❌ Error fetching health metrics:', err);
            // Không set error nếu backend không chạy, vì đã có fallback data
            if (err instanceof Error && err.message.includes('Network Error')) {
                console.warn('⚠️ Backend không khả dụng, sử dụng fallback data');
            } else {
                setError('Không thể tải dữ liệu sức khỏe');
            }
        }
    }, []);

    const updateProgress = useCallback(async (showToast = false) => {
        try {
            console.log('🔄 Starting progress update...');
            setIsAutoRefreshing(true);
            await healthService.updateHealthMetricsProgress();
            console.log('✅ Progress update completed, refreshing data...');
            // Refresh data after update
            await Promise.all([fetchOverview(), fetchMetrics()]);
            console.log('✅ Health metrics updated successfully');

            // TẮT TOAST NOTIFICATION - CHỈ LOG CONSOLE
            // if (showToast) {
            //   toast.success('Cập nhật tiến độ sức khỏe thành công!', {
            //     description: 'Dữ liệu sức khỏe đã được cập nhật mới nhất.',
            //     duration: 3000,
            //   });
            // }
        } catch (err) {
            console.error('❌ Error updating progress:', err);
            // Không set error nếu backend không chạy
            if (!(err instanceof Error && err.message.includes('Network Error'))) {
                setError('Không thể cập nhật tiến độ');
                // TẮT ERROR TOAST
                // if (showToast) {
                //   toast.error('Không thể cập nhật tiến độ sức khỏe', {
                //     description: 'Vui lòng thử lại sau.',
                //     duration: 5000,
                //   });
                // }
            }
        } finally {
            setIsAutoRefreshing(false);
        }
    }, [fetchOverview, fetchMetrics]);

    // Auto-refresh function
    const startAutoRefresh = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(async () => {
            // console.log('🔄 Auto-refreshing health metrics...'); // TẮT LOG
            await updateProgress(false); // Không hiển thị toast cho auto-refresh
        }, AUTO_REFRESH_INTERVAL);

        // console.log('🚀 Auto-refresh started (every 15 seconds)'); // TẮT LOG
    }, [updateProgress]);

    const stopAutoRefresh = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            // console.log('⏹️ Auto-refresh stopped'); // TẮT LOG
        }
    }, []);

    const getMetricByType = useCallback((type: HealthMetricType) => {
        return metrics.find(metric => metric.metricType === type);
    }, [metrics]);

    const getCompletedMetrics = useCallback(() => {
        return metrics.filter(metric => metric.isCompleted);
    }, [metrics]);

    const getInProgressMetrics = useCallback(() => {
        return metrics.filter(metric => !metric.isCompleted && metric.currentProgress > 0);
    }, [metrics]);

    const getUpcomingMetrics = useCallback(() => {
        return metrics.filter(metric => !metric.isCompleted && metric.currentProgress === 0);
    }, [metrics]);

    // Initialize data and start auto-refresh
    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                await Promise.all([fetchOverview(), fetchMetrics()]);
            } catch (err) {
                console.error('Error initializing health data:', err);
                // Không set error nếu backend không chạy
                if (!(err instanceof Error && err.message.includes('Network Error'))) {
                    setError('Không thể khởi tạo dữ liệu sức khỏe');
                }
            } finally {
                setLoading(false);
            }
        };

        initializeData();

        // BẬT LẠI AUTO-REFRESH - PENALTY SYSTEM ĐÃ SẴN SÀNG
        // Start auto-refresh after initial load
        const timer = setTimeout(() => {
            startAutoRefresh();
        }, 1000); // Start after 1 second

        // Cleanup function
        return () => {
            clearTimeout(timer);
            stopAutoRefresh();
        };
    }, []); // Empty dependency array to run only once

    return {
        overview,
        metrics,
        loading,
        error,
        lastUpdated,
        isAutoRefreshing,
        fetchOverview,
        fetchMetrics,
        updateProgress,
        startAutoRefresh,
        stopAutoRefresh,
        getMetricByType,
        getCompletedMetrics,
        getInProgressMetrics,
        getUpcomingMetrics
    };
}; 