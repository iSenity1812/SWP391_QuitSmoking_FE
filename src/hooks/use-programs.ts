"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import programService from "@/services/programService"
import type {
    ProgramResponseDTO,
    ProgramSearchParams,
    ProgramRequestDTO,
    ProgramUpdateRequestDTO,
    ProgramAdminParams,
} from "@/types/program"
import type { SpringPageResponse } from "@/types/program"

// Hook for programs list with pagination and search
export function usePrograms(initialParams: ProgramSearchParams = {}) {
    const [programs, setPrograms] = useState<ProgramResponseDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 20,
        hasNext: false,
        hasPrevious: false,
    })

    const [searchParams, setSearchParams] = useState<ProgramSearchParams>({
        page: 0,
        size: 10,
        sort: "createdAt",
        direction: "DESC" as const,
        ...initialParams,
    })

    // Add debounced search term state
    const [searchTerm, setSearchTerm] = useState(initialParams.keyword || "")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialParams.keyword || "")

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Update search params when debounced term changes
    useEffect(() => {
        setSearchParams((prev) => ({
            ...prev,
            keyword: debouncedSearchTerm || undefined,
            page: 0, // Reset to first page when search changes
        }))
    }, [debouncedSearchTerm])

    const fetchPrograms = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            console.log("Fetching programs with params:", searchParams) // Debug log

            let response: SpringPageResponse<ProgramResponseDTO>

            // If programType is specified, use the specific endpoint
            if (searchParams.programType) {
                console.log("Using getProgramsByType for:", searchParams.programType) // Debug log
                response = await programService.getProgramsByType(searchParams.programType, {
                    ...searchParams,
                    programType: undefined, // Remove from params since it's in the URL path
                })
            } else {
                console.log("Using getAllPrograms") // Debug log
                response = await programService.getAllPrograms(searchParams)
            }

            console.log("API response:", response) // Debug log

            setPrograms(response.content)
            setPagination({
                currentPage: response.number,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                pageSize: response.size,
                hasNext: !response.last,
                hasPrevious: !response.first,
            })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch programs"
            setError(errorMessage)
            toast.error(errorMessage)
            console.error("Error fetching programs:", err)
        } finally {
            setLoading(false)
        }
    }, [searchParams])

    useEffect(() => {
        fetchPrograms()
    }, [fetchPrograms])

    const updateSearchParams = useCallback((newParams: Partial<ProgramSearchParams>) => {
        console.log("Updating search params:", newParams) // Debug log
        setSearchParams((prev) => {
            const updated = {
                ...prev,
                ...newParams,
                page: newParams.page !== undefined ? newParams.page : 0, // Reset to first page when other params change
            }
            console.log("Updated search params:", updated) // Debug log
            return updated
        })
    }, [])

    const changePage = useCallback((page: number) => {
        setSearchParams((prev) => ({ ...prev, page }))
    }, [])

    const changePageSize = useCallback((size: number) => {
        setSearchParams((prev) => ({ ...prev, size, page: 0 }))
    }, [])

    // Update search function to use searchTerm state
    const search = useCallback((keyword: string) => {
        setSearchTerm(keyword)
    }, [])

    // Add clear search function
    const clearSearch = useCallback(() => {
        setSearchTerm("")
    }, [])

    const refresh = useCallback(() => {
        fetchPrograms()
    }, [fetchPrograms])

    return {
        programs,
        loading,
        error,
        pagination,
        searchParams,
        searchTerm,
        debouncedSearchTerm,
        updateSearchParams,
        changePage,
        changePageSize,
        search,
        clearSearch,
        refresh,
    }
}

