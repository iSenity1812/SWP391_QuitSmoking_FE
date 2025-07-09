export interface LeaderboardEntry {
  memberId: string;
  username: string;
  profilePicture: string | null;
  score: number;
  rank: number;
  achievementType: string;
  displayValue: string;
}

export type LeaderboardType = 'MONEY_SAVED' | 'DAYS_QUIT' | 'CIGARETTES_AVOIDED' | 'ACHIEVEMENT_COUNT';

export interface LeaderboardTab {
  id: LeaderboardType;
  label: string;
  icon: string;
  description: string;
} 