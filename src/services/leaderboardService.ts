import axiosConfig from "@/config/axiosConfig";
import type { LeaderboardEntry } from "../types/leaderboard";

export const leaderboardService = {
  // Lấy leaderboard tiền tiết kiệm
  getMoneySavedLeaderboard: async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    const response = await axiosConfig.get(`/api/leaderboard/money-saved?limit=${limit}`);
    return response.data.data;
  },

  // Lấy leaderboard số ngày bỏ thuốc
  getDaysQuitLeaderboard: async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    const response = await axiosConfig.get(`/api/leaderboard/days-quit?limit=${limit}`);
    return response.data.data;
  },

  // Lấy leaderboard số điếu đã tránh hút
  getCigarettesAvoidedLeaderboard: async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    const response = await axiosConfig.get(`/api/leaderboard/cigarettes-avoided?limit=${limit}`);
    return response.data.data;
  },

  // Lấy leaderboard số lượng thành tựu
  getAchievementCountLeaderboard: async (limit: number = 10): Promise<LeaderboardEntry[]> => {
    const response = await axiosConfig.get(`/api/leaderboard/achievement-count?limit=${limit}`);
    return response.data.data;
  },

  // Lấy rank của user hiện tại trong leaderboard
  getUserRank: async (leaderboardType: string): Promise<LeaderboardEntry | null> => {
    const response = await axiosConfig.get(`/api/leaderboard/user/rank?leaderboardType=${leaderboardType}`);
    return response.data.data;
  },

  // Lấy tất cả rank của user hiện tại
  getAllUserRanks: async (): Promise<LeaderboardEntry[]> => {
    const response = await axiosConfig.get(`/api/leaderboard/user/all-ranks`);
    return response.data.data;
  }
}; 