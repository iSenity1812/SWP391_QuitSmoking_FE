import axiosConfig from "../config/axiosConfig"
import type {
    ApiResponse,
    QuizResponseDTO,
    TipResponseDTO,
    QuizCreationRequestDTO,
    TipCreationRequestDTO
} from "@/types/task"

export class TaskService {
    private static readonly BASE_PATH = "/task"

    /**
     * Get all quizzes for admin - REQUIRES CONTENT_ADMIN
     */
    static async getAllQuizzes(): Promise<QuizResponseDTO[]> {
        try {
            console.log("Fetching all quizzes for admin from:", `${axiosConfig.defaults.baseURL}${this.BASE_PATH}/quizzes`)

            const response = await axiosConfig.get<ApiResponse<QuizResponseDTO[]>>(`${this.BASE_PATH}/quizzes`)

            console.log("Raw quizzes response:", response.data)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to get quizzes")
            }

            const quizzes = response.data.data || []
            console.log("Fetched quizzes:", quizzes)
            return quizzes
        } catch (error: any) {
            console.error("Error fetching quizzes:", error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền xem danh sách quiz. Chỉ Content Admin mới có thể xem.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Get quiz by ID - REQUIRES CONTENT_ADMIN
     */
    static async getQuizById(quizId: string): Promise<QuizResponseDTO> {
        try {
            console.log(`Fetching quiz ${quizId}`)

            const response = await axiosConfig.get<ApiResponse<QuizResponseDTO>>(`${this.BASE_PATH}/quizzes/${quizId}`)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to get quiz")
            }

            const quiz = response.data.data
            if (!quiz) {
                throw new Error("Quiz not found")
            }

            return quiz
        } catch (error: any) {
            console.error(`Error fetching quiz ${quizId}:`, error)

            if (error.response) {
                if (error.response.status === 404) {
                    throw new Error("Quiz không tồn tại.")
                }

                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền xem quiz này.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Get all tips for admin - REQUIRES CONTENT_ADMIN
     */
    static async getAllTips(): Promise<TipResponseDTO[]> {
        try {
            console.log("Fetching all tips for admin from:", `${axiosConfig.defaults.baseURL}${this.BASE_PATH}/tips`)

            const response = await axiosConfig.get<ApiResponse<TipResponseDTO[]>>(`${this.BASE_PATH}/tips`)

            console.log("Raw tips response:", response.data)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to get tips")
            }

            const tips = response.data.data || []
            console.log("Fetched tips:", tips)
            return tips
        } catch (error: any) {
            console.error("Error fetching tips:", error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền xem danh sách tip. Chỉ Content Admin mới có thể xem.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Get tip by ID - REQUIRES CONTENT_ADMIN
     */
    static async getTipById(tipId: string): Promise<TipResponseDTO> {
        try {
            console.log(`Fetching tip ${tipId}`)

            const response = await axiosConfig.get<ApiResponse<TipResponseDTO>>(`${this.BASE_PATH}/tips/${tipId}`)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to get tip")
            }

            const tip = response.data.data
            if (!tip) {
                throw new Error("Tip not found")
            }

            return tip
        } catch (error: any) {
            console.error(`Error fetching tip ${tipId}:`, error)

            if (error.response) {
                if (error.response.status === 404) {
                    throw new Error("Tip không tồn tại.")
                }

                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền xem tip này.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Create quiz - REQUIRES CONTENT_ADMIN
     */
    static async createQuiz(quizData: QuizCreationRequestDTO): Promise<QuizResponseDTO> {
        try {
            console.log("Creating quiz:", quizData)
            console.log("Request options:", JSON.stringify(quizData.options, null, 2))

            // Transform frontend 'correct' to backend 'isCorrect'
            const backendData = {
                ...quizData,
                options: quizData.options.map(opt => ({
                    content: opt.content,
                    isCorrect: opt.correct
                }))
            }

            const response = await axiosConfig.post<ApiResponse<QuizResponseDTO>>(`${this.BASE_PATH}/admin/quizzes`, backendData)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to create quiz")
            }

            const quiz = response.data.data
            console.log("Created quiz:", quiz)
            return quiz
        } catch (error: any) {
            console.error("Error creating quiz:", error)

            // Log detailed error response for debugging
            if (error.response) {
                console.error("Error response data:", error.response.data)
                console.error("Error response status:", error.response.status)
            }

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền tạo quiz. Chỉ Content Admin mới có thể tạo quiz.")
                }

                if (error.response.status === 400) {
                    const errorMsg = error.response.data?.message || "Dữ liệu quiz không hợp lệ. Vui lòng kiểm tra lại."
                    throw new Error(`Backend validation error: ${errorMsg}`)
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Update quiz - REQUIRES CONTENT_ADMIN
     */
    static async updateQuiz(quizId: string, quizData: QuizCreationRequestDTO): Promise<QuizResponseDTO> {
        try {
            console.log(`Updating quiz ${quizId}:`, quizData)
            console.log("Request options:", JSON.stringify(quizData.options, null, 2))

            // Transform frontend 'correct' to backend 'isCorrect'
            const backendData = {
                ...quizData,
                options: quizData.options.map(opt => ({
                    content: opt.content,
                    isCorrect: opt.correct
                }))
            }

            const response = await axiosConfig.put<ApiResponse<QuizResponseDTO>>(
                `${this.BASE_PATH}/admin/quizzes/${quizId}`,
                backendData,
            )

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to update quiz")
            }

            const quiz = response.data.data
            console.log("Updated quiz:", quiz)
            return quiz
        } catch (error: any) {
            console.error(`Error updating quiz ${quizId}:`, error)

            // Log detailed error response for debugging
            if (error.response) {
                console.error("Error response data:", error.response.data)
                console.error("Error response status:", error.response.status)
            }

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền cập nhật quiz. Chỉ Content Admin mới có thể cập nhật quiz.")
                }

                if (error.response.status === 404) {
                    throw new Error("Quiz không tồn tại.")
                }

                if (error.response.status === 400) {
                    const errorMsg = error.response.data?.message || "Dữ liệu quiz không hợp lệ. Vui lòng kiểm tra lại."
                    throw new Error(`Backend validation error: ${errorMsg}`)
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Delete quiz - REQUIRES CONTENT_ADMIN
     */
    static async deleteQuiz(quizId: string): Promise<void> {
        try {
            console.log(`Deleting quiz ${quizId}`)

            const response = await axiosConfig.delete<ApiResponse<void>>(`${this.BASE_PATH}/admin/quizzes/${quizId}`)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to delete quiz")
            }

            console.log(`Quiz ${quizId} deleted successfully`)
        } catch (error: any) {
            console.error(`Error deleting quiz ${quizId}:`, error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền xóa quiz. Chỉ Content Admin mới có thể xóa quiz.")
                }

                if (error.response.status === 404) {
                    throw new Error("Quiz không tồn tại.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Create tip by user - REQUIRES AUTH (MEMBER/COACH)
     */
    static async createTipByUser(tipData: TipCreationRequestDTO): Promise<TipResponseDTO> {
        try {
            console.log("Creating tip by user:", tipData)

            const response = await axiosConfig.post<ApiResponse<TipResponseDTO>>(`${this.BASE_PATH}/tips`, tipData)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to create tip")
            }

            const tip = response.data.data
            console.log("Created tip:", tip)
            return tip
        } catch (error: any) {
            console.error("Error creating tip:", error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền tạo tip.")
                }

                if (error.response.status === 400) {
                    throw new Error(error.response.data?.message || "Dữ liệu tip không hợp lệ. Vui lòng kiểm tra lại.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Create tip by admin - REQUIRES CONTENT_ADMIN
     */
    static async createTipByAdmin(tipData: TipCreationRequestDTO): Promise<TipResponseDTO> {
        try {
            console.log("Creating tip by admin:", tipData)

            const response = await axiosConfig.post<ApiResponse<TipResponseDTO>>(`${this.BASE_PATH}/admin/tips`, tipData)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to create tip")
            }

            const tip = response.data.data
            console.log("Created tip:", tip)
            return tip
        } catch (error: any) {
            console.error("Error creating tip:", error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền tạo tip. Chỉ Content Admin mới có thể tạo tip.")
                }

                if (error.response.status === 400) {
                    throw new Error(error.response.data?.message || "Dữ liệu tip không hợp lệ. Vui lòng kiểm tra lại.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Update tip - REQUIRES CONTENT_ADMIN
     */
    static async updateTip(tipId: string, tipData: TipCreationRequestDTO): Promise<TipResponseDTO> {
        try {
            console.log(`Updating tip ${tipId}:`, tipData)

            const response = await axiosConfig.put<ApiResponse<TipResponseDTO>>(
                `${this.BASE_PATH}/admin/tips/${tipId}`,
                tipData,
            )

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to update tip")
            }

            const tip = response.data.data
            console.log("Updated tip:", tip)
            return tip
        } catch (error: any) {
            console.error(`Error updating tip ${tipId}:`, error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền cập nhật tip. Chỉ Content Admin mới có thể cập nhật tip.")
                }

                if (error.response.status === 404) {
                    throw new Error("Tip không tồn tại.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Delete tip - REQUIRES CONTENT_ADMIN
     */
    static async deleteTip(tipId: string): Promise<void> {
        try {
            console.log(`Deleting tip ${tipId}`)

            const response = await axiosConfig.delete<ApiResponse<void>>(`${this.BASE_PATH}/admin/tips/${tipId}`)

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to delete tip")
            }

            console.log(`Tip ${tipId} deleted successfully`)
        } catch (error: any) {
            console.error(`Error deleting tip ${tipId}:`, error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền xóa tip. Chỉ Content Admin mới có thể xóa tip.")
                }

                if (error.response.status === 404) {
                    throw new Error("Tip không tồn tại.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            throw error
        }
    }

    /**
     * Import quizzes from Excel file - REQUIRES CONTENT_ADMIN  
     */
    static async importQuizzes(file: File): Promise<void> {
        try {
            console.log("Importing quizzes from Excel file:", file.name)

            const formData = new FormData()
            formData.append('file', file)

            const response = await axiosConfig.post<ApiResponse<void>>(
                `${this.BASE_PATH}/admin/quizzes/import`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            if (!response.data.success && response.data.status && response.data.status >= 400) {
                throw new Error(response.data.message || "Failed to import quizzes")
            }

            console.log("Quizzes imported successfully")
        } catch (error: unknown) {
            console.error("Error importing quizzes:", error)

            if (error && typeof error === 'object' && 'response' in error) {
                const response = (error as { response?: { status?: number; data?: { message?: string } } }).response
                if (response) {
                    if (response.status === 403) {
                        throw new Error("Bạn không có quyền import quiz. Chỉ Content Admin mới có thể import quiz.")
                    }

                    if (response.status === 400) {
                        throw new Error("File không hợp lệ hoặc định dạng không đúng.")
                    }

                    if (response.data?.message) {
                        throw new Error(`Backend error: ${response.data.message}`)
                    }
                }
            }

            throw error instanceof Error ? error : new Error('Có lỗi xảy ra khi import quiz')
        }
    }
}

// Export instance for backward compatibility
export const taskService = {
    getAllQuizzes: () => TaskService.getAllQuizzes(),
    getQuizById: (quizId: string) => TaskService.getQuizById(quizId),
    getAllTips: () => TaskService.getAllTips(),
    getTipById: (tipId: string) => TaskService.getTipById(tipId),
    createQuiz: (quizData: QuizCreationRequestDTO) => TaskService.createQuiz(quizData),
    updateQuiz: (quizId: string, quizData: QuizCreationRequestDTO) => TaskService.updateQuiz(quizId, quizData),
    deleteQuiz: (quizId: string) => TaskService.deleteQuiz(quizId),
    createTipByUser: (tipData: TipCreationRequestDTO) => TaskService.createTipByUser(tipData),
    createTipByAdmin: (tipData: TipCreationRequestDTO) => TaskService.createTipByAdmin(tipData),
    updateTip: (tipId: string, tipData: TipCreationRequestDTO) => TaskService.updateTip(tipId, tipData),
    deleteTip: (tipId: string) => TaskService.deleteTip(tipId),
    importQuizzes: (file: File) => TaskService.importQuizzes(file),
}
