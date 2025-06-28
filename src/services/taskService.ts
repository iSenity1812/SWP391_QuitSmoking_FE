import axiosConfig from "../config/axiosConfig"
import type { ApiResponse, Task, QuizAttemptRequest, QuizAttemptResponse } from "@/types/task"

export class TaskService {
    private static readonly BASE_PATH = "/task"
    private static readonly ADMIN_PATH = "/admin"

    /**
     * Generate a random craving task - REQUIRES AUTH (MEMBER/COACH)
     */
    static async generateRandomTask(): Promise<Task> {
        try {
            console.log(
                "Generating random task from:",
                `${axiosConfig.defaults.baseURL}/api${this.BASE_PATH}/generate-random`,
            )

            const response = await axiosConfig.post<ApiResponse<Task>>(`/api${this.BASE_PATH}/generate-random`)

            console.log("Raw task response:", response.data)

            if (response.data.status !== 201) {
                throw new Error(response.data.message || "Failed to generate random task")
            }

            const task = response.data.data
            if (!task) {
                throw new Error("No task data in response")
            }

            console.log("Generated task:", task)
            return task
        } catch (error: any) {
            console.error("Error generating random task:", error)

            if (error.response) {
                console.error("Response error:", error.response.status, error.response.data)

                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền tạo task. Chỉ thành viên và huấn luyện viên mới có thể tạo task.")
                }

                if (error.response.status === 404) {
                    throw new Error("Endpoint /api/task/generate-random không tồn tại. Vui lòng kiểm tra backend.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            if (error.code === "ERR_NETWORK") {
                throw new Error("Không thể kết nối tới backend. Vui lòng kiểm tra backend có đang chạy không.")
            }

            throw error
        }
    }

    /**
     * Submit quiz attempt - REQUIRES AUTH (MEMBER/COACH)
     */
    static async submitQuizAttempt(request: QuizAttemptRequest): Promise<QuizAttemptResponse> {
        try {
            console.log("Submitting quiz attempt:", request)
            console.log("Submit URL:", `${axiosConfig.defaults.baseURL}/api${this.BASE_PATH}/submit-quiz`)

            const response = await axiosConfig.post<ApiResponse<QuizAttemptResponse>>(
                `/api${this.BASE_PATH}/submit-quiz`,
                request,
            )

            console.log("Raw quiz attempt response:", response.data)

            if (response.data.status !== 200) {
                throw new Error(response.data.message || "Failed to submit quiz attempt")
            }

            const result = response.data.data
            if (!result) {
                throw new Error("No result data in response")
            }

            console.log("Quiz attempt result:", result)
            return result
        } catch (error: any) {
            console.error("Error submitting quiz attempt:", error)

            if (error.response) {
                console.error("Response error:", error.response.status, error.response.data)

                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền nộp bài quiz. Chỉ thành viên và huấn luyện viên mới có thể nộp bài.")
                }

                if (error.response.status === 404) {
                    throw new Error("Task hoặc Quiz không tồn tại.")
                }

                if (error.response.status === 400) {
                    throw new Error(error.response.data?.message || "Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại.")
                }

                if (error.response.data?.message) {
                    throw new Error(`Backend error: ${error.response.data.message}`)
                }
            }

            if (error.code === "ERR_NETWORK") {
                throw new Error("Không thể kết nối tới backend. Vui lòng kiểm tra backend có đang chạy không.")
            }

            throw error
        }
    }

