import axiosConfig from "@/config/axiosConfig";

export interface UserProfileResponse {
    userId: string;
    username: string;
    email: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt?: string;
    isActive?: boolean;
}

export interface DailyChartData {
    date: string;
    cigarettesSmoked: number;
    cravings?: number; // Optional for normal members
}

export interface Achievement {
    id: number;
    name: string;
    iconUrl: string;
    detailedDescription?: string; // Optional for normal members
    dateAchieved: string;
    shared?: boolean; // Optional for normal members
}

export interface PublicProfileResponse {
    userId: string;
    username: string;
    profilePicture?: string | null;
    role: string;
    memberSince: string;
    streakCount: number;
    quitJourneyStatus: string;
    totalAchievementsEarned: number;
    followersCount: number;
    followingCount: number;
    sharedAchievements: Achievement[];
    premiumSince?: string;
    hasPremiumBadge: boolean;
    premium: boolean;
    following: boolean; // Added follow status
}

export interface UserProfileMeResponse {
    userId: string;
    username: string;
    email: string;
    profilePicture?: string | null;
    role: string;
    accountCreationDate: string;
    currentStreakCount: number;
    currentQuitPlanId: number;
    quitPlanStatus: string;
    progressSnapshot?: string; // Optional for normal members
    daysWithoutSmoking: number;
    cigarettesAvoided: number;
    moneySaved: number;

    // Premium member exclusive fields
    totalMoneySaved?: number;
    totalCigarettesSmokedSinceStart?: number;
    totalCravings?: number;
    averageDailyCravings?: number;
    subscriptionId?: number;
    packageName?: string;
    price?: number;
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
    daysRemaining?: number;
    subscriptionStatus?: string;

    // Common fields
    dailyChartData: DailyChartData[];
    followersCount: number;
    followingCount: number;

    // Achievements (different property names for different roles)
    last5Achievements?: Achievement[]; // For premium members
    last3Achievements?: Achievement[]; // For normal members
}

export interface UpdateProfileRequest {
    name: string;
    email: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UserQuitStatsResponse {
    daysWithoutSmoking: number;
    cigarettesAvoided: number;
    moneySaved: number;
}

export const userService = {
    getPublicProfile: async (userId: string): Promise<UserProfileResponse> => {
        const response = await axiosConfig.get<UserProfileResponse>(`/public/profile/${userId}`);
        return response.data;
    },

    isFollowing: async (userId: string, currentUserId: string): Promise<boolean> => {
        const response = await axiosConfig.get<boolean>(
            `/api/follow/is-following/${userId}`,
            { headers: { 'X-User-Id': currentUserId } }
        );
        return response.data;
    },

    searchUsers: async (query: string): Promise<UserProfileResponse[]> => {
        const response = await axiosConfig.get(`/public/users/search?query=${encodeURIComponent(query)}`);
        return response.data && Array.isArray(response.data.data) ? response.data.data : [];
    },

    follow: async (userId: string, currentUserId: string): Promise<void> => {
        await axiosConfig.post(`/api/follow/${userId}`, null, { headers: { 'X-User-Id': currentUserId } });
    },

    unfollow: async (userId: string, currentUserId: string): Promise<void> => {
        await axiosConfig.delete(`/api/follow/${userId}`, { headers: { 'X-User-Id': currentUserId } });
    },

    getCurrentUser: async (): Promise<UserProfileResponse> => {
        const response = await axiosConfig.get<UserProfileResponse>("/profile");
        return response.data;
    },

    getProfileMe: async (): Promise<UserProfileMeResponse> => {
        const response = await axiosConfig.get<{
            status: number;
            message: string;
            data: UserProfileMeResponse;
            error: null;
            errorCode: null;
            timestamp: string;
        }>("/profiles/me");
        return response.data.data;
    },

    getPublicProfileById: async (userId: string): Promise<PublicProfileResponse> => {
        const response = await axiosConfig.get<{
            status: number;
            message: string;
            data: PublicProfileResponse;
            error: null;
            errorCode: null;
            timestamp: string;
        }>(`/profiles/${userId}`);
        return response.data.data;
    },

    getQuitStats: async (): Promise<UserQuitStatsResponse> => {
        const response = await axiosConfig.get<UserQuitStatsResponse>("/profile/quit-stats");
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
        const response = await axiosConfig.patch<UserProfileResponse>(
            "/profile",
            {
                username: data.name,
                email: data.email
            }
        );
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await axiosConfig.patch(
            "/profile/password",
            {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            }
        );
    },
}; 