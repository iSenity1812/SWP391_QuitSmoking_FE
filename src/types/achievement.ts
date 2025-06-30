export interface Achievement {
  achievementId: number;
  name: string;
  iconUrl?: string;
  description?: string;
  achievementType?: 'DAYS_QUIT' | 'MONEY_SAVED' | 'CIGARETTES_NOT_SMOKED';
  milestoneValue?: number;
  achievementOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MemberAchievement {
  memberAchievementId: number;
  memberId: string;
  achievementId: number;
  unlockedAt: string;
  isShared: boolean;
  achievement?: Achievement;
} 