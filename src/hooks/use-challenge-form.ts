"use client"

import { useState, useCallback } from "react"
import type { CreateChallengeFormData, ChallengeValidationErrors, ChallengeRequest } from "../types/challenge"

interface UseChallengeFormReturn {
    formData: CreateChallengeFormData
    errors: ChallengeValidationErrors
    isValid: boolean
    isSubmitting: boolean

    updateField: (field: keyof CreateChallengeFormData, value: string) => void
    updateFormData: (data: Partial<CreateChallengeFormData>) => void
    validateForm: () => boolean
    validateField: (field: keyof CreateChallengeFormData) => void
    resetForm: () => void
    getSubmitData: () => ChallengeRequest
    setErrors: (errors: ChallengeValidationErrors) => void
    clearErrors: () => void
    setSubmitting: (submitting: boolean) => void
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
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateField = useCallback(
        (field: keyof CreateChallengeFormData) => {
            const newErrors = { ...errors }

            switch (field) {
                case "challengeName":
                    if (!formData.challengeName.trim()) {
                        newErrors.challengeName = "Tên thử thách không được để trống"
                    } else if (formData.challengeName.trim().length < 3) {
                        newErrors.challengeName = "Tên thử thách phải có ít nhất 3 ký tự"
                    } else if (formData.challengeName.trim().length > 100) {
                        newErrors.challengeName = "Tên thử thách không được quá 100 ký tự"
                    } else {
                        delete newErrors.challengeName
                    }
                    break

                case "description":
                    if (formData.description && formData.description.length > 500) {
                        newErrors.description = "Mô tả không được quá 500 ký tự"
                    } else {
                        delete newErrors.description
                    }
                    break

                case "startDate":
                    if (formData.startDate) {
                        const startDate = new Date(formData.startDate)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)

                        // Check if start date is in the past
                        if (startDate < today) {
                            newErrors.startDate = "Ngày bắt đầu không được là quá khứ"
                        } else if (formData.endDate) {
                            // Check if start date is after end date
                            const endDate = new Date(formData.endDate)
                            if (startDate >= endDate) {
                                newErrors.startDate = "Ngày bắt đầu phải trước ngày kết thúc"
                            } else {
                                delete newErrors.startDate
                            }
                        } else {
                            delete newErrors.startDate
                        }
                    } else {
                        delete newErrors.startDate
                    }
                    break

                case "endDate":
                    if (!formData.endDate) {
                        newErrors.endDate = "Ngày kết thúc không được để trống"
                    } else {
                        const endDate = new Date(formData.endDate)
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)

                        if (endDate <= today) {
                            newErrors.endDate = "Ngày kết thúc phải sau ngày hôm nay"
                        } else {
                            delete newErrors.endDate
                            // Also revalidate start date if it exists
                            if (formData.startDate) {
                                const startDate = new Date(formData.startDate)
                                if (startDate < today) {
                                    newErrors.startDate = "Ngày bắt đầu không được là quá khứ"
                                } else if (startDate >= endDate) {
                                    newErrors.startDate = "Ngày bắt đầu phải trước ngày kết thúc"
                                } else {
                                    delete newErrors.startDate
                                }
                            }
                        }
                    }
                    break

                case "targetValue":
                    if (!formData.targetValue.trim()) {
                        newErrors.targetValue = "Giá trị mục tiêu không được để trống"
                    } else {
                        const targetValue = Number.parseFloat(formData.targetValue)
                        if (isNaN(targetValue) || targetValue <= 0) {
                            newErrors.targetValue = "Giá trị mục tiêu phải là số dương"
                        } else if (targetValue > 1000000) {
                            newErrors.targetValue = "Giá trị mục tiêu không được quá 1,000,000"
                        } else {
                            delete newErrors.targetValue
                        }
                    }
                    break

                case "unit":
                    if (!formData.unit.trim()) {
                        newErrors.unit = "Đơn vị không được để trống"
                    } else {
                        delete newErrors.unit
                    }
                    break
            }

