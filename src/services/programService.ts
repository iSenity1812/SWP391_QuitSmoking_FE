import axiosInstance from "@/config/axiosConfig"
import type {
    ProgramRequestDTO,
    ProgramUpdateRequestDTO,
    ProgramResponseDTO,
    SpringPageResponse,
    ApiResponse,
    ProgramSearchParams,
    ProgramAdminParams,
} from "@/types/program"

class ProgramService {
    private readonly baseUrl = "/programs"

    // Validate image file
    private validateImageFile(file: File): boolean {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
        const maxSize = 5 * 1024 * 1024 // 5MB

        if (!allowedTypes.includes(file.type)) {
            throw new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.")
        }

        if (file.size > maxSize) {
            throw new Error("File size too large. Maximum size is 5MB.")
        }

        return true
    }

    // Create FormData for multipart requests
    private createFormData(data: ProgramRequestDTO | ProgramUpdateRequestDTO): FormData {
        const formData = new FormData()

        formData.append("programTitle", data.programTitle)

        if (data.programName) {
            formData.append("programName", data.programName)
        }

        if (data.programType) {
            formData.append("programType", data.programType)
        }

        if (data.contentUrl) {
            formData.append("contentUrl", data.contentUrl)
        }

        if (data.description) {
            formData.append("description", data.description)
        }

        if (data.programImage && data.programImage instanceof File) {
            this.validateImageFile(data.programImage)
            formData.append("programImage", data.programImage)
        }

        // For update requests
        if ("removeImage" in data && data.removeImage !== undefined) {
            formData.append("removeImage", data.removeImage.toString())
        }

        return formData
    }

    // Get all programs with search and pagination
    async getAllPrograms(params: ProgramSearchParams = {}): Promise<SpringPageResponse<ProgramResponseDTO>> {
        const searchParams = new URLSearchParams()

        if (params.keyword) searchParams.append("keyword", params.keyword)
        if (params.page !== undefined) searchParams.append("page", params.page.toString())
        if (params.size !== undefined) searchParams.append("size", params.size.toString())
        if (params.sort) searchParams.append("sort", params.sort)
        if (params.direction) searchParams.append("direction", params.direction)

        const response = await axiosInstance.get<ApiResponse<SpringPageResponse<ProgramResponseDTO>>>(
            `${this.baseUrl}?${searchParams.toString()}`,
        )

        return response.data.data
    }

    // Get program by ID
    async getProgramById(id: number): Promise<ProgramResponseDTO> {
        const response = await axiosInstance.get<ApiResponse<ProgramResponseDTO>>(`${this.baseUrl}/${id}`)

        return response.data.data
    }

    // Get programs by type
    async getProgramsByType(
        programType: string,
        params: ProgramSearchParams = {},
    ): Promise<SpringPageResponse<ProgramResponseDTO>> {
        const searchParams = new URLSearchParams()

        if (params.page !== undefined) searchParams.append("page", params.page.toString())
        if (params.size !== undefined) searchParams.append("size", params.size.toString())
        if (params.sort) searchParams.append("sort", params.sort)
        if (params.direction) searchParams.append("direction", params.direction)

        const response = await axiosInstance.get<ApiResponse<SpringPageResponse<ProgramResponseDTO>>>(
            `${this.baseUrl}/type/${encodeURIComponent(programType)}?${searchParams.toString()}`,
        )

        return response.data.data
    }

    // Create new program
    async createProgram(programData: ProgramRequestDTO): Promise<ProgramResponseDTO> {
        const formData = this.createFormData(programData)

        const response = await axiosInstance.post<ApiResponse<ProgramResponseDTO>>(this.baseUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

        return response.data.data
    }

    // Update program
    async updateProgram(id: number, programData: ProgramUpdateRequestDTO): Promise<ProgramResponseDTO> {
        const formData = this.createFormData(programData)

        const response = await axiosInstance.put<ApiResponse<ProgramResponseDTO>>(`${this.baseUrl}/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

        return response.data.data
    }

    // Delete program
    async deleteProgram(id: number): Promise<void> {
        await axiosInstance.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
    }

    // Admin: Get programs by creator
    async getProgramsByCreator(params: ProgramAdminParams): Promise<SpringPageResponse<ProgramResponseDTO>> {
        if (!params.creatorId) {
            throw new Error("Creator ID is required")
        }

        const searchParams = new URLSearchParams()

        if (params.page !== undefined) searchParams.append("page", params.page.toString())
        if (params.size !== undefined) searchParams.append("size", params.size.toString())
        if (params.sort) searchParams.append("sort", params.sort)
        if (params.direction) searchParams.append("direction", params.direction)

        const response = await axiosInstance.get<ApiResponse<SpringPageResponse<ProgramResponseDTO>>>(
            `${this.baseUrl}/creator/${params.creatorId}?${searchParams.toString()}`,
        )

        return response.data.data
    }

    // Admin: Count programs by creator
    async countProgramsByCreator(creatorId: string): Promise<number> {
        const response = await axiosInstance.get<ApiResponse<number>>(`${this.baseUrl}/creator/${creatorId}/count`)

        return response.data.data
    }
}

export const programService = new ProgramService()
export default programService
