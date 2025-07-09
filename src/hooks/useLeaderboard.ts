import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { leaderboardService } from '@/services/leaderboardService';
import type { LeaderboardEntry, LeaderboardType } from '../types/leaderboard';

export const useLeaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LeaderboardType>('MONEY_SAVED');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (type: LeaderboardType) => {
    setIsLoading(true);
    setError(null);
    try {
      let data: LeaderboardEntry[];
      switch (type) {
        case 'MONEY_SAVED':
          data = await leaderboardService.getMoneySavedLeaderboard(10);
          break;
        case 'DAYS_QUIT':
          data = await leaderboardService.getDaysQuitLeaderboard(10);
          break;
        case 'CIGARETTES_AVOIDED':
          data = await leaderboardService.getCigarettesAvoidedLeaderboard(10);
          break;
        case 'ACHIEVEMENT_COUNT':
          data = await leaderboardService.getAchievementCountLeaderboard(10);
          break;
        default:
          throw new Error('Invalid leaderboard type');
      }
      setLeaderboardData(data);
    } catch (err) {
      setError('Failed to fetch leaderboard data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUserRank = useCallback(async (type: LeaderboardType) => {
    if (!user?.userId) return;
    
    try {
      const rank = await leaderboardService.getUserRank(type);
      setUserRank(rank);
    } catch (err) {
      console.error('Failed to fetch user rank:', err);
    }
  }, [user?.userId]);

  const handleTabChange = useCallback((type: LeaderboardType) => {
    setActiveTab(type);
    fetchLeaderboard(type);
    fetchUserRank(type);
  }, [fetchLeaderboard, fetchUserRank]);

  useEffect(() => {
    fetchLeaderboard(activeTab);
    fetchUserRank(activeTab);
  }, [fetchLeaderboard, fetchUserRank, activeTab]);

  return {
    activeTab,
    leaderboardData,
    userRank,
    isLoading,
    error,
    handleTabChange,
    refetch: () => fetchLeaderboard(activeTab)
  };
}; 