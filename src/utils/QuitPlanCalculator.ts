import type { ReductionQuitPlanType } from "@/services/quitPlanService"

export class QuitPlanCalculator {
  static calculateDailyLimit(
    reductionType: ReductionQuitPlanType,
    initialAmount: number,
    daysSinceStart: number, // Đây là 'i' trong logic backend, bắt đầu từ 0 cho ngày đầu tiên
    totalDays: number,
  ): number {
    if (totalDays <= 0) {
      return initialAmount; // Hoặc ném lỗi, tùy thuộc vào cách bạn muốn xử lý.
    }

    if (reductionType === "IMMEDIATE") {
      return 0
    }

    // Điều chỉnh daysSinceStart để phù hợp với chỉ số 0-based của backend (ngày 1 là index 0)
    // và đảm bảo progress đạt 1.0 vào ngày cuối cùng.
    let progress: number
    if (totalDays === 1) { // Nếu kế hoạch chỉ có 1 ngày, progress sẽ là 1 (ngay lập tức)
      progress = 1
    } else {
      progress = Math.min(daysSinceStart / (totalDays - 1), 1) // Điều chỉnh để khớp với logic Java
    }


    let calculatedValue: number

    switch (reductionType) {
      case "LINEAR":
        calculatedValue = initialAmount * (1 - progress)
        break
      case "EXPONENTIAL":
        calculatedValue = initialAmount * Math.pow(1 - progress, 2)
        break
      case "LOGARITHMIC":
        calculatedValue = initialAmount * (1 - Math.log(1 + progress * (Math.E - 1)) / Math.log(Math.E))
        break
      default:
        calculatedValue = initialAmount * (1 - progress)
        break
    }

    let roundedCigarettes = Math.round(calculatedValue)

    // Đảm bảo số điếu không bao giờ âm
    roundedCigarettes = Math.max(0, roundedCigarettes)

    // Ép số điếu về 0 vào ngày cuối cùng, giống logic backend
    if (daysSinceStart >= totalDays - 1) { // Nếu là ngày cuối cùng hoặc đã qua ngày cuối cùng
      roundedCigarettes = 0
    }

    return roundedCigarettes
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

  static getDaysBetweenDates(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
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
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays + 1); // +1 để bao gồm cả ngày bắt đầu và ngày kết thúc
  }
}