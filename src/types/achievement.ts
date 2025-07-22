// made by gia bao

export interface Achievement {
  id: number;
  name: string;
  icon?: string;
  iconUrl?: string;
  description?: string;
  achievementType?: 'DAYS_QUIT' | 'MONEY_SAVED' | 'CIGARETTES_NOT_SMOKED' | 'CRAVING_RESISTED' | 'RESILIENCE' | 'HEALTH' | 'SOCIAL' | 'SPECIAL' | 'DAILY';
  milestoneValue?: number;
  achievementOrder?: number;
  requirements?: string;
  unlockedBy?: number;
  isActive?: boolean;
  completed?: boolean;
  completedAt?: string;
  createdAt?: string;
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

export interface AchievementWithStatus {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  achievementType?: string;
  milestoneValue?: number;
  completed: boolean;
} 