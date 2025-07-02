import type { PublicUser } from "../types/public-user-types"

export const publicUsersData: PublicUser[] = [
    {
        id: "user-1",
        name: "Lê Văn C",
        avatar: "/placeholder.svg?height=120&width=120",
        joinDate: "2024-01-15",
        currentStreak: 45,
        totalPlans: 3,
        followersCount: 245,
        followingCount: 89,
        isFollowing: false,
        role: "Premium member",
        achievements: [
            {
                id: "ach-1",
                title: "Tuần đầu tiên",
                description: "Hoàn thành 7 ngày đầu tiên không hút thuốc",
                icon: "calendar",
                category: "streak",
                earnedDate: "2024-01-22",
            },
            {
                id: "ach-2",
                title: "Người truyền cảm hứng",
                description: "Có hơn 100 người theo dõi",
                icon: "users",
                category: "social",
                earnedDate: "2024-02-10",
            },
            {
                id: "ach-3",
                title: "Chiến binh 30 ngày",
                description: "Duy trì streak 30 ngày liên tiếp",
                icon: "flame",
                category: "streak",
                earnedDate: "2024-02-14",
            },
        ],
    },
    {
        id: "user-2",
        name: "Nguyễn Thị Mai",
        avatar: "/placeholder.svg?height=120&width=120",
        joinDate: "2023-10-05",
        currentStreak: 120,
        totalPlans: 5,
        followersCount: 180,
        followingCount: 95,
        isFollowing: true,
        role: "Normal member",
        achievements: [
            {
                id: "ach-4",
                title: "Cột mốc 100 ngày",
                description: "Đạt được 100 ngày không hút thuốc",
                icon: "target",
                category: "milestone",
                earnedDate: "2024-01-03",
            },
            {
                id: "ach-5",
                title: "Người bạn tốt",
                description: "Hỗ trợ 10 người bạn trong hành trình cai thuốc",
                icon: "users",
                category: "social",
                earnedDate: "2023-12-15",
            },
            {
                id: "ach-6",
                title: "Sức khỏe vàng",
                description: "Cải thiện đáng kể các chỉ số sức khỏe",
                icon: "target",
                category: "health",
                earnedDate: "2023-11-20",
            },
        ],
    },
    {
        id: "coach-1",
        name: "Huấn Luyện Viên Minh",
        avatar: "/placeholder.svg?height=120&width=120",
        joinDate: "2022-03-10",
        currentStreak: 365,
        totalPlans: 12,
        followersCount: 1250,
        followingCount: 45,
        isFollowing: false,
        role: "Coach",
        achievements: [
            {
                id: "ach-7",
                title: "Chuyên gia cai thuốc",
                description: "Giúp hơn 100 người thành công cai thuốc",
                icon: "users",
                category: "social",
                earnedDate: "2023-06-15",
            },
            {
                id: "ach-8",
                title: "Một năm sạch sẽ",
                description: "Duy trì 365 ngày không hút thuốc",
                icon: "flame",
                category: "milestone",
                earnedDate: "2023-03-10",
            },
        ],
    },
    {
        id: "user-3",
        name: "Trần Minh Đức",
        avatar: "/placeholder.svg?height=120&width=120",
        joinDate: "2024-02-20",
        currentStreak: 28,
        totalPlans: 2,
        followersCount: 67,
        followingCount: 123,
        isFollowing: false,
        role: "Normal member",
        achievements: [
            {
                id: "ach-9",
                title: "Khởi đầu mới",
                description: "Hoàn thành kế hoạch cai thuốc đầu tiên",
                icon: "target",
                category: "milestone",
                earnedDate: "2024-02-27",
            },
            {
                id: "ach-10",
                title: "Tuần đầu tiên",
                description: "Hoàn thành 7 ngày đầu tiên không hút thuốc",
                icon: "calendar",
                category: "streak",
                earnedDate: "2024-02-27",
            },
        ],
    },
]

export const getPublicUserById = (userId: string): PublicUser | null => {
    return publicUsersData.find((user) => user.id === userId) || null
}

export const getAllPublicUsers = (): PublicUser[] => {
    return publicUsersData
}

export const getPublicUsersByIds = (userIds: string[]): PublicUser[] => {
    return publicUsersData.filter((user) => userIds.includes(user.id))
}
