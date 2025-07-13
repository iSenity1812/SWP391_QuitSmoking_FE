import axios from 'axios';
import axiosConfig from '@/config/axiosConfig'; // Đảm bảo đường dẫn đúng đến axiosConfig của bạn
import { useCallback, useEffect, useState } from 'react';

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

// --- Enums (tương ứng với BE enums) ---
export type ReductionQuitPlanType = 'IMMEDIATE' | 'LINEAR' | 'EXPONENTIAL' | 'LOGARITHMIC';
export type QuitPlanStatus = 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED' | 'FAILED' | 'RESTARTED' | 'ABANDONED'; // Cập nhật từ BE

// dashboard functionality
export interface DailyRecord {
  date: string
  cigarettesSmoked: number
  recommendedLimit: number
  cravingCount: number
  mood: "excellent" | "good" | "neutral" | "poor" | "terrible"
  notes?: string
  goalMet: boolean
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDays: number
  successfulDays: number
}

export interface HealthMilestone {
  timeframe: string
  title: string
  description: string
  icon: string
  achieved: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number
  maxProgress: number
}

// --- QuitPlan DTOs (tương ứng với BE DTOs) ---

export interface QuitPlanResponseDTO {
  quitPlanId: number;
  reductionType: ReductionQuitPlanType;
  createdAt: string; // LocalDateTime -> string (ISO 8601)
  startDate: string; // LocalDateTime -> string (ISO 8601)
  goalDate: string;  // LocalDate -> string (ISO 8601:YYYY-MM-DD)
  initialSmokingAmount: number;
  pricePerPack: number; // BigDecimal -> number
  cigarettesPerPack: number;
  status: QuitPlanStatus;
}

export interface QuitPlanAdminResponseDTO extends QuitPlanResponseDTO {
  memberId: string; // UUID -> string
  memberUsername: string;
}

export interface QuitPlanCreateRequestDTO {
  reductionType: ReductionQuitPlanType;
  startDate: string; // Không cho phép null ở đây để phù hợp với BE @NotNull
  goalDate: string;  // Không cho phép null ở đây để phù hợp với BE @NotNull
  initialSmokingAmount: number;
  cigarettesPerPack: number;
  pricePerPack: number; // BigDecimal -> number
}

export interface QuitPlanUpdateRequestDTO {
  cigarettesPerPack?: number; // Optional vì là PATCH
  pricePerPack?: number; // Optional vì là PATCH, BigDecimal -> number
}

export interface QuitPlanRestartRequestDTO {
  newStartDate: string; // LocalDateTime -> string (ISO 8601)
  newGoalDate: string;  // LocalDate -> string (ISO 8601:YYYY-MM-DD)
  newInitialSmokingAmount: number;
  newPricePerPack: number; // BigDecimal -> number
  newCigarettesPerPack: number;
  newReductionType?: ReductionQuitPlanType; // Optional
}

// --- Hook State Types (tương tự mẫu của bạn) ---
export interface UseQuitPlanState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useQuitPlan() {
  const [quitPlan, setQuitPlan] = useState<QuitPlanResponseDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrentPlan = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const plan = await quitPlanService.getCurrentQuitPlan()
      setQuitPlan(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch quit plan")
      setQuitPlan(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrentPlan()
  }, [fetchCurrentPlan])

  return {
    quitPlan,
    isLoading,
    error,
    refetch: fetchCurrentPlan,
  }
}

// Utility function to handle API errors (moved from dataTransformers)
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


export class QuitPlanService {
  private static instance: QuitPlanService;
  private readonly API_BASE_URL = '/quit-plans';

  public static getInstance(): QuitPlanService {
    if (!QuitPlanService.instance) {
      QuitPlanService.instance = new QuitPlanService();
    }
    return QuitPlanService.instance;
  }

  /**
   * Creates a new quit plan for the authenticated member.
   * Tạo kế hoạch bỏ thuốc lá mới cho thành viên đã xác thực.
   * @param requestData The data for creating the quit plan.
   * @returns A Promise that resolves to the created QuitPlanResponseDTO.
   * @throws An Error if the API call fails or returns an error message.
   */
  createQuitPlan = async (requestData: QuitPlanCreateRequestDTO): Promise<QuitPlanResponseDTO> => {
    try {
      console.log("Sending createQuitPlan request:", requestData);
      const response = await axiosConfig.post<ApiResponse<QuitPlanResponseDTO>>(this.API_BASE_URL, requestData);
      console.log("Received createQuitPlan response status:", response.status);
      console.log("Received createQuitPlan response data:", response.data);

      // Backend trả về HttpStatus.CREATED (201) cho thành công
      if (response.status === 201 && response.data && response.data.data) {
        return response.data.data;
      } else {
        // Trường hợp hiếm: HTTP status 2xx nhưng cấu trúc ApiResponse không như mong đợi
        console.error("API returned success status but data field is missing or status is not 201:", response.data);
        throw new Error(response.data.message || "Phản hồi API không hợp lệ.");
      }
    } catch (error: unknown) {
      console.error("Error in createQuitPlan catch block:", error);
      throw new Error(handleApiError(error)); // Sử dụng hàm handleApiError
    }
  };

