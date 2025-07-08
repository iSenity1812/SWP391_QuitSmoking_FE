import type { UserReport, ReportStats } from "../types/report-types"

export const mockUserReports: UserReport[] = [
    {
        id: 1,
        reporterId: "user123",
        reporterName: "Nguyễn Văn A",
        reporterAvatar: "/placeholder.svg?height=40&width=40",
        reportedUserId: "user456",
        reportedUserName: "Trần Thị B",
        reportedUserType: "user",
        reportReason: "Hành vi không phù hợp",
        reportDescription:
            "Người dùng này đã có những bình luận không phù hợp và thiếu tôn trọng trong các bài viết blog. Họ thường xuyên sử dụng ngôn từ thô tục và tạo ra môi trường tiêu cực cho cộng đồng.",
        status: "pending",
        priority: "high",
        createdAt: "2024-01-15T10:30:00Z",
        evidence: ["screenshot1.png", "chat_log.txt"],
    },
    {
        id: 2,
        reporterId: "user789",
        reporterName: "Lê Văn C",
        reportedUserId: "coach123",
        reportedUserName: "Coach Nguyễn D",
        reportedUserType: "coach",
        reportReason: "Lừa đảo",
        reportDescription:
            "Coach này yêu cầu thanh toán thêm phí ngoài hệ thống và hứa hẹn những kết quả không thực tế. Tôi đã chuyển tiền nhưng không nhận được dịch vụ như cam kết.",
        status: "investigating",
        priority: "critical",
        createdAt: "2024-01-14T15:20:00Z",
        adminId: "admin1",
        adminName: "Admin Trần E",
        adminNote: "Đang xác minh thông tin thanh toán và liên hệ với coach để làm rõ vấn đề.",
    },
    {
        id: 3,
        reporterId: "user321",
        reporterName: "Phạm Thị F",
        reportedUserId: "user654",
        reportedUserName: "Hoàng Văn G",
        reportedUserType: "user",
        reportReason: "Spam",
        reportDescription:
            "Người dùng này liên tục gửi tin nhắn quảng cáo sản phẩm cai thuốc không rõ nguồn gốc trong các nhóm chat và bình luận blog.",
        status: "resolved",
        priority: "medium",
        createdAt: "2024-01-13T09:15:00Z",
        resolvedAt: "2024-01-14T14:30:00Z",
        adminId: "admin2",
        adminName: "Admin Lê H",
        adminNote: "Đã cảnh báo người dùng và xóa các nội dung spam. Tài khoản bị hạn chế đăng bài trong 7 ngày.",
    },
    {
        id: 4,
        reporterId: "user555",
        reporterName: "Vũ Thị I",
        reportedUserId: "user777",
        reportedUserName: "Đặng Văn K",
        reportedUserType: "user",
        reportReason: "Quấy rối",
        reportDescription:
            "Người dùng này liên tục gửi tin nhắn riêng tư không mong muốn và có những lời lẽ quấy rối sau khi tôi từ chối kết bạn.",
        status: "resolved",
        priority: "high",
        createdAt: "2024-01-12T16:45:00Z",
        resolvedAt: "2024-01-13T10:20:00Z",
        adminId: "admin1",
        adminName: "Admin Trần E",
        adminNote: "Đã khóa tính năng nhắn tin của người dùng trong 30 ngày và gửi cảnh báo chính thức.",
    },
    {
        id: 5,
        reporterId: "user888",
        reporterName: "Bùi Văn L",
        reportedUserId: "coach456",
        reportedUserName: "Coach Phan M",
        reportedUserType: "coach",
        reportReason: "Thông tin sai lệch",
        reportDescription:
            "Coach này đưa ra những lời khuyên y tế không chính xác và có thể gây hại cho sức khỏe. Họ khuyên tôi ngừng thuốc đột ngột mà không tham khảo bác sĩ.",
        status: "pending",
        priority: "critical",
        createdAt: "2024-01-11T11:30:00Z",
    },
    {
        id: 6,
        reporterId: "user999",
        reporterName: "Cao Thị N",
        reportedUserId: "user111",
        reportedUserName: "Ngô Văn O",
        reportedUserType: "user",
        reportReason: "Hồ sơ giả mạo",
        reportDescription:
            "Người dùng này sử dụng ảnh và thông tin của người khác. Tôi biết chắc vì đây là ảnh của bạn tôi.",
        status: "dismissed",
        priority: "low",
        createdAt: "2024-01-10T14:20:00Z",
        resolvedAt: "2024-01-11T09:15:00Z",
        adminId: "admin2",
        adminName: "Admin Lê H",
        adminNote: "Sau khi xác minh, đây là tài khoản hợp lệ. Người báo cáo đã nhầm lẫn.",
    },
    {
        id: 7,
        reporterId: "user444",
        reporterName: "Trương Văn P",
        reportedUserId: "user333",
        reportedUserName: "Lý Thị Q",
        reportedUserType: "user",
        reportReason: "Ngôn từ thù địch",
        reportDescription:
            "Người dùng này sử dụng ngôn từ phân biệt đối xử và thù địch trong các bình luận, tạo ra môi trường độc hại cho cộng đồng.",
        status: "pending",
        priority: "high",
        createdAt: "2024-01-09T13:45:00Z",
    },
    {
        id: 8,
        reporterId: "user666",
        reporterName: "Đỗ Thị R",
        reportedUserId: "coach789",
        reportedUserName: "Coach Võ S",
        reportedUserType: "coach",
        reportReason: "Vi phạm quy định",
        reportDescription:
            "Coach này thường xuyên vắng mặt trong các buổi tư vấn đã đặt lịch và không thông báo trước. Điều này ảnh hưởng nghiêm trọng đến kế hoạch cai thuốc của tôi.",
        status: "investigating",
        priority: "medium",
        createdAt: "2024-01-08T10:15:00Z",
        adminId: "admin1",
        adminName: "Admin Trần E",
        adminNote: "Đang kiểm tra lịch sử buổi tư vấn và liên hệ với coach để xác minh.",
    },
]

export const mockReportStats: ReportStats = {
    totalUserReports: 156,
    pendingUserReports: 23,
    resolvedUserReports: 98,
    criticalReports: 3,
    reportsToday: 12,
    averageResolutionTime: 18.5,
}

// Helper functions
export const getUserReports = (filters?: any): UserReport[] => {
    let filteredReports = [...mockUserReports]

    if (filters?.status && filters.status !== "all") {
        filteredReports = filteredReports.filter((report) => report.status === filters.status)
    }

    if (filters?.priority && filters.priority !== "all") {
        filteredReports = filteredReports.filter((report) => report.priority === filters.priority)
    }

    if (filters?.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredReports = filteredReports.filter(
            (report) =>
                report.reporterName.toLowerCase().includes(searchTerm) ||
                report.reportedUserName.toLowerCase().includes(searchTerm) ||
                report.reportDescription.toLowerCase().includes(searchTerm),
        )
    }

    return filteredReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const getReportStats = (): ReportStats => {
    return mockReportStats
}

export const updateUserReportStatus = (reportId: number, status: string, adminNote?: string): boolean => {
    const reportIndex = mockUserReports.findIndex((report) => report.id === reportId)
    if (reportIndex !== -1) {
        mockUserReports[reportIndex].status = status as any
        mockUserReports[reportIndex].adminNote = adminNote
        if (status === "resolved" || status === "dismissed") {
            mockUserReports[reportIndex].resolvedAt = new Date().toISOString()
        }
        return true
    }
    return false
}