    /**
     * Get all quizzes for admin - REQUIRES CONTENT_ADMIN
     */
    static async getAllQuizzes(): Promise<any[]> {
        try {
            console.log(
                "Fetching all quizzes for admin from:",
                `${axiosConfig.defaults.baseURL}/api${this.BASE_PATH}/quizzes`,
            )

            const response = await axiosConfig.get<ApiResponse<any[]>>(`/api${this.BASE_PATH}/quizzes`)

            console.log("Raw quizzes response:", response.data)

            if (response.data.status !== 200) {
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
    static async getQuizById(quizId: string): Promise<any> {
        try {
            console.log(`Fetching quiz ${quizId}`)

            const response = await axiosConfig.get<ApiResponse<any>>(`/api${this.BASE_PATH}/quizzes/${quizId}`)

            if (response.data.status !== 200) {
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
    static async getAllTips(): Promise<any[]> {
        try {
            console.log(
                "Fetching all tips for admin from:",
                `${axiosConfig.defaults.baseURL}/api${this.BASE_PATH}${this.ADMIN_PATH}/tips`,
            )

            const response = await axiosConfig.get<ApiResponse<any[]>>(`/api${this.BASE_PATH}${this.ADMIN_PATH}/tips`)

            console.log("Raw tips response:", response.data)

            if (response.data.status !== 200) {
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
    static async getTipById(tipId: string): Promise<any> {
        try {
            console.log(`Fetching tip ${tipId}`)

            const response = await axiosConfig.get<ApiResponse<any>>(`/api${this.BASE_PATH}/tips/${tipId}`)

            if (response.data.status !== 200) {
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
    static async createQuiz(quizData: any): Promise<any> {
        try {
            console.log("Creating quiz:", quizData)

            const response = await axiosConfig.post<ApiResponse<any>>(
                `/api${this.BASE_PATH}${this.ADMIN_PATH}/quizzes`,
                quizData,
            )

            if (response.data.status !== 201) {
                throw new Error(response.data.message || "Failed to create quiz")
            }

            const quiz = response.data.data
            console.log("Created quiz:", quiz)
            return quiz
        } catch (error: any) {
            console.error("Error creating quiz:", error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền tạo quiz. Chỉ Content Admin mới có thể tạo quiz.")
                }

                if (error.response.status === 400) {
                    throw new Error(error.response.data?.message || "Dữ liệu quiz không hợp lệ. Vui lòng kiểm tra lại.")
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
    static async updateQuiz(quizId: string, quizData: any): Promise<any> {
        try {
            console.log(`Updating quiz ${quizId}:`, quizData)

            const response = await axiosConfig.put<ApiResponse<any>>(
                `/api${this.BASE_PATH}${this.ADMIN_PATH}/quizzes/${quizId}`,
                quizData,
            )

            if (response.data.status !== 200) {
                throw new Error(response.data.message || "Failed to update quiz")
            }

            const quiz = response.data.data
            console.log("Updated quiz:", quiz)
            return quiz
        } catch (error: any) {
            console.error(`Error updating quiz ${quizId}:`, error)

            if (error.response) {
                if (error.response.status === 403) {
                    throw new Error("Bạn không có quyền cập nhật quiz. Chỉ Content Admin mới có thể cập nhật quiz.")
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
     * Delete quiz - REQUIRES CONTENT_ADMIN
     */
    static async deleteQuiz(quizId: string): Promise<void> {
        try {
            console.log(`Deleting quiz ${quizId}`)

            const response = await axiosConfig.delete<ApiResponse<void>>(
                `/api${this.BASE_PATH}${this.ADMIN_PATH}/quizzes/${quizId}`,
            )

            if (response.data.status !== 200) {
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
     * Create tip - REQUIRES AUTH (MEMBER/COACH/ADMIN)
     */
    static async createTip(tipData: any): Promise<any> {
        try {
            console.log("Creating tip:", tipData)

            const response = await axiosConfig.post<ApiResponse<any>>(`/api${this.BASE_PATH}/tips`, tipData)

            if (response.data.status !== 201) {
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
     * Update tip - REQUIRES CONTENT_ADMIN
     */
    static async updateTip(tipId: string, tipData: any): Promise<any> {
        try {
            console.log(`Updating tip ${tipId}:`, tipData)

            const response = await axiosConfig.put<ApiResponse<any>>(
                `/api${this.BASE_PATH}${this.ADMIN_PATH}/tips/${tipId}`,
                tipData,
            )

            if (response.data.status !== 200) {
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

            const response = await axiosConfig.delete<ApiResponse<void>>(
                `/api${this.BASE_PATH}${this.ADMIN_PATH}/tips/${tipId}`,
            )

            if (response.data.status !== 200) {
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
}

// Export instance for backward compatibility
export const taskService = {
    generateRandomTask: () => TaskService.generateRandomTask(),
    submitQuizAttempt: (request: QuizAttemptRequest) => TaskService.submitQuizAttempt(request),
}
