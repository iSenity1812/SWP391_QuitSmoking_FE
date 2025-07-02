export interface SubscriptionReceipt {
    id: number
    receiptNumber: string
    userId: string
    userName: string
    userEmail: string
    userAvatar?: string
    subscriptionType: "basic" | "premium" | "pro"
    subscriptionPlan: string
    amount: number
    currency: string
    paymentMethod: "credit_card" | "bank_transfer" | "e_wallet" | "paypal"
    paymentStatus: "completed" | "pending" | "failed" | "refunded"
    transactionId: string
    paymentDate: string
    subscriptionStartDate: string
    subscriptionEndDate: string
    billingPeriod: "monthly" | "quarterly" | "yearly"
    discount?: {
        code: string
        amount: number
        type: "fixed" | "percentage"
    }
    taxes: {
        rate: number
        amount: number
    }
    refundInfo?: {
        refundDate: string
        refundAmount: number
        refundReason: string
        refundedBy: string
    }
    notes?: string
    createdAt: string
    updatedAt: string
}

export interface ReceiptStats {
    totalReceipts: number
    totalRevenue: number
    monthlyRevenue: number
    completedPayments: number
    pendingPayments: number
    failedPayments: number
    refundedPayments: number
    averageTransactionValue: number
    topSubscriptionType: string
    revenueGrowth: number
}

export interface RevenueData {
    month: string
    revenue: number
    transactions: number
}

export interface ReceiptFilters {
    status: string
    subscriptionType: string
    paymentMethod: string
    search: string
    amountRange?: {
        min: number
        max: number
    }
}
