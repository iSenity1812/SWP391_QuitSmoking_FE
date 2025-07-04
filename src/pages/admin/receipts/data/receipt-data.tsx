import type { SubscriptionReceipt, ReceiptStats, RevenueData, ReceiptFilters } from "../types/receipt-types"

// Mock data for subscription receipts
const mockReceipts: SubscriptionReceipt[] = [
    {
        id: 1,
        receiptNumber: "RCP-2024-001",
        userId: "user_001",
        userName: "Nguyễn Văn An",
        userEmail: "nguyenvanan@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "premium",
        subscriptionPlan: "Premium 1 Tháng",
        amount: 89000,
        currency: "VND",
        paymentMethod: "credit_card",
        paymentStatus: "completed",
        transactionId: "TXN_001_2024",
        paymentDate: "2024-01-15T10:30:00Z",
        subscriptionStartDate: "2024-01-15T00:00:00Z",
        subscriptionEndDate: "2024-02-15T00:00:00Z",
        billingPeriod: "monthly",
        taxes: {
            rate: 0.1,
            amount: 8900,
        },
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
    },
    {
        id: 2,
        receiptNumber: "RCP-2024-002",
        userId: "user_002",
        userName: "Trần Thị Bình",
        userEmail: "tranthibinh@email.com",
        subscriptionType: "basic",
        subscriptionPlan: "Cơ Bản 1 Tháng",
        amount: 49000,
        currency: "VND",
        paymentMethod: "bank_transfer",
        paymentStatus: "completed",
        transactionId: "TXN_002_2024",
        paymentDate: "2024-01-14T14:20:00Z",
        subscriptionStartDate: "2024-01-14T00:00:00Z",
        subscriptionEndDate: "2024-02-14T00:00:00Z",
        billingPeriod: "monthly",
        taxes: {
            rate: 0.1,
            amount: 4900,
        },
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-14T14:20:00Z",
    },
    {
        id: 3,
        receiptNumber: "RCP-2024-003",
        userId: "user_003",
        userName: "Lê Minh Cường",
        userEmail: "leminhcuong@email.com",
        subscriptionType: "pro",
        subscriptionPlan: "Pro 3 Tháng",
        amount: 199000,
        currency: "VND",
        paymentMethod: "e_wallet",
        paymentStatus: "pending",
        transactionId: "TXN_003_2024",
        paymentDate: "2024-01-13T09:15:00Z",
        subscriptionStartDate: "2024-01-13T00:00:00Z",
        subscriptionEndDate: "2024-04-13T00:00:00Z",
        billingPeriod: "quarterly",
        discount: {
            code: "SAVE20",
            amount: 20,
            type: "percentage",
        },
        taxes: {
            rate: 0.1,
            amount: 19900,
        },
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
    },
    {
        id: 4,
        receiptNumber: "RCP-2024-004",
        userId: "user_004",
        userName: "Phạm Thị Dung",
        userEmail: "phamthidung@email.com",
        subscriptionType: "premium",
        subscriptionPlan: "Premium 2 Tuần",
        amount: 49000,
        currency: "VND",
        paymentMethod: "paypal",
        paymentStatus: "failed",
        transactionId: "TXN_004_2024",
        paymentDate: "2024-01-12T16:45:00Z",
        subscriptionStartDate: "2024-01-12T00:00:00Z",
        subscriptionEndDate: "2024-01-26T00:00:00Z",
        billingPeriod: "monthly",
        taxes: {
            rate: 0.1,
            amount: 4900,
        },
        notes: "Thanh toán thất bại do thẻ hết hạn",
        createdAt: "2024-01-12T16:45:00Z",
        updatedAt: "2024-01-12T16:45:00Z",
    },
    {
        id: 5,
        receiptNumber: "RCP-2024-005",
        userId: "user_005",
        userName: "Hoàng Văn Em",
        userEmail: "hoangvanem@email.com",
        subscriptionType: "basic",
        subscriptionPlan: "Cơ Bản 1 Tháng",
        amount: 49000,
        currency: "VND",
        paymentMethod: "credit_card",
        paymentStatus: "refunded",
        transactionId: "TXN_005_2024",
        paymentDate: "2024-01-11T11:30:00Z",
        subscriptionStartDate: "2024-01-11T00:00:00Z",
        subscriptionEndDate: "2024-02-11T00:00:00Z",
        billingPeriod: "monthly",
        refundInfo: {
            refundDate: "2024-01-13T10:00:00Z",
            refundAmount: 49000,
            refundReason: "Khách hàng yêu cầu hủy dịch vụ",
            refundedBy: "admin_001",
        },
        taxes: {
            rate: 0.1,
            amount: 4900,
        },
        createdAt: "2024-01-11T11:30:00Z",
        updatedAt: "2024-01-13T10:00:00Z",
    },
]

// Function to get filtered receipts
export function getSubscriptionReceipts(filters?: ReceiptFilters): SubscriptionReceipt[] {
    if (!filters) return mockReceipts

    let filtered = mockReceipts

    // Filter by status
    if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((receipt) => receipt.paymentStatus === filters.status)
    }

    // Filter by subscription type
    if (filters.subscriptionType && filters.subscriptionType !== "all") {
        filtered = filtered.filter((receipt) => receipt.subscriptionType === filters.subscriptionType)
    }

    // Filter by search term
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filtered = filtered.filter(
            (receipt) =>
                receipt.userName.toLowerCase().includes(searchTerm) ||
                receipt.userEmail.toLowerCase().includes(searchTerm) ||
                receipt.receiptNumber.toLowerCase().includes(searchTerm) ||
                receipt.transactionId.toLowerCase().includes(searchTerm),
        )
    }

    // Filter by amount range
    if (filters.amountRange) {
        filtered = filtered.filter(
            (receipt) => receipt.amount >= filters.amountRange!.min && receipt.amount <= filters.amountRange!.max,
        )
    }

    return filtered
}

// Function to get receipt statistics
export function getReceiptStats(): ReceiptStats {
    const totalReceipts = mockReceipts.length
    const completedPayments = mockReceipts.filter((r) => r.paymentStatus === "completed").length
    const pendingPayments = mockReceipts.filter((r) => r.paymentStatus === "pending").length
    const failedPayments = mockReceipts.filter((r) => r.paymentStatus === "failed").length
    const refundedPayments = mockReceipts.filter((r) => r.paymentStatus === "refunded").length

    const totalRevenue = mockReceipts.filter((r) => r.paymentStatus === "completed").reduce((sum, r) => sum + r.amount, 0)

    const currentMonth = new Date().getMonth()
    const monthlyRevenue = mockReceipts
        .filter((r) => r.paymentStatus === "completed" && new Date(r.paymentDate).getMonth() === currentMonth)
        .reduce((sum, r) => sum + r.amount, 0)

    const averageTransactionValue = totalRevenue / completedPayments || 0

    // Find top subscription type
    const subscriptionCounts = mockReceipts.reduce(
        (acc, receipt) => {
            acc[receipt.subscriptionType] = (acc[receipt.subscriptionType] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const topSubscriptionType = Object.entries(subscriptionCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "premium"

    return {
        totalReceipts,
        totalRevenue,
        monthlyRevenue,
        completedPayments,
        pendingPayments,
        failedPayments,
        refundedPayments,
        averageTransactionValue,
        topSubscriptionType,
        revenueGrowth: 15.2, // Mock growth percentage
    }
}

// Function to get revenue data for charts
export function getRevenueData(): RevenueData[] {
    return [
        { month: "T7", revenue: 2500000, transactions: 45 },
        { month: "T8", revenue: 3200000, transactions: 58 },
        { month: "T9", revenue: 2800000, transactions: 52 },
        { month: "T10", revenue: 3800000, transactions: 67 },
        { month: "T11", revenue: 4200000, transactions: 73 },
        { month: "T12", revenue: 4800000, transactions: 82 },
    ]
}

// Function to update receipt status
export function updateReceiptStatus(receiptId: number, newStatus: string): boolean {
    const receiptIndex = mockReceipts.findIndex((r) => r.id === receiptId)
    if (receiptIndex !== -1) {
        mockReceipts[receiptIndex].paymentStatus = newStatus as any
        mockReceipts[receiptIndex].updatedAt = new Date().toISOString()
        return true
    }
    return false
}

// Function to process refund
export function processRefund(receiptId: number, refundAmount: number, refundReason: string): boolean {
    const receiptIndex = mockReceipts.findIndex((r) => r.id === receiptId)
    if (receiptIndex !== -1) {
        mockReceipts[receiptIndex].paymentStatus = "refunded"
        mockReceipts[receiptIndex].refundInfo = {
            refundDate: new Date().toISOString(),
            refundAmount,
            refundReason,
            refundedBy: "admin_current",
        }
        mockReceipts[receiptIndex].updatedAt = new Date().toISOString()
        return true
    }
    return false
}

// Utility functions
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount)
}

export function getPaymentMethodLabel(method: string): string {
    const labels: Record<string, string> = {
        credit_card: "Thẻ tín dụng",
        bank_transfer: "Chuyển khoản ngân hàng",
        e_wallet: "Ví điện tử",
        paypal: "PayPal",
    }
    return labels[method] || method
}

export function getSubscriptionTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        basic: "Cơ Bản",
        premium: "Premium",
        pro: "Pro",
    }
    return labels[type] || type
}

export function getPaymentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        completed: "Hoàn thành",
        pending: "Chờ xử lý",
        failed: "Thất bại",
        refunded: "Đã hoàn tiền",
    }
    return labels[status] || status
}
