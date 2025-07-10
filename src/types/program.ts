export interface ProgramUser {
    userId: string
    username: string
    email: string
    fullName?: string
    avatar?: string
}

export interface Program {
    programId: number
    programTitle: string
    programName?: string
    programType?: string
    programImage?: string
    contentUrl?: string
    description?: string
    createdAt: string
    updatedAt: string
    createdBy: ProgramUser
}

export interface ProgramRequestDTO {
    programTitle: string
    programName?: string
    programType?: string
    programImage?: File
    contentUrl?: string
    description?: string
}

export interface ProgramUpdateRequestDTO {
    programTitle: string
    programName?: string
    programType?: string
    programImage?: File
    removeImage?: boolean
    contentUrl?: string
    description?: string
}

export interface ProgramResponseDTO {
    programId: number
    programTitle: string
    programName?: string
    programType?: string
    programImage?: string
    contentUrl?: string
    description?: string
    createdAt: string
    updatedAt: string
    createdBy: ProgramUser
}

export interface SpringPageResponse<T> {
    content: T[]
    pageable: {
        pageNumber: number
        pageSize: number
        sort: {
            empty: boolean
            sorted: boolean
            unsorted: boolean
        }
        offset: number
        paged: boolean
        unpaged: boolean
    }
    last: boolean
    totalPages: number
    totalElements: number
    size: number
    number: number
    sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
    }
    first: boolean
    numberOfElements: number
    empty: boolean
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    timestamp: string
}

export interface ProgramSearchParams {
    keyword?: string
    programType?: string
    page?: number
    size?: number
    sort?: string
    direction?: "ASC" | "DESC"
}

export interface ProgramAdminParams {
    creatorId?: string
    page?: number
    size?: number
    sort?: string
    direction?: "ASC" | "DESC"
}