            setErrors(newErrors)
        },
        [formData, errors],
    )

    const updateField = useCallback(
        (field: keyof CreateChallengeFormData, value: string) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }))

            // Clear error for this field when user starts typing
            if (errors[field]) {
                const newErrors = { ...errors }
                delete newErrors[field]
                setErrors(newErrors)
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
        } else if (formData.challengeName.trim().length < 3) {
            newErrors.challengeName = "Tên thử thách phải có ít nhất 3 ký tự"
        } else if (formData.challengeName.trim().length > 100) {
            newErrors.challengeName = "Tên thử thách không được quá 100 ký tự"
        }

        // Validate description
        if (formData.description && formData.description.length > 500) {
            newErrors.description = "Mô tả không được quá 500 ký tự"
        }

        // Validate dates
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Validate end date first
        if (!formData.endDate) {
            newErrors.endDate = "Ngày kết thúc không được để trống"
        } else {
            const endDate = new Date(formData.endDate)
            if (endDate <= today) {
                newErrors.endDate = "Ngày kết thúc phải sau ngày hôm nay"
            }
        }

        // Validate start date if provided
        if (formData.startDate) {
            const startDate = new Date(formData.startDate)

            // Check if start date is in the past
            if (startDate < today) {
                newErrors.startDate = "Ngày bắt đầu không được là quá khứ"
            } else if (formData.endDate && !newErrors.endDate) {
                // Only check start vs end if end date is valid
                const endDate = new Date(formData.endDate)
                if (startDate >= endDate) {
                    newErrors.startDate = "Ngày bắt đầu phải trước ngày kết thúc"
                }
            }
        }

        // Validate target value
        if (!formData.targetValue.trim()) {
            newErrors.targetValue = "Giá trị mục tiêu không được để trống"
        } else {
            const targetValue = Number.parseFloat(formData.targetValue)
            if (isNaN(targetValue) || targetValue <= 0) {
                newErrors.targetValue = "Giá trị mục tiêu phải là số dương"
            } else if (targetValue > 1000000) {
                newErrors.targetValue = "Giá trị mục tiêu không được quá 1,000,000"
            }
        }

        // Validate unit
        if (!formData.unit.trim()) {
            newErrors.unit = "Đơn vị không được để trống"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [formData])

    const resetForm = useCallback(() => {
        setFormData(initialFormData)
        setErrors({})
        setIsSubmitting(false)
    }, [])

    const clearErrors = useCallback(() => {
        setErrors({})
    }, [])

    const setSubmitting = useCallback((submitting: boolean) => {
        setIsSubmitting(submitting)
    }, [])

    const getSubmitData = useCallback((): ChallengeRequest => {
        // Convert date strings to ISO format with time for backend compatibility
        const formatDateForBackend = (dateString: string): string => {
            if (!dateString) return ""
            // Add time component to make it compatible with LocalDateTime
            return `${dateString}T00:00:00`
        }

        return {
            challengeName: formData.challengeName.trim(),
            description: formData.description.trim() || undefined,
            startDate: formData.startDate ? formatDateForBackend(formData.startDate) : undefined,
            endDate: formatDateForBackend(formData.endDate),
            targetValue: Number.parseFloat(formData.targetValue),
            unit: formData.unit.trim(),
        }
    }, [formData])

    const isValid =
        Object.keys(errors).length === 0 &&
        formData.challengeName.trim() !== "" &&
        formData.endDate !== "" &&
        formData.targetValue.trim() !== "" &&
        formData.unit.trim() !== ""

    return {
        formData,
        errors,
        isValid,
        isSubmitting,
        updateField,
        updateFormData,
        validateForm,
        validateField,
        resetForm,
        getSubmitData,
        setErrors,
        clearErrors,
        setSubmitting,
    }
}
