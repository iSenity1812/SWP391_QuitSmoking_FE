// services/dataVisualizationService.tsx

import axios from 'axios';
import axiosConfig from '@/config/axiosConfig';
import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns'; // Import format from date-fns

// --- General API Response Types ---
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  errors?: { [key: string]: string };
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}

// Utility function to handle API errors
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const apiResponse = error.response.data as ApiResponse<unknown>;
      if (apiResponse && apiResponse.message) {
        return apiResponse.message;
      }
      return `API Error: ${error.response.status} - ${error.response.statusText || 'Unknown Error'}`;
    } else if (error.request) {
      return "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.";
    } else {
      return `Lỗi yêu cầu: ${error.message}`;
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'Đã xảy ra lỗi không xác định.';
};

// --- DTOs tương ứng với BE ---
// DTO cho dữ liệu biểu đồ hàng giờ
export interface HourlyChartDataResponse {
  hour: number;
  smokedCount: number | null;
  cravingCount: number | null;
  situations: string[]; // Chuyển đổi Set<Situation> sang string[]
  withWhoms: string[]; // Chuyển đổi Set<WithWhom> sang string[]
}

// DTO cho dữ liệu biểu đồ hàng ngày (tuần/tháng)
export interface DailyChartDataResponse {
  date: string; // LocalDate -> string (ISO 8601: YYYY-MM-DD)
  totalSmokedCount: number | null;
  totalCravingCount: number | null;
  moneySaved: number; // BigDecimal -> number
  mood: string; // Mood enum -> string
}

export class DataVisualizationService {
  private static instance: DataVisualizationService;
  // API_BASE_URL khớp với @RequestMapping("/api/charts") trong DataVisualizationController
  private readonly API_BASE_URL = '/charts';

  public static getInstance(): DataVisualizationService {
    if (!DataVisualizationService.instance) {
      DataVisualizationService.instance = new DataVisualizationService();
    }
    return DataVisualizationService.instance;
  }

  /**
   * Lấy dữ liệu tổng hợp theo giờ cho một ngày cụ thể của người dùng.
   * GET /api/charts/hourly?date={date}
   * @param date Ngày cần lấy dữ liệu (YYYY-MM-DD).
   * @returns Promise chứa danh sách HourlyChartDataResponse.
   */
  getHourlyDataForDay = async (date: string): Promise<HourlyChartDataResponse[]> => {
    try {
      const response = await axiosConfig.get<ApiResponse<HourlyChartDataResponse[]>>(`${this.API_BASE_URL}/hourly`, {
        params: { date }
      });
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch hourly chart data');
      }
    } catch (error: unknown) {
      console.error('Error fetching hourly chart data:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Lấy dữ liệu tổng hợp theo ngày cho một tuần cụ thể của người dùng.
   * GET /api/charts/week?dateInWeek={dateInWeek}
   * @param dateInWeek Một ngày bất kỳ trong tuần cần lấy dữ liệu (YYYY-MM-DD).
   * @returns Promise chứa danh sách DailyChartDataResponse.
   */
  getDailyDataForWeek = async (dateInWeek: string): Promise<DailyChartDataResponse[]> => {
    try {
      const response = await axiosConfig.get<ApiResponse<DailyChartDataResponse[]>>(`${this.API_BASE_URL}/week`, {
        params: { dateInWeek }
      });
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch weekly chart data');
      }
    } catch (error: unknown) {
      console.error('Error fetching weekly chart data:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Lấy dữ liệu tổng hợp theo ngày cho một tháng cụ thể của người dùng.
   * GET /api/charts/month?year={year}&month={month}
   * @param year Năm cần lấy dữ liệu.
   * @param month Tháng cần lấy dữ liệu.
   * @returns Promise chứa danh sách DailyChartDataResponse.
   */
  getDailyDataForMonth = async (year: number, month: number): Promise<DailyChartDataResponse[]> => {
    try {
      const response = await axiosConfig.get<ApiResponse<DailyChartDataResponse[]>>(`${this.API_BASE_URL}/month`, {
        params: { year, month }
      });
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch monthly chart data');
      }
    } catch (error: unknown) {
      console.error('Error fetching monthly chart data:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Lấy dữ liệu tổng hợp theo ngày cho một khoảng ngày tùy chỉnh của người dùng.
   * GET /api/charts/day-range?startDate={startDate}&endDate={endDate}
   * @param startDate Ngày bắt đầu (YYYY-MM-DD).
   * @param endDate Ngày kết thúc (YYYY-MM-DD).
   * @returns Promise chứa danh sách DailyChartDataResponse.
   */
  getDailyDataForDayRange = async (startDate: string, endDate: string): Promise<DailyChartDataResponse[]> => {
    try {
      // Format startDate and endDate to YYYY-MM-DD to match backend's LocalDate expectation
      const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd');
      const formattedEndDate = format(new Date(endDate), 'yyyy-MM-dd');

      const response = await axiosConfig.get<ApiResponse<DailyChartDataResponse[]>>(`${this.API_BASE_URL}/day-range`, {
        params: { startDate: formattedStartDate, endDate: formattedEndDate }
      });
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch daily data for day range');
      }
    } catch (error: unknown) {
      console.error('Error fetching daily data for day range:', error);
      throw new Error(handleApiError(error));
    }
  };
}

// Tạo và export instance singleton
export const dataVisualizationService = DataVisualizationService.getInstance();


// --- Custom Hooks để sử dụng trong React Components ---

interface UseChartDataState<T> {
  data: T[] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook để lấy dữ liệu biểu đồ hàng giờ.
 * @param date Ngày cần lấy dữ liệu (YYYY-MM-DD).
 */
export function useHourlyChartData(date: string): UseChartDataState<HourlyChartDataResponse> {
  const [data, setData] = useState<HourlyChartDataResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!date) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await dataVisualizationService.getHourlyDataForDay(date);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch hourly chart data");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Custom hook để lấy dữ liệu biểu đồ hàng ngày cho một tuần.
 * @param dateInWeek Một ngày bất kỳ trong tuần cần lấy dữ liệu (YYYY-MM-DD).
 */
export function useWeeklyChartData(dateInWeek: string): UseChartDataState<DailyChartDataResponse> {
  const [data, setData] = useState<DailyChartDataResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!dateInWeek) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await dataVisualizationService.getDailyDataForWeek(dateInWeek);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weekly chart data");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [dateInWeek]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Custom hook để lấy dữ liệu biểu đồ hàng ngày cho một tháng.
 * @param year Năm cần lấy dữ liệu.
 * @param month Tháng cần lấy dữ liệu.
 */
export function useMonthlyChartData(year: number, month: number): UseChartDataState<DailyChartDataResponse> {
  const [data, setData] = useState<DailyChartDataResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!year || !month) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await dataVisualizationService.getDailyDataForMonth(year, month);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch monthly chart data");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Custom hook để lấy dữ liệu biểu đồ hàng ngày cho một khoảng ngày tùy chỉnh.
 * @param startDate Ngày bắt đầu (YYYY-MM-DD).
 * @param endDate Ngày kết thúc (YYYY-MM-DD).
 */
export function useDailyDataForDayRange(startDate: string, endDate: string): UseChartDataState<DailyChartDataResponse> {
  const [data, setData] = useState<DailyChartDataResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await dataVisualizationService.getDailyDataForDayRange(startDate, endDate);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch daily data for day range");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
