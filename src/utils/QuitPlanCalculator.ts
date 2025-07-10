import type { ReductionQuitPlanType } from "@/services/quitPlanService"

export class QuitPlanCalculator {
  static calculateDailyLimit(
    reductionType: ReductionQuitPlanType,
    initialAmount: number,
    daysSinceStart: number,
    totalDays: number,
  ): number {
    if (reductionType === "IMMEDIATE") {
      return 0
    }

    const progress = Math.min(daysSinceStart / totalDays, 1)

    switch (reductionType) {
      case "LINEAR":
        return Math.max(0, Math.round(initialAmount * (1 - progress)))

      case "EXPONENTIAL":
        return Math.max(0, Math.round(initialAmount * Math.pow(1 - progress, 2)))

      case "LOGARITHMIC":
        return Math.max(0, Math.round(initialAmount * (1 - Math.log(1 + progress * (Math.E - 1)) / Math.log(Math.E))))

      default:
        return Math.max(0, Math.round(initialAmount * (1 - progress)))
    }
  }

  static calculateMoneySaved(
    daysSinceStart: number,
    cigarettesAvoided: number,
    cigarettesPerPack: number,
    pricePerPack: number,
  ): number {
    const packsAvoided = cigarettesAvoided / cigarettesPerPack
    return packsAvoided * pricePerPack
  }

  static getDaysSinceStart(startDate: string): number {
    const start = new Date(startDate)
    const now = new Date()

    start.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)

    const diffTime = now.getTime() - start.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24))
  }

  static getDaysUntilGoal(goalDate: string): number {
    const goal = new Date(goalDate)
    const now = new Date()

    goal.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)

    const diffTime = goal.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  static getTotalDays(startDate: string, goalDate: string): number {
    const start = new Date(startDate);
    const goal = new Date(goalDate);

    start.setHours(0, 0, 0, 0);
    goal.setHours(0, 0, 0, 0);

    const diffTime = goal.getTime() - start.getTime();
    // Tính số ngày và thêm 1 để bao gồm cả ngày bắt đầu và ngày kết thúc
    // Math.round được sử dụng để xử lý các vấn đề về múi giờ hoặc DST có thể gây ra phần lẻ nhỏ
    const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return totalDays;
}
}
