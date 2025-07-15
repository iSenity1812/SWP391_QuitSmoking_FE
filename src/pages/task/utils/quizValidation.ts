import type { QuizResponseDTO, OptionResponseDTO } from "@/types/task"

export const validateQuizData = (quiz: QuizResponseDTO): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    const MIN_REQUIRED_OPTIONS = 2;

    if (!quiz.title || quiz.title.trim().length === 0) {
        errors.push("Tiêu đề câu hỏi không được để trống")
    }

    if (!quiz.options || quiz.options.length < 2) {
        errors.push("Câu hỏi phải có ít nhất hai lựa chọn")
    }

   // số câu đáp án cần kiểm tra tối thiểu 2
    if (quiz.options && quiz.options.length < MIN_REQUIRED_OPTIONS) {
        errors.push(`Câu hỏi phải có ít nhất ${MIN_REQUIRED_OPTIONS} lựa chọn`);
    }

    if (quiz.options) {
        quiz.options.forEach((option, index) => {
            if (!option.content || option.content.trim().length === 0) {
                errors.push(`Lựa chọn ${index + 1} không được để trống`)
            }
        })
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}

export const validateOptionSelection = (
    selectedOptionId: number | null,
    options: OptionResponseDTO[],
): { isValid: boolean; error?: string } => {
    if (selectedOptionId === null) {
        return { isValid: false, error: "Vui lòng chọn một đáp án" }
    }

    const selectedOption = options.find((option) => option.optionId === selectedOptionId)
    if (!selectedOption) {
        return { isValid: false, error: "Lựa chọn không hợp lệ" }
    }

    return { isValid: true }
}

export const sanitizeQuizContent = (content: string): string => {
    return content.trim().replace(/\s+/g, " ")
}
