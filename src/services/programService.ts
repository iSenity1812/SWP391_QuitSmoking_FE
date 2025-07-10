import axiosInstance from "@/config/axiosConfig"
import type {
    ProgramRequestDTO,
    ProgramUpdateRequestDTO,
    ProgramResponseDTO,
    ProgramSearchParams,
    ProgramAdminParams,
    SpringPageResponse,
    ApiResponse,
    ProgramType,
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

    // Get all programs with search and filter
    async getAllPrograms(params: ProgramSearchParams = {}): Promise<SpringPageResponse<ProgramResponseDTO>> {
        try {
            console.log("ProgramService - getAllPrograms params:", params)

            // Build query parameters
            const queryParams = new URLSearchParams()

            if (params.page !== undefined) queryParams.append("page", params.page.toString())
            if (params.size !== undefined) queryParams.append("size", params.size.toString())
            if (params.sort) queryParams.append("sort", params.sort)
            if (params.direction) queryParams.append("direction", params.direction)
            if (params.keyword) queryParams.append("keyword", params.keyword)
            if (params.programType) {
                queryParams.append("programType", params.programType)
                console.log("ProgramService - Adding programType filter:", params.programType)
            }

            const url = `${this.baseUrl}?${queryParams.toString()}`
            console.log("ProgramService - Final URL:", url)

            const response = await axiosInstance.get<ApiResponse<SpringPageResponse<ProgramResponseDTO>>>(url)
            console.log("ProgramService - API Response:", response.data)

            return response.data.data
        } catch (error: any) {
            console.error("Error fetching programs:", error)
            throw new Error(error.response?.data?.message || "Failed to fetch programs")
        }
    }

    // Get programs by type
    async getProgramsByType(
        programType: string,
        params: ProgramSearchParams = {},
    ): Promise<SpringPageResponse<ProgramResponseDTO>> {
        try {
            const queryParams = new URLSearchParams()

            if (params.page !== undefined) queryParams.append("page", params.page.toString())
            if (params.size !== undefined) queryParams.append("size", params.size.toString())
            if (params.sort) queryParams.append("sort", params.sort)
            if (params.direction) queryParams.append("direction", params.direction)
            if (params.keyword) queryParams.append("keyword", params.keyword)

            const url = `${this.baseUrl}/type/${encodeURIComponent(programType)}?${queryParams.toString()}`
            const response = await axiosInstance.get<ApiResponse<SpringPageResponse<ProgramResponseDTO>>>(url)

            return response.data.data
        } catch (error: any) {
            console.error("Error fetching programs by type:", error)
            throw new Error(error.response?.data?.message || `Failed to fetch programs by type: ${programType}`)
        }
    }

    // Get programs by multiple types
    async getProgramsByMultipleTypes(
        types: string[],
        params: ProgramSearchParams = {},
    ): Promise<SpringPageResponse<ProgramResponseDTO>> {
        try {
            const searchParams = new URLSearchParams()

            // Add pagination params
            if (params.page !== undefined) searchParams.append("page", params.page.toString())
            if (params.size !== undefined) searchParams.append("size", params.size.toString())
            if (params.sort) searchParams.append("sort", params.sort)
            if (params.direction) searchParams.append("direction", params.direction)

            // Add types as multiple query params
            types.forEach((type) => searchParams.append("types", type))

            const response = await axiosInstance.get<ApiResponse<SpringPageResponse<ProgramResponseDTO>>>(
                `${this.baseUrl}/types/multiple?${searchParams.toString()}`,
            )

            return response.data.data
        } catch (error) {
            console.error("Error fetching programs by multiple types:", error)
            throw new Error("Failed to fetch programs by multiple types")
        }
    }

    // Get all program types
    async getAllProgramTypes(): Promise<ProgramType[]> {
        try {
            const response = await axiosInstance.get<ApiResponse<ProgramType[]>>(`${this.baseUrl}/types`)
            return response.data.data
        } catch (error) {
            console.error("Error fetching program types:", error)
            throw new Error("Failed to fetch program types")
        }
    }

    // Get program by ID
    async getProgramById(id: number): Promise<ProgramResponseDTO> {
        try {
            const response = await axiosInstance.get<ApiResponse<ProgramResponseDTO>>(`${this.baseUrl}/${id}`)
            return response.data.data
        } catch (error: any) {
            console.error("Error fetching program by ID:", error)
            throw new Error(error.response?.data?.message || "Failed to fetch program")
        }
    }

    // Create new program
    async createProgram(programData: ProgramRequestDTO): Promise<ProgramResponseDTO> {
        try {
            const formData = this.createFormData(programData)

            const response = await axiosInstance.post<ApiResponse<ProgramResponseDTO>>(this.baseUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            return response.data.data
        } catch (error: any) {
            console.error("Error creating program:", error)
            throw new Error(error.response?.data?.message || "Failed to create program")
        }
    }

    // Update program
    async updateProgram(id: number, programData: ProgramUpdateRequestDTO): Promise<ProgramResponseDTO> {
        try {
            const formData = this.createFormData(programData)

            const response = await axiosInstance.put<ApiResponse<ProgramResponseDTO>>(`${this.baseUrl}/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            return response.data.data
        } catch (error: any) {
            console.error("Error updating program:", error)
            throw new Error(error.response?.data?.message || "Failed to update program")
        }
    }

    // Delete program
    async deleteProgram(id: number): Promise<void> {
        try {
            await axiosInstance.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
        } catch (error: any) {
            console.error("Error deleting program:", error)
            throw new Error(error.response?.data?.message || "Failed to delete program")
        }
    }

    // Admin: Get programs by creator
    async getProgramsByCreator(params: ProgramAdminParams): Promise<SpringPageResponse<ProgramResponseDTO>> {
        try {
            if (!params.creatorId) {
                throw new Error("Creator ID is required")
            }

            const queryParams = new URLSearchParams()

            if (params.page !== undefined) queryParams.append("page", params.page.toString())
            if (params.size !== undefined) queryParams.append("size", params.size.toString())
            if (params.sort) queryParams.append("sort", params.sort)
            if (params.direction) queryParams.append("direction", params.direction)

            const response = await axiosInstance.get<ApiResponse<SpringPageResponse<ProgramResponseDTO>>>(
                `${this.baseUrl}/creator/${params.creatorId}?${queryParams.toString()}`,
            )
            return response.data.data
        } catch (error: any) {
            console.error("Error fetching programs by creator:", error)
            throw new Error(error.response?.data?.message || "Failed to fetch programs by creator")
        }
    }

    // Admin: Count programs by creator
    async countProgramsByCreator(creatorId: string): Promise<number> {
        try {
            const response = await axiosInstance.get<ApiResponse<number>>(`${this.baseUrl}/creator/${creatorId}/count`)
            return response.data.data
        } catch (error) {
            console.error("Error counting programs by creator:", error)
            throw new Error("Failed to count programs by creator")
        }
    }
}

export const programService = new ProgramService()
export default programService