// Hook for programs by type with improved search
export function useProgramsByType(programType: string, initialParams: ProgramSearchParams = {}) {
    const [programs, setPrograms] = useState<ProgramResponseDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 20,
        hasNext: false,
        hasPrevious: false,
    })

    const [searchParams, setSearchParams] = useState<ProgramSearchParams>({
        page: 0,
        size: 20,
        sort: "createdAt",
        direction: "DESC" as const,
        ...initialParams,
    })

    // Add debounced search term state
    const [searchTerm, setSearchTerm] = useState(initialParams.keyword || "")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialParams.keyword || "")

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchTerm])

    // Update search params when debounced term changes
    useEffect(() => {
        setSearchParams((prev) => ({
            ...prev,
            keyword: debouncedSearchTerm || undefined,
            page: 0, // Reset to first page when search changes
        }))
    }, [debouncedSearchTerm])

    const fetchPrograms = useCallback(async () => {
        if (!programType) return

        try {
            setLoading(true)
            setError(null)

            console.log("Fetching programs by type:", programType, "with params:", searchParams) // Debug log

            const response = await programService.getProgramsByType(programType, searchParams)

            console.log("API response for type:", response) // Debug log

            setPrograms(response.content)
            setPagination({
                currentPage: response.number,
                totalPages: response.totalPages,
                totalElements: response.totalElements,
                pageSize: response.size,
                hasNext: !response.last,
                hasPrevious: !response.first,
            })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch programs by type"
            setError(errorMessage)
            toast.error(errorMessage)
            console.error("Error fetching programs by type:", err)
        } finally {
            setLoading(false)
        }
    }, [programType, searchParams])

    useEffect(() => {
        fetchPrograms()
    }, [fetchPrograms])

    const changePage = useCallback((page: number) => {
        setSearchParams((prev) => ({ ...prev, page }))
    }, [])

    const changePageSize = useCallback((size: number) => {
        setSearchParams((prev) => ({ ...prev, size, page: 0 }))
    }, [])

    // Add search function
    const search = useCallback((keyword: string) => {
        setSearchTerm(keyword)
    }, [])

    // Add clear search function
    const clearSearch = useCallback(() => {
        setSearchTerm("")
    }, [])

    return {
        programs,
        loading,
        error,
        pagination,
        searchTerm,
        debouncedSearchTerm,
        changePage,
        changePageSize,
        search,
        clearSearch,
        refresh: fetchPrograms,
    }
}

// Hook for single program
export function useProgram(programId: number | null) {
    const [program, setProgram] = useState<ProgramResponseDTO | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProgram = useCallback(async () => {
        if (!programId) return

        try {
            setLoading(true)
            setError(null)

            const response = await programService.getProgramById(programId)
            setProgram(response)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch program"
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [programId])

    useEffect(() => {
        fetchProgram()
    }, [fetchProgram])

    return {
        program,
        loading,
        error,
        refresh: fetchProgram,
    }
}

// Hook for program mutations (CRUD operations)
export function useProgramMutations() {
    const [loading, setLoading] = useState(false)

    const createProgram = useCallback(async (programData: ProgramRequestDTO) => {
        try {
            setLoading(true)
            const result = await programService.createProgram(programData)
            toast.success("Program created successfully!")
            return result
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create program"
            toast.error(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const updateProgram = useCallback(async (id: number, programData: ProgramUpdateRequestDTO) => {
        try {
            setLoading(true)
            const result = await programService.updateProgram(id, programData)
            toast.success("Program updated successfully!")
            return result
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update program"
            toast.error(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteProgram = useCallback(async (id: number) => {
        try {
            setLoading(true)
            await programService.deleteProgram(id)
            toast.success("Program deleted successfully!")
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete program"
            toast.error(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        createProgram,
        updateProgram,
        deleteProgram,
        loading,
    }
}

// Hook for admin operations
export function useProgramAdmin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getProgramsByCreator = useCallback(async (params: ProgramAdminParams) => {
        try {
            setLoading(true)
            setError(null)

            const response = await programService.getProgramsByCreator(params)
            return response
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch programs by creator"
            setError(errorMessage)
            toast.error(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const countProgramsByCreator = useCallback(async (creatorId: string) => {
        try {
            setLoading(true)
            setError(null)

            const count = await programService.countProgramsByCreator(creatorId)
            return count
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to count programs by creator"
            toast.error(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        getProgramsByCreator,
        countProgramsByCreator,
        loading,
        error,
    }
}
