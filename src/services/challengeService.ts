import axiosConfig from "../config/axiosConfig"
import type { ApiResponse, ChallengeRequest, ChallengeResponse } from "../types/challenge"
export class ChallengeService {
    private static readonly BASE_PATH = "/challenges"
    private static readonly MY_PATH = "/my-challenges"

    /**
     * Create a new challenge - REQUIRES PREMIUM_MEMBER
     */
    static async createChallenge(challengeData: ChallengeRequest): Promise<ChallengeResponse> {
        try {
            console.log("Creating challenge with data:", challengeData)
            console.log("Request URL:", `${axiosConfig.defaults.baseURL}${this.BASE_PATH}`)

            // Log token info
            const token = localStorage.getItem("jwt_token")
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]))
                    console.log("Token payload:", payload)
                    console.log("User ID from token:", payload.userId)
                    console.log("Role from token:", payload.role)
                } catch (e) {
                    console.error("Error parsing token:", e)
                }
            }

            // Validate data before sending
            if (!challengeData.challengeName || challengeData.challengeName.trim() === "") {
                throw new Error("Tên thử thách không được để trống")
            }
            if (!challengeData.endDate) {
                throw new Error("Ngày kết thúc không được để trống")
            }
            if (!challengeData.targetValue || challengeData.targetValue <= 0) {
                throw new Error("Giá trị mục tiêu phải lớn hơn 0")
            }
            if (!challengeData.unit || challengeData.unit.trim() === "") {
                throw new Error("Đơn vị không được để trống")
            }

            const response = await axiosConfig.post<ApiResponse<ChallengeResponse>>(this.BASE_PATH, challengeData)

            console.log("Raw create challenge response:", response)
            console.log("Response status:", response.status)
            console.log("Response data:", response.data)

            if (response.data.status !== 201 && !response.data.data) {
                throw new Error(response.data.message || "Không thể tạo thử thách")
            }

            return response.data.data
        } catch (error: any) {
            console.error("Error creating challenge:", error)
            console.error("Error details:", {
                message: error.message,
                response: error.response,
                request: error.request,
                config: error.config,
            })
            throw this.handleError(error)
        }
    }

    /**
     * Get all challenges for current user - REQUIRES AUTH
     */
    static async getMyChallenges(): Promise<ChallengeResponse[]> {
        try {
            console.log("Fetching my challenges from:", `${axiosConfig.defaults.baseURL}${this.BASE_PATH}${this.MY_PATH}`)

            const response = await axiosConfig.get<ApiResponse<ChallengeResponse[]>>(`${this.BASE_PATH}${this.MY_PATH}`)

            console.log("Raw my challenges response:", response.data)

            if (response.data.status !== 200 && !response.data.data) {
                throw new Error(response.data.message || "Không thể tải danh sách thử thách")
            }

            return response.data.data || []
        } catch (error: any) {
            console.error("Error fetching my challenges:", error)
            throw this.handleError(error)
        }
    }

    /**
     * Get challenge by ID - REQUIRES AUTH
     */
    static async getChallengeById(challengeId: number): Promise<ChallengeResponse> {
        try {
            console.log(`Fetching challenge ${challengeId}`)

            const response = await axiosConfig.get<ApiResponse<ChallengeResponse>>(`${this.BASE_PATH}/${challengeId}`)

            console.log("Raw challenge by ID response:", response.data)

            if (response.data.status !== 200 && !response.data.data) {
                throw new Error(response.data.message || "Không thể tải thông tin thử thách")
            }

            return response.data.data
        } catch (error: any) {
            console.error(`Error fetching challenge ${challengeId}:`, error)
            throw this.handleError(error)
        }
    }

    /**
     * Update challenge - REQUIRES AUTH (owner only)
     */
    static async updateChallenge(challengeId: number, challengeData: ChallengeRequest): Promise<ChallengeResponse> {
        try {
            console.log(`Updating challenge ${challengeId}:`, challengeData)

            const response = await axiosConfig.put<ApiResponse<ChallengeResponse>>(
                `${this.BASE_PATH}/${challengeId}`,
                challengeData,
            )

            console.log("Raw update challenge response:", response.data)

            if (response.data.status !== 200 && !response.data.data) {
                throw new Error(response.data.message || "Không thể cập nhật thử thách")
            }

            return response.data.data
        } catch (error: any) {
            console.error(`Error updating challenge ${challengeId}:`, error)
            throw this.handleError(error)
        }
    }

    /**
     * Delete challenge - REQUIRES AUTH (owner only)
     */
    static async deleteChallenge(challengeId: number): Promise<void> {
        try {
            console.log(`Deleting challenge ${challengeId}`)

            const response = await axiosConfig.delete<ApiResponse<void>>(`${this.BASE_PATH}/${challengeId}`)

            console.log("Raw delete challenge response:", response.data)

            if (response.data.status !== 204 && response.data.status !== 200) {
                throw new Error(response.data.message || "Không thể xóa thử thách")
            }
        } catch (error: any) {
            console.error(`Error deleting challenge ${challengeId}:`, error)
            throw this.handleError(error)
        }
    }

    /**
     * Get challenges by status - REQUIRES AUTH
     */
    static async getChallengesByStatus(status: string): Promise<ChallengeResponse[]> {
        try {
            const allChallenges = await this.getMyChallenges()
            return allChallenges.filter((challenge) => challenge.status === status)
        } catch (error: any) {
            console.error(`Error fetching challenges by status ${status}:`, error)
            throw error
        }
    }

    /**
     * Search challenges by name - REQUIRES AUTH
     */
    static async searchChallenges(query: string): Promise<ChallengeResponse[]> {
        try {
            const allChallenges = await this.getMyChallenges()
            const lowercaseQuery = query.toLowerCase()
            return allChallenges.filter(
                (challenge) =>
                    challenge.challengeName.toLowerCase().includes(lowercaseQuery) ||
                    (challenge.description && challenge.description.toLowerCase().includes(lowercaseQuery)),
            )
        } catch (error: any) {
            console.error(`Error searching challenges with query "${query}":`, error)
            throw error
        }
    }

    /**
     * Handle API errors
     */
    private static handleError(error: any): Error {
        if (error.response) {
            console.error("Response error details:", {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers,
            })

            // Handle specific HTTP status codes
            if (error.response.status === 500) {
                console.error("Server error details:", error.response.data)
                return new Error(
                    "Lỗi máy chủ nội bộ. Vui lòng kiểm tra: 1) Kết nối database, 2) Cấu hình server, 3) Dữ liệu gửi lên có đúng format không",
                )
            }

            if (error.response.status === 404) {
                // Handle user not found specifically
                if (error.response.data?.error?.includes("Không tìm thấy thành viên")) {
                    return new Error("Tài khoản không tồn tại trong hệ thống. Vui lòng đăng xuất và đăng nhập lại.")
                }
                return new Error("Endpoint không tồn tại. Vui lòng kiểm tra URL API.")
            }

            if (error.response.status === 403) {
                return new Error("Bạn không có quyền thực hiện thao tác này. Chỉ Premium Member mới có thể tạo thử thách.")
            }

            if (error.response.status === 401) {
                return new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
            }

            if (error.response.status === 400) {
                // Handle validation errors
                if (error.response.data?.error && typeof error.response.data.error === "object") {
                    const validationErrors = Object.values(error.response.data.error).join(", ")
                    return new Error(`Dữ liệu không hợp lệ: ${validationErrors}`)
                }
                return new Error(error.response.data?.message || "Dữ liệu gửi lên không hợp lệ.")
            }

            // Handle backend error messages
            if (error.response.data?.message) {
                return new Error(error.response.data.message)
            }

            if (error.response.data?.error) {
                return new Error(error.response.data.error)
            }
        }

        // Handle network errors
        if (error.code === "ERR_NETWORK") {
            return new Error(
                "Không thể kết nối tới server. Vui lòng kiểm tra: 1) Server có đang chạy không, 2) URL có đúng không, 3) Kết nối mạng",
            )
        }

        // Handle timeout errors
        if (error.code === "ECONNABORTED") {
            return new Error("Yêu cầu bị timeout. Vui lòng thử lại.")
        }

        // Default error
        if (error.message) {
            return new Error(error.message)
        }

        return new Error("Đã xảy ra lỗi không xác định")
    }
}
