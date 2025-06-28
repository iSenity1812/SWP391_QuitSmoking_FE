import { type Task, type Quiz, type Tip, TASK_TYPE, type PerformanceLevel } from "@/types/task"

export const getTaskType = (task: Task): "quiz" | "tip" | "unknown" => {
    switch (task.typeId) {
        case TASK_TYPE.QUIZ:
            return "quiz"
        case TASK_TYPE.TIP:
            return "tip"
        default:
            return "unknown"
    }
}

export const getQuizzesFromTask = (task: Task): Quiz[] => {
    if (task.typeId !== TASK_TYPE.QUIZ || !task.quizzes || task.quizzes.length === 0) {
        return []
    }
    return task.quizzes
}

export const getTipFromTask = (task: Task): Tip | null => {
    if (task.typeId !== TASK_TYPE.TIP || !task.tips) {
        return null
    }
    return task.tips
}

export const formatTaskCreatedAt = (createdAt: string): string => {
    try {
        const date = new Date(createdAt)
        return date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    } catch (error) {
        return createdAt
    }
}

export const getTaskTypeLabel = (typeId: number): string => {
    switch (typeId) {
        case TASK_TYPE.QUIZ:
            return "Câu hỏi"
        case TASK_TYPE.TIP:
            return "Mẹo hay"
        default:
            return "Không xác định"
    }
}

export const validateQuizAttempt = (selectedOptionId: number | null, quiz: Quiz): boolean => {
    if (selectedOptionId === null) {
        return false
    }

    const selectedOption = quiz.options.find((option) => option.optionId === selectedOptionId)
    return selectedOption !== undefined
}

export const getPerformanceLevel = (percentage: number): PerformanceLevel => {
    if (percentage >= 80) {
        return {
            message: "Xuất sắc!",
            color: "text-green-600",
            emoji: "🏆",
        }
    }
    if (percentage >= 60) {
        return {
            message: "Tốt!",
            color: "text-blue-600",
            emoji: "👍",
        }
    }
    if (percentage >= 40) {
        return {
            message: "Khá ổn!",
            color: "text-yellow-600",
            emoji: "😊",
        }
    }
    return {
        message: "Cần cố gắng thêm!",
        color: "text-red-600",
        emoji: "💪",
    }
}

export const calculatePercentage = (score: number, total: number): number => {
    if (total === 0) return 0
    return Math.round((score / total) * 100)
}

export const formatQuizProgress = (current: number, total: number): string => {
    return `${current}/${total}`
}

export const getMotivationalMessage = (isCorrect: boolean): string => {
    if (isCorrect) {
        const messages = [
            "Tuyệt vời! Bạn đang kiểm soát được cơn thèm! 🎉",
            "Chính xác! Kiến thức là sức mạnh! 💪",
            "Xuất sắc! Bạn đang trên đường chiến thắng! ⭐",
            "Đúng rồi! Tiếp tục như vậy! 🚀",
        ]
        return messages[Math.floor(Math.random() * messages.length)]
    } else {
        const messages = [
            "Không sao! Học hỏi từ sai lầm cũng là tiến bộ! 🌱",
            "Đừng nản lòng! Mỗi câu sai là một bài học! 📚",
            "Cố gắng lên! Bạn đang học cách vượt qua thử thách! 💫",
            "Không quan trọng! Điều quan trọng là bạn đang cố gắng! 🌟",
        ]
        return messages[Math.floor(Math.random() * messages.length)]
    }
}

export const getCompletionMessage = (percentage: number): string => {
    if (percentage >= 80) {
        return "Bạn đã vượt qua cơn thèm một cách xuất sắc! Kiến thức của bạn thật ấn tượng! 🏆"
    }
    if (percentage >= 60) {
        return "Tốt lắm! Bạn đã kiểm soát được cơn thèm bằng kiến thức! 👏"
    }
    if (percentage >= 40) {
        return "Bạn đã cố gắng rất tốt! Hãy tiếp tục học hỏi để mạnh mẽ hơn! 💪"
    }
    return "Đây là bước đầu tuyệt vời! Mỗi lần thử là một lần tiến bộ! 🌱"
}
