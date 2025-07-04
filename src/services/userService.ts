import axiosConfig from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/auth";

export interface UpdateProfileRequest {
    name: string;
    email: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface UserProfileResponse {
    userId: string;
    username: string;
    email: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export interface UserQuitStatsResponse {
    daysWithoutSmoking: number;
    cigarettesAvoided: number;
    moneySaved: number;
}

export const userService = {
    updateProfile: async (data: UpdateProfileRequest): Promise<ApiResponse<UserProfileResponse>> => {
        try {
            console.log("Sending update profile request:", { username: data.name, email: data.email });
            
            const response = await axiosConfig.patch<ApiResponse<UserProfileResponse>>(
                "/profile", 
                {
                    username: data.name,
                    email: data.email
                }
            );
            
            console.log("Update profile response:", response.data);
            
            // Update localStorage if successful
            if (response.data && response.data.data) {
                const currentUserInfo = localStorage.getItem("user_info");
                if (currentUserInfo) {
                    const userInfo = JSON.parse(currentUserInfo);
                    userInfo.username = response.data.data.username;
                    userInfo.email = response.data.data.email;
                    localStorage.setItem("user_info", JSON.stringify(userInfo));
                }
            }
            
            return response.data;
        } catch (error: any) {
            console.error("Update profile error:", error);
            console.error("Error response:", error.response?.data);
            throw error;
        }
    },

    changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<any>> => {
        const response = await axiosConfig.patch<ApiResponse<any>>(
            "/profile/password",
            {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            }
        );
        return response.data;
    },

    getCurrentUser: async (): Promise<ApiResponse<UserProfileResponse>> => {
        const response = await axiosConfig.get<ApiResponse<UserProfileResponse>>(
            "/profile"
        );
        return response.data;
    },

    getQuitStats: async (): Promise<ApiResponse<UserQuitStatsResponse>> => {
        const response = await axiosConfig.get<ApiResponse<UserQuitStatsResponse>>("/profile/quit-stats");
        return response.data;
    },

    getPublicProfile: async (userId: string): Promise<ApiResponse<UserProfileResponse>> => {
        const response = await axiosConfig.get<ApiResponse<UserProfileResponse>>(`/public/profile/${userId}`);
        return response.data;
    },

    searchUsers: async (query: string): Promise<UserProfileResponse[]> => {
        const response = await axiosConfig.get<ApiResponse<UserProfileResponse[]>>(`/public/users/search?query=${encodeURIComponent(query)}`);
        return response.data.data || [];
    }
}; 