// made by gia bao

export interface Achievement {
  id?: number;
  achievementId?: number; // Backend field
  name: string;
  icon?: string;
  iconUrl?: string;
  description?: string;
  achievementType?: 'DAYS_QUIT' | 'MONEY_SAVED' | 'CIGARETTES_NOT_SMOKED' | 'CRAVING_RESISTED' | 'RESILIENCE' | 'HEALTH' | 'SOCIAL' | 'SPECIAL' | 'DAILY' | 'WEEKLY_GOAL' | 'GOAL_STREAK';
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
  dateAchieved?: string; // Backend field
  isShared: boolean;
  achievement?: Achievement;
}

export interface MemberAchievementDTO {
  memberAchievementId: number;
  memberId: string;
  achievementId: number;
  isShared: boolean;
  dateAchieved: string;
  // Achievement details
  name: string;
  description: string;
  iconUrl: string;
  achievementType: string;
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