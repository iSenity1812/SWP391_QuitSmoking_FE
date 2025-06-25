"use client"

import { useState, useCallback } from "react"
import type { CreateChallengeFormData, ChallengeRequest, ChallengeValidationErrors } from "../types/challenge"

interface UseChallengeFormReturn {
    formData: CreateChallengeFormData
    errors: ChallengeValidationErrors
    isValid: boolean

    updateField: (field: keyof CreateChallengeFormData, value: string) => void
    updateFormData: (data: Partial<CreateChallengeFormData>) => void
    validateForm: () => boolean
    resetForm: () => void
    getSubmitData: () => ChallengeRequest
    setErrors: (errors: ChallengeValidationErrors) => void
    clearErrors: () => void
}

const initialFormData: CreateChallengeFormData = {
    challengeName: "",
    description: "",
    startDate: "",
    endDate: "",
    targetValue: "",
    unit: "cigarettes",
}

export const useChallengeForm = (): UseChallengeFormReturn => {
    const [formData, setFormData] = useState<CreateChallengeFormData>(initialFormData)
    const [errors, setErrors] = useState<ChallengeValidationErrors>({})

    const updateField = useCallback(
        (field: keyof CreateChallengeFormData, value: string) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }))

            // Clear error for this field when user starts typing
            if (errors[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: undefined,
                }))
            }
        },
        [errors],
    )

    const updateFormData = useCallback((data: Partial<CreateChallengeFormData>) => {
        setFormData((prev) => ({
            ...prev,
            ...data,
        }))
    }, [])

    const validateForm = useCallback((): boolean => {
        const newErrors: ChallengeValidationErrors = {}

        // Validate challenge name
        if (!formData.challengeName.trim()) {
            newErrors.challengeName = "Tên thử thách không được để trống"
        } else if (formData.challengeName.length > 100) {
            newErrors.challengeName = "Tên thử thách không được quá 100 ký tự"
        }

        // Validate end date
        if (!formData.endDate) {
            newErrors.endDate = "Ngày kết thúc không được để trống"
        }

        // Validate target value
        const targetValue = Number.parseFloat(formData.targetValue)
        if (!formData.targetValue || isNaN(targetValue) || targetValue <= 0) {
            newErrors.targetValue = "Giá trị mục tiêu phải là số dương"
        }

        // Validate unit
        if (!formData.unit.trim()) {
            newErrors.unit = "Đơn vị không được để trống"
        }

        // Validate dates relationship
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate)
            const endDate = new Date(formData.endDate)
            const now = new Date()

            if (startDate < now && formData.startDate) {
                // Only validate if startDate is explicitly set
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                if (startDate < today) {
                    newErrors.startDate = "Ngày bắt đầu không thể ở quá khứ"
                }
            }

            if (startDate >= endDate) {
                newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData])

    const resetForm = useCallback(() => {
        setFormData(initialFormData)
        setErrors({})
    }, [])

    const getSubmitData = useCallback((): ChallengeRequest => {
        const submitData: ChallengeRequest = {
            challengeName: formData.challengeName.trim(),
            description: formData.description.trim() || undefined,
            endDate: formData.endDate,
            targetValue: Number.parseFloat(formData.targetValue),
            unit: formData.unit,
        }

        // Only include startDate if it's set
        if (formData.startDate) {
            submitData.startDate = formData.startDate
        }

        return submitData
    }, [formData])

    const clearErrors = useCallback(() => {
        setErrors({})
    }, [])

    const isValid =
        Object.keys(errors).length === 0 &&
        formData.challengeName.trim() !== "" &&
        formData.endDate !== "" &&
        formData.targetValue !== "" &&
        !isNaN(Number.parseFloat(formData.targetValue)) &&
        Number.parseFloat(formData.targetValue) > 0

    return {
        formData,
        errors,
        isValid,
        updateField,
        updateFormData,
        validateForm,
        resetForm,
        getSubmitData,
        setErrors,
        clearErrors,
    }
}
