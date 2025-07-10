// Program Type Enum
export const ProgramType = {
    BEGINNER: "BEGINNER",
    INTERMEDIATE: "INTERMEDIATE",
    ADVANCED: "ADVANCED",
    MEDITATION: "MEDITATION",
    EXERCISE: "EXERCISE",
    NUTRITION: "NUTRITION",
    PSYCHOLOGY: "PSYCHOLOGY",
    SUPPORT_GROUP: "SUPPORT_GROUP",
    EDUCATIONAL: "EDUCATIONAL",
    MOTIVATIONAL: "MOTIVATIONAL",
} as const;

export type ProgramType = typeof ProgramType[keyof typeof ProgramType];

// Program Type Labels for display
export const ProgramTypeLabels: Record<ProgramType, string> = {
    [ProgramType.BEGINNER]: "Người mới bắt đầu",
    [ProgramType.INTERMEDIATE]: "Trung cấp",
    [ProgramType.ADVANCED]: "Nâng cao",
    [ProgramType.MEDITATION]: "Thiền định",
    [ProgramType.EXERCISE]: "Tập thể dục",
    [ProgramType.NUTRITION]: "Dinh dưỡng",
    [ProgramType.PSYCHOLOGY]: "Tâm lý học",
    [ProgramType.SUPPORT_GROUP]: "Nhóm hỗ trợ",
    [ProgramType.EDUCATIONAL]: "Giáo dục",
    [ProgramType.MOTIVATIONAL]: "Động lực",
}

// Program Type Options for forms
export const ProgramTypeOptions = Object.values(ProgramType).map((type) => ({
    value: type,
    label: ProgramTypeLabels[type],
}))

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
    programType?: ProgramType
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
    programType?: ProgramType
    programImage?: File
    contentUrl?: string
    description?: string
}

export interface ProgramUpdateRequestDTO {
    programTitle: string
    programName?: string
    programType?: ProgramType
    programImage?: File
    removeImage?: boolean
    contentUrl?: string
    description?: string
}

export interface ProgramResponseDTO {
    programId: number
    programTitle: string
    programName?: string
    programType?: ProgramType
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
    programType?: ProgramType
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
