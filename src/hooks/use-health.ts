import { useState, useEffect, useCallback } from 'react';
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
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      // Sử dụng data thật từ DB thay vì sample data
      const data = await healthService.getAllHealthMetrics();
      console.log('✅ Sample metrics data received:', data);
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
      setIsRefreshing(true);
      console.log('🔄 Updating health metrics progress...');
      
      await healthService.updateHealthMetricsProgress();
      await Promise.all([fetchOverview(), fetchMetrics()]);
      
      if (showToast) {
        toast.success('Cập nhật sức khỏe thành công!');
      }
      
      console.log('✅ Health metrics updated successfully');
    } catch (error) {
      console.error('❌ Error updating health metrics:', error);
      if (showToast) {
        toast.error('Không thể cập nhật sức khỏe');
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchOverview, fetchMetrics]);

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

  // Manual refresh function
  const manualRefresh = useCallback(async () => {
    try {
      console.log('🔄 Manual refresh triggered by user');
      setIsRefreshing(true);
      
      // Force update progress từ backend
      await healthService.updateHealthMetricsProgress();
      
      // Fetch lại data mới
      await Promise.all([fetchOverview(), fetchMetrics()]);
      
      toast.success('Đã cập nhật dữ liệu sức khỏe!');
      console.log('✅ Manual refresh completed successfully');
    } catch (error) {
      console.error('❌ Error during manual refresh:', error);
      toast.error('Không thể cập nhật dữ liệu sức khỏe');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchOverview, fetchMetrics]);

  // Initialize data only
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // FIX: Gọi update trước khi fetch data để có data mới nhất
        console.log('🔄 Initializing health data with update...');
        await healthService.updateHealthMetricsProgress();
        
        // Sau đó fetch data đã được update
        await Promise.all([fetchOverview(), fetchMetrics()]);
        
        console.log('✅ Health data initialized with latest updates');
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
  }, [fetchOverview, fetchMetrics]);

  return {
    overview,
    metrics,
    loading,
    error,
    lastUpdated,
    isRefreshing,
    fetchOverview,
    fetchMetrics,
    updateProgress,
    getMetricByType,
    getCompletedMetrics,
    getInProgressMetrics,
    getUpcomingMetrics,
    manualRefresh
  };
}; 