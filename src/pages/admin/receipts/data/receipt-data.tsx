import type { SubscriptionReceipt, ReceiptStats, RevenueData } from "../types/receipt-types"

export const mockSubscriptionReceipts: SubscriptionReceipt[] = [
    {
        id: 1,
        receiptNumber: "RCP-2024-001",
        userId: "user123",
        userName: "Nguyễn Văn An",
        userEmail: "nguyen.van.an@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "premium",
        subscriptionPlan: "Gói Premium - 3 Tháng",
        amount: 299000,
        currency: "VND",
        paymentMethod: "credit_card",
        paymentStatus: "completed",
        transactionId: "TXN-20240115-001",
        paymentDate: "2024-01-15T10:30:00Z",
        subscriptionStartDate: "2024-01-15T00:00:00Z",
        subscriptionEndDate: "2024-04-15T23:59:59Z",
        billingPeriod: "quarterly",
        discount: {
            code: "NEWYEAR2024",
            amount: 50000,
            type: "fixed",
        },
        taxes: {
            rate: 10,
            amount: 29900,
        },
        notes: "Thanh toán thành công qua thẻ tín dụng",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
    },
    {
        id: 2,
        receiptNumber: "RCP-2024-002",
        userId: "user456",
        userName: "Trần Thị Bình",
        userEmail: "tran.thi.binh@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "basic",
        subscriptionPlan: "Gói Cơ Bản - 1 Tháng",
        amount: 99000,
        currency: "VND",
        paymentMethod: "e_wallet",
        paymentStatus: "completed",
        transactionId: "TXN-20240114-002",
        paymentDate: "2024-01-14T15:20:00Z",
        subscriptionStartDate: "2024-01-14T00:00:00Z",
        subscriptionEndDate: "2024-02-14T23:59:59Z",
        billingPeriod: "monthly",
        taxes: {
            rate: 10,
            amount: 9900,
        },
        notes: "Thanh toán qua ví điện tử MoMo",
        createdAt: "2024-01-14T15:20:00Z",
        updatedAt: "2024-01-14T15:20:00Z",
    },
    {
        id: 3,
        receiptNumber: "RCP-2024-003",
        userId: "user789",
        userName: "Lê Văn Cường",
        userEmail: "le.van.cuong@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "pro",
        subscriptionPlan: "Gói Pro - 1 Năm",
        amount: 999000,
        currency: "VND",
        paymentMethod: "bank_transfer",
        paymentStatus: "completed",
        transactionId: "TXN-20240113-003",
        paymentDate: "2024-01-13T09:15:00Z",
        subscriptionStartDate: "2024-01-13T00:00:00Z",
        subscriptionEndDate: "2025-01-13T23:59:59Z",
        billingPeriod: "yearly",
        discount: {
            code: "YEARLY20",
            amount: 200000,
            type: "fixed",
        },
        taxes: {
            rate: 10,
            amount: 99900,
        },
        notes: "Chuyển khoản ngân hàng - Đã xác nhận",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
    },
    {
        id: 4,
        receiptNumber: "RCP-2024-004",
        userId: "user321",
        userName: "Phạm Thị Dung",
        userEmail: "pham.thi.dung@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "premium",
        subscriptionPlan: "Gói Premium - 1 Tháng",
        amount: 149000,
        currency: "VND",
        paymentMethod: "credit_card",
        paymentStatus: "failed",
        transactionId: "TXN-20240112-004",
        paymentDate: "2024-01-12T16:45:00Z",
        subscriptionStartDate: "2024-01-12T00:00:00Z",
        subscriptionEndDate: "2024-02-12T23:59:59Z",
        billingPeriod: "monthly",
        taxes: {
            rate: 10,
            amount: 14900,
        },
        notes: "Thanh toán thất bại - Thẻ hết hạn",
        createdAt: "2024-01-12T16:45:00Z",
        updatedAt: "2024-01-12T16:45:00Z",
    },
    {
        id: 5,
        receiptNumber: "RCP-2024-005",
        userId: "user654",
        userName: "Hoàng Văn Em",
        userEmail: "hoang.van.em@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "basic",
        subscriptionPlan: "Gói Cơ Bản - 3 Tháng",
        amount: 249000,
        currency: "VND",
        paymentMethod: "e_wallet",
        paymentStatus: "refunded",
        transactionId: "TXN-20240111-005",
        paymentDate: "2024-01-11T11:30:00Z",
        subscriptionStartDate: "2024-01-11T00:00:00Z",
        subscriptionEndDate: "2024-04-11T23:59:59Z",
        billingPeriod: "quarterly",
        taxes: {
            rate: 10,
            amount: 24900,
        },
        refundInfo: {
            refundDate: "2024-01-13T14:20:00Z",
            refundAmount: 249000,
            refundReason: "Khách hàng yêu cầu hủy dịch vụ",
            refundedBy: "Admin Trần E",
        },
        notes: "Đã hoàn tiền theo yêu cầu khách hàng",
        createdAt: "2024-01-11T11:30:00Z",
        updatedAt: "2024-01-13T14:20:00Z",
    },
    {
        id: 6,
        receiptNumber: "RCP-2024-006",
        userId: "user987",
        userName: "Vũ Thị Phương",
        userEmail: "vu.thi.phuong@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "premium",
        subscriptionPlan: "Gói Premium - 6 Tháng",
        amount: 549000,
        currency: "VND",
        paymentMethod: "paypal",
        paymentStatus: "completed",
        transactionId: "TXN-20240110-006",
        paymentDate: "2024-01-10T14:20:00Z",
        subscriptionStartDate: "2024-01-10T00:00:00Z",
        subscriptionEndDate: "2024-07-10T23:59:59Z",
        billingPeriod: "quarterly",
        discount: {
            code: "HALFYEAR10",
            amount: 10,
            type: "percentage",
        },
        taxes: {
            rate: 10,
            amount: 54900,
        },
        notes: "Thanh toán qua PayPal - Xác nhận tự động",
        createdAt: "2024-01-10T14:20:00Z",
        updatedAt: "2024-01-10T14:20:00Z",
    },
    {
        id: 7,
        receiptNumber: "RCP-2024-007",
        userId: "user555",
        userName: "Đặng Văn Giang",
        userEmail: "dang.van.giang@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "basic",
        subscriptionPlan: "Gói Cơ Bản - 1 Tháng",
        amount: 99000,
        currency: "VND",
        paymentMethod: "bank_transfer",
        paymentStatus: "pending",
        transactionId: "TXN-20240109-007",
        paymentDate: "2024-01-09T13:45:00Z",
        subscriptionStartDate: "2024-01-09T00:00:00Z",
        subscriptionEndDate: "2024-02-09T23:59:59Z",
        billingPeriod: "monthly",
        taxes: {
            rate: 10,
            amount: 9900,
        },
        notes: "Chờ xác nhận chuyển khoản ngân hàng",
        createdAt: "2024-01-09T13:45:00Z",
        updatedAt: "2024-01-09T13:45:00Z",
    },
    {
        id: 8,
        receiptNumber: "RCP-2024-008",
        userId: "user888",
        userName: "Bùi Thị Hoa",
        userEmail: "bui.thi.hoa@email.com",
        userAvatar: "/placeholder.svg?height=40&width=40",
        subscriptionType: "pro",
        subscriptionPlan: "Gói Pro - 6 Tháng",
        amount: 699000,
        currency: "VND",
        paymentMethod: "credit_card",
        paymentStatus: "completed",
        transactionId: "TXN-20240108-008",
        paymentDate: "2024-01-08T10:15:00Z",
        subscriptionStartDate: "2024-01-08T00:00:00Z",
        subscriptionEndDate: "2024-07-08T23:59:59Z",
        billingPeriod: "quarterly",
        discount: {
            code: "PREMIUM15",
            amount: 15,
            type: "percentage",
        },
        taxes: {
            rate: 10,
            amount: 69900,
        },
        notes: "Thanh toán thành công - Khách hàng VIP",
        createdAt: "2024-01-08T10:15:00Z",
        updatedAt: "2024-01-08T10:15:00Z",
    },
]

export const mockReceiptStats: ReceiptStats = {
    totalReceipts: 156,
    totalRevenue: 45680000,
    monthlyRevenue: 12450000,
    completedPayments: 128,
    pendingPayments: 8,
    failedPayments: 12,
    refundedPayments: 8,
    averageTransactionValue: 292820,
    topSubscriptionType: "premium",
    revenueGrowth: 15.8,
}

export const mockRevenueData: RevenueData[] = [
    { month: "T1", revenue: 8500000, transactions: 45 },
    { month: "T2", revenue: 9200000, transactions: 52 },
    { month: "T3", revenue: 10100000, transactions: 58 },
    { month: "T4", revenue: 11800000, transactions: 67 },
    { month: "T5", revenue: 10900000, transactions: 61 },
    { month: "T6", revenue: 12450000, transactions: 72 },
]

// Helper functions
export const getSubscriptionReceipts = (filters?: any): SubscriptionReceipt[] => {
    let filteredReceipts = [...mockSubscriptionReceipts]

    if (filters?.status && filters.status !== "all") {
        filteredReceipts = filteredReceipts.filter((receipt) => receipt.paymentStatus === filters.status)
    }

    if (filters?.subscriptionType && filters.subscriptionType !== "all") {
        filteredReceipts = filteredReceipts.filter((receipt) => receipt.subscriptionType === filters.subscriptionType)
    }

    if (filters?.paymentMethod && filters.paymentMethod !== "all") {
        filteredReceipts = filteredReceipts.filter((receipt) => receipt.paymentMethod === filters.paymentMethod)
    }

    if (filters?.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredReceipts = filteredReceipts.filter(
            (receipt) =>
                receipt.userName.toLowerCase().includes(searchTerm) ||
                receipt.userEmail.toLowerCase().includes(searchTerm) ||
                receipt.receiptNumber.toLowerCase().includes(searchTerm) ||
                receipt.transactionId.toLowerCase().includes(searchTerm),
        )
    }

    if (filters?.amountRange) {
        filteredReceipts = filteredReceipts.filter(
            (receipt) =>
                receipt.amount >= (filters.amountRange.min || 0) &&
                receipt.amount <= (filters.amountRange.max || Number.MAX_SAFE_INTEGER),
        )
    }

    return filteredReceipts.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
}

export const getReceiptStats = (): ReceiptStats => {
    return mockReceiptStats
}

export const getRevenueData = (): RevenueData[] => {
    return mockRevenueData
}

export const updateReceiptStatus = (receiptId: number, status: string, notes?: string): boolean => {
    const receiptIndex = mockSubscriptionReceipts.findIndex((receipt) => receipt.id === receiptId)
    if (receiptIndex !== -1) {
        mockSubscriptionReceipts[receiptIndex].paymentStatus = status as any
        if (notes) {
            mockSubscriptionReceipts[receiptIndex].notes = notes
        }
        mockSubscriptionReceipts[receiptIndex].updatedAt = new Date().toISOString()
        return true
    }
    return false
}

export const processRefund = (receiptId: number, refundAmount: number, refundReason: string): boolean => {
    const receiptIndex = mockSubscriptionReceipts.findIndex((receipt) => receipt.id === receiptId)
    if (receiptIndex !== -1) {
        mockSubscriptionReceipts[receiptIndex].paymentStatus = "refunded"
        mockSubscriptionReceipts[receiptIndex].refundInfo = {
            refundDate: new Date().toISOString(),
            refundAmount,
            refundReason,
            refundedBy: "Admin User",
        }
        mockSubscriptionReceipts[receiptIndex].updatedAt = new Date().toISOString()
        return true
    }
    return false
}

export const formatCurrency = (amount: number, currency = "VND"): string => {
    if (currency === "VND") {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount)
}

export const getPaymentMethodLabel = (method: string): string => {
    const labels: { [key: string]: string } = {
        credit_card: "Thẻ tín dụng",
        bank_transfer: "Chuyển khoản",
        e_wallet: "Ví điện tử",
        paypal: "PayPal",
    }
    return labels[method] || method
}

export const getSubscriptionTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
        basic: "Cơ Bản",
        premium: "Premium",
        pro: "Pro",
    }
    return labels[type] || type
}

export const getPaymentStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
        completed: "Hoàn thành",
        pending: "Chờ xử lý",
        failed: "Thất bại",
        refunded: "Đã hoàn tiền",
    }
    return labels[status] || status
}
