"use client"

import { useState, useCallback } from "react"
import { ChallengeService } from "../services/challengeService"
import type { ChallengeRequest, ChallengeResponse, ChallengeValidationErrors } from "../types/challenge"

interface UseChallengeReturn {
    // State
    challenges: ChallengeResponse[]
    currentChallenge: ChallengeResponse | null
    isLoading: boolean
    error: string | null
    validationErrors: ChallengeValidationErrors

    // Actions
    createChallenge: (challengeData: ChallengeRequest) => Promise<boolean>
    getMyChallenges: () => Promise<void>
    getChallengeById: (challengeId: number) => Promise<void>
    updateChallenge: (challengeId: number, challengeData: ChallengeRequest) => Promise<boolean>
    deleteChallenge: (challengeId: number) => Promise<boolean>
    clearError: () => void
    clearValidationErrors: () => void
}

export const useChallenge = (): UseChallengeReturn => {
    const [challenges, setChallenges] = useState<ChallengeResponse[]>([])
    const [currentChallenge, setCurrentChallenge] = useState<ChallengeResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [validationErrors, setValidationErrors] = useState<ChallengeValidationErrors>({})

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    const clearValidationErrors = useCallback(() => {
        setValidationErrors({})
    }, [])

    const validateChallengeData = (challengeData: ChallengeRequest): ChallengeValidationErrors => {
        const errors: ChallengeValidationErrors = {}

        if (!challengeData.challengeName?.trim()) {
            errors.challengeName = "Tên thử thách không được để trống"
        } else if (challengeData.challengeName.length > 100) {
            errors.challengeName = "Tên thử thách không được quá 100 ký tự"
        }

        if (!challengeData.endDate) {
            errors.endDate = "Ngày kết thúc không được để trống"
        }

        if (!challengeData.targetValue || challengeData.targetValue <= 0) {
            errors.targetValue = "Giá trị mục tiêu phải lớn hơn 0"
        }

        if (!challengeData.unit?.trim()) {
            errors.unit = "Đơn vị không được để trống"
        }

        // Validate dates
        if (challengeData.startDate && challengeData.endDate) {
            const startDate = new Date(challengeData.startDate)
            const endDate = new Date(challengeData.endDate)

            if (startDate >= endDate) {
                errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu"
            }
        }

        return errors
    }

    const createChallenge = useCallback(async (challengeData: ChallengeRequest): Promise<boolean> => {
        setIsLoading(true)
        setError(null)
        setValidationErrors({})

        try {
            // Validate data
            const errors = validateChallengeData(challengeData)
            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors)
                return false
            }

            const newChallenge = await ChallengeService.createChallenge(challengeData)

            // Add to challenges list
            setChallenges((prev) => [newChallenge, ...prev])

            return true
        } catch (err: any) {
            setError(err.message || "Không thể tạo thử thách")
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getMyChallenges = useCallback(async (): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            const challengesList = await ChallengeService.getMyChallenges()
            setChallenges(challengesList)
        } catch (err: any) {
            setError(err.message || "Không thể tải danh sách thử thách")
        } finally {
            setIsLoading(false)
        }
    }, [])

    const getChallengeById = useCallback(async (challengeId: number): Promise<void> => {
        setIsLoading(true)
        setError(null)

        try {
            const challenge = await ChallengeService.getChallengeById(challengeId)
            setCurrentChallenge(challenge)
        } catch (err: any) {
            setError(err.message || "Không thể tải thông tin thử thách")
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateChallenge = useCallback(
        async (challengeId: number, challengeData: ChallengeRequest): Promise<boolean> => {
            setIsLoading(true)
            setError(null)
            setValidationErrors({})

            try {
                // Validate data
                const errors = validateChallengeData(challengeData)
                if (Object.keys(errors).length > 0) {
                    setValidationErrors(errors)
                    return false
                }

                const updatedChallenge = await ChallengeService.updateChallenge(challengeId, challengeData)

                // Update in challenges list
                setChallenges((prev) =>
                    prev.map((challenge) => (challenge.challengeID === challengeId ? updatedChallenge : challenge)),
                )

                // Update current challenge if it's the same one
                if (currentChallenge?.challengeID === challengeId) {
                    setCurrentChallenge(updatedChallenge)
                }

                return true
            } catch (err: any) {
                setError(err.message || "Không thể cập nhật thử thách")
                return false
            } finally {
                setIsLoading(false)
            }
        },
        [currentChallenge],
    )

    const deleteChallenge = useCallback(
        async (challengeId: number): Promise<boolean> => {
            setIsLoading(true)
            setError(null)

            try {
                await ChallengeService.deleteChallenge(challengeId)

                // Remove from challenges list
                setChallenges((prev) => prev.filter((challenge) => challenge.challengeID !== challengeId))

                // Clear current challenge if it's the deleted one
                if (currentChallenge?.challengeID === challengeId) {
                    setCurrentChallenge(null)
                }

                return true
            } catch (err: any) {
                setError(err.message || "Không thể xóa thử thách")
                return false
            } finally {
                setIsLoading(false)
            }
        },
        [currentChallenge],
    )

    return {
        // State
        challenges,
        currentChallenge,
        isLoading,
        error,
        validationErrors,

        // Actions
        createChallenge,
        getMyChallenges,
        getChallengeById,
        updateChallenge,
        deleteChallenge,
        clearError,
        clearValidationErrors,
    }
}