  /**
   * Fetches all quit plans for the authenticated member.
   * Lấy tất cả kế hoạch bỏ thuốc lá của thành viên đã xác thực.
   * GET /api/quit-plans
   * @returns A Promise that resolves to a list of QuitPlanResponseDTOs.
   */
  getAllQuitPlans = async (): Promise<QuitPlanResponseDTO[]> => {
    try {
      const response = await axiosConfig.get<ApiResponse<QuitPlanResponseDTO[]>>(this.API_BASE_URL);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch all quit plans');
      }
    } catch (error: unknown) {
      console.error('Error fetching all quit plans:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Fetches a specific quit plan by ID for the authenticated member.
   * Lấy một kế hoạch bỏ thuốc lá cụ thể theo ID cho thành viên đã xác thực.
   * GET /api/quit-plans/{quitPlanId}
   * @param quitPlanId The ID of the quit plan.
   * @returns A Promise that resolves to the QuitPlanResponseDTO.
   */
  getQuitPlanById = async (quitPlanId: number): Promise<QuitPlanResponseDTO> => {
    try {
      const response = await axiosConfig.get<ApiResponse<QuitPlanResponseDTO>>(`${this.API_BASE_URL}/${quitPlanId}`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to fetch quit plan with ID: ${quitPlanId}`);
      }
    } catch (error: unknown) {
      console.error(`Error fetching quit plan with ID ${quitPlanId}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Fetches the current active quit plan for the authenticated member.
   * Lấy kế hoạch bỏ thuốc lá hiện tại (IN_PROGRESS) của thành viên đã xác thực.
   * GET /api/quit-plans/current-plan
   * @returns QuitPlanResponseDTO của kế hoạch hiện tại.
   */
  getCurrentQuitPlan = async (): Promise<QuitPlanResponseDTO> => {
    try {
      const response = await axiosConfig.get<ApiResponse<QuitPlanResponseDTO>>(`${this.API_BASE_URL}/current-plan`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch current quit plan');
      }
    } catch (error: unknown) {
      console.error('Error fetching current quit plan:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Updates the current active quit plan for the authenticated member.
   * Cập nhật kế hoạch bỏ thuốc lá hiện tại của thành viên đã xác thực.
   * PATCH /api/quit-plans/current-plan
   * @param requestData Dữ liệu cập nhật.
   * @returns QuitPlanResponseDTO của kế hoạch đã cập nhật.
   */
  updateCurrentQuitPlan = async (requestData: QuitPlanUpdateRequestDTO): Promise<QuitPlanResponseDTO> => {
    try {
      const response = await axiosConfig.patch<ApiResponse<QuitPlanResponseDTO>>(`${this.API_BASE_URL}/current-plan`, requestData);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update current quit plan');
      }
    } catch (error: unknown) {
      console.error('Error updating current quit plan:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Updates a specific quit plan by ID for the authenticated member.
   * Cập nhật thông tin kế hoạch bỏ thuốc lá theo ID (của thành viên đang đăng nhập).
   * PATCH /api/quit-plans/{quitPlanId}
   * @param quitPlanId ID của kế hoạch cần cập nhật.
   * @param requestData Dữ liệu cập nhật.
   * @returns QuitPlanResponseDTO của kế hoạch đã cập nhật.
   */
  updateQuitPlanById = async (quitPlanId: number, requestData: QuitPlanUpdateRequestDTO): Promise<QuitPlanResponseDTO> => {
    try {
      const response = await axiosConfig.patch<ApiResponse<QuitPlanResponseDTO>>(`${this.API_BASE_URL}/${quitPlanId}`, requestData);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to update quit plan with ID: ${quitPlanId}`);
      }
    } catch (error: unknown) {
      console.error(`Error updating quit plan with ID ${quitPlanId}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Allows the authenticated member to give up their current quit plan.
   * Cho phép thành viên đã xác thực từ bỏ kế hoạch bỏ thuốc lá hiện tại của họ.
   * POST /api/quit-plans/giveup/{quitPlanId}
   * @param quitPlanId ID của kế hoạch cần bỏ.
   * @returns QuitPlanResponseDTO của kế hoạch đã được cập nhật trạng thái.
   */
  giveUpQuitPlan = async (quitPlanId: number): Promise<QuitPlanResponseDTO> => {
    try {
      const response = await axiosConfig.post<ApiResponse<QuitPlanResponseDTO>>(`${this.API_BASE_URL}/giveup/${quitPlanId}`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to give up quit plan with ID: ${quitPlanId}`);
      }
    } catch (error: unknown) {
      console.error(`Error giving up quit plan with ID ${quitPlanId}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Resets the status of a quit plan from FAILED to IN_PROGRESS.
   * Đặt lại trạng thái của một kế hoạch từ FAILED sang IN_PROGRESS.
   * POST /api/quit-plans/reset/{quitPlanId}
   * @param quitPlanId ID của kế hoạch cần đặt lại.
   * @returns QuitPlanResponseDTO của kế hoạch đã được đặt lại trạng thái.
   */
  resetQuitPlanStatus = async (quitPlanId: number): Promise<QuitPlanResponseDTO> => {
    try {
      const response = await axiosConfig.post<ApiResponse<QuitPlanResponseDTO>>(`${this.API_BASE_URL}/reset/${quitPlanId}`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to reset quit plan status for ID: ${quitPlanId}`);
      }
    } catch (error: unknown) {
      console.error(`Error resetting quit plan status for ID ${quitPlanId}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  // --- ADMIN ENDPOINTS (Chỉ dành cho SUPER_ADMIN) ---

  /**
   * Fetches all quit plans for admin.
   * Lấy tất cả kế hoạch bỏ thuốc lá (chỉ dành cho admin).
   * GET /api/quit-plans/superadmin/all
   * @returns A Promise that resolves to a list of QuitPlanAdminResponseDTOs.
   */
  getAllQuitPlansForAdmin = async (): Promise<QuitPlanAdminResponseDTO[]> => {
    try {
      const response = await axiosConfig.get<ApiResponse<QuitPlanAdminResponseDTO[]>>(`${this.API_BASE_URL}/superadmin/all`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch all quit plans for admin");
      }
    } catch (error: unknown) {
      console.error('Error fetching all quit plans for admin:', error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Fetches a specific quit plan by ID for admin.
   * Lấy kế hoạch bỏ thuốc lá theo ID (chỉ dành cho admin).
   * GET /api/quit-plans/superadmin/{quitPlanId}
   * @param quitPlanId The ID of the quit plan.
   * @returns A Promise that resolves to the QuitPlanAdminResponseDTO.
   */
  getQuitPlanByIdForAdmin = async (quitPlanId: number): Promise<QuitPlanAdminResponseDTO> => {
    try {
      const response = await axiosConfig.get<ApiResponse<QuitPlanAdminResponseDTO>>(`${this.API_BASE_URL}/superadmin/${quitPlanId}`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to fetch quit plan for admin with ID: ${quitPlanId}`);
      }
    } catch (error: unknown) {
      console.error(`Error fetching quit plan for admin with ID ${quitPlanId}:`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Fetches all quit plans by member ID for admin.
   * Lấy tất cả kế hoạch của thành viên theo ID (chỉ dành cho SUPER_ADMIN).
   * GET /api/quit-plans/superadmin/member/{memberId}
   * @param memberId ID của thành viên.
   * @returns Danh sách QuitPlanAdminResponseDTO.
   */
  getQuitPlansByMemberIdForAdmin = async (memberId: string): Promise<QuitPlanAdminResponseDTO[]> => {
    try {
      const response = await axiosConfig.get<ApiResponse<QuitPlanAdminResponseDTO[]>>(`${this.API_BASE_URL}/superadmin/member/${memberId}`);
      if (response.status === 200 && response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Failed to fetch quit plans for member ID: ${memberId} (admin)`);
      }
    } catch (error: unknown) {
      console.error(`Error fetching quit plans for member ID ${memberId} (admin):`, error);
      throw new Error(handleApiError(error));
    }
  };

  /**
   * Deletes a quit plan by ID for admin.
   * Xóa kế hoạch bỏ thuốc theo ID (Chỉ dành cho SUPER_ADMIN).
   * DELETE /api/quit-plans/superadmin/{quitPlanId}
   * @param quitPlanId ID của kế hoạch cần xóa.
   * @returns A Promise that resolves when the deletion is successful.
   */
  deleteQuitPlanByIdForAdmin = async (quitPlanId: number): Promise<void> => {
    try {
      const response = await axiosConfig.delete<ApiResponse<void>>(`${this.API_BASE_URL}/superadmin/${quitPlanId}`);
      // Backend trả về HttpStatus.NO_CONTENT (204) cho xóa thành công
      if (response.status === 204) {
        return; // Trả về void khi thành công
      } else {
        throw new Error(response.data?.message || `Failed to delete quit plan with ID: ${quitPlanId}`);
      }
    } catch (error: unknown) {
      console.error(`Error deleting quit plan with ID ${quitPlanId}:`, error);
      throw new Error(handleApiError(error));
    }
  };
}

// Create and export singleton instance
export const quitPlanService = QuitPlanService.getInstance();
