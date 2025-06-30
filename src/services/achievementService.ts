import axiosConfig from '@/config/axiosConfig';
import type { Achievement, MemberAchievement } from '@/types/achievement';

export interface ProgressResponse {
  daysQuit: number;
  moneySaved: number;
  cigarettesNotSmoked: number;
}

export const achievementService = {
  async getAllAchievements(): Promise<Achievement[]> {
    const res = await axiosConfig.get('/achievements');
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  },

  async getAchievementById(id: number): Promise<Achievement> {
    const res = await axiosConfig.get(`/achievements/${id}`);
    return res.data;
  },

  async getMemberAchievements(memberId: string): Promise<any[]> {
    const res = await axiosConfig.get(`/achievements/member/${memberId}/all`);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  },

  async getUnlockedAchievements(memberId: string): Promise<Achievement[]> {
    const res = await axiosConfig.get(`/achievements/member/${memberId}/unlocked`);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  },

  async getLockedAchievements(memberId: string): Promise<Achievement[]> {
    const res = await axiosConfig.get(`/achievements/member/${memberId}/locked`);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  },

  async checkAndUnlockAchievements(memberId: string): Promise<string> {
    const res = await axiosConfig.post(`/achievements/member/${memberId}/check-unlock`);
    return res.data;
  },

  async getMemberProgress(memberId: string): Promise<ProgressResponse> {
    const res = await axiosConfig.get(`/achievements/member/${memberId}/progress`);
    return res.data;
  },

  async initializeDefaultAchievements(): Promise<string> {
    const res = await axiosConfig.post('/achievements/initialize');
    return res.data;
  },
}; 