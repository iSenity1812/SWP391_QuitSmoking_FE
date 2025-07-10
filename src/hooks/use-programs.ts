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
        size: 20,
        sort: "createdAt",
        direction: "DESC" as const,
        ...initialParams,
    })

    const fetchPrograms = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await programService.getAllPrograms(searchParams)

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
        } finally {
            setLoading(false)
        }
    }, [searchParams])

    useEffect(() => {
        fetchPrograms()
    }, [fetchPrograms])

    const updateSearchParams = useCallback((newParams: Partial<ProgramSearchParams>) => {
        setSearchParams((prev) => ({
            ...prev,
            ...newParams,
            page: newParams.page !== undefined ? newParams.page : 0, // Reset to first page when other params change
        }))
    }, [])

    const changePage = useCallback((page: number) => {
        setSearchParams((prev) => ({ ...prev, page }))
    }, [])

    const changePageSize = useCallback((size: number) => {
        setSearchParams((prev) => ({ ...prev, size, page: 0 }))
    }, [])

    const search = useCallback(
        (keyword: string) => {
            updateSearchParams({ keyword, page: 0 })
        },
        [updateSearchParams],
    )

    const refresh = useCallback(() => {
        fetchPrograms()
    }, [fetchPrograms])

    return {
        programs,
        loading,
        error,
        pagination,
        searchParams,
        updateSearchParams,
        changePage,
        changePageSize,
        search,
        refresh,
    }
}

// Hook for programs by type
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

    const fetchPrograms = useCallback(async () => {
        if (!programType) return

        try {
            setLoading(true)
            setError(null)

            const response = await programService.getProgramsByType(programType, searchParams)

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

    return {
        programs,
        loading,
        error,
        pagination,
        changePage,
        changePageSize,
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
            setError(errorMessage)
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


