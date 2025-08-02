export const HealthMetricType = {
  PULSE_RATE: 'PULSE_RATE',
  OXYGEN_LEVELS: 'OXYGEN_LEVELS',
  CARBON_MONOXIDE: 'CARBON_MONOXIDE',
  NICOTINE_EXPELLED: 'NICOTINE_EXPELLED',
  TASTE_SMELL: 'TASTE_SMELL',
  BREATHING: 'BREATHING',
  ENERGY_LEVELS: 'ENERGY_LEVELS',
  BAD_BREATH_GONE: 'BAD_BREATH_GONE',
  GUMS_TEETH: 'GUMS_TEETH',
  TEETH_BRIGHTNESS: 'TEETH_BRIGHTNESS',
  CIRCULATION: 'CIRCULATION',
  GUM_TEXTURE: 'GUM_TEXTURE',
  IMMUNITY_LUNG_FUNCTION: 'IMMUNITY_LUNG_FUNCTION',
  HEART_DISEASE_RISK: 'HEART_DISEASE_RISK',
  LUNG_CANCER_RISK: 'LUNG_CANCER_RISK',
  HEART_ATTACK_RISK: 'HEART_ATTACK_RISK'
} as const;

export type HealthMetricType = typeof HealthMetricType[keyof typeof HealthMetricType];

// Helper function để lấy tên hiển thị tiếng Việt
export const getHealthMetricDisplayName = (metricType: HealthMetricType): string => {
  const displayNames: Record<HealthMetricType, string> = {
    [HealthMetricType.PULSE_RATE]: 'Nhịp tim',
    [HealthMetricType.OXYGEN_LEVELS]: 'Nồng độ oxy',
    [HealthMetricType.CARBON_MONOXIDE]: 'Nồng độ carbon monoxide',
    [HealthMetricType.NICOTINE_EXPELLED]: 'Nicotine được đào thải',
    [HealthMetricType.TASTE_SMELL]: 'Vị giác và khứu giác',
    [HealthMetricType.BREATHING]: 'Hô hấp',
    [HealthMetricType.ENERGY_LEVELS]: 'Mức năng lượng',
    [HealthMetricType.BAD_BREATH_GONE]: 'Hơi thở hôi',
    [HealthMetricType.GUMS_TEETH]: 'Nướu và răng',
    [HealthMetricType.TEETH_BRIGHTNESS]: 'Độ trắng răng',
    [HealthMetricType.CIRCULATION]: 'Tuần hoàn máu',
    [HealthMetricType.GUM_TEXTURE]: 'Kết cấu nướu',
    [HealthMetricType.IMMUNITY_LUNG_FUNCTION]: 'Miễn dịch và chức năng phổi',
    [HealthMetricType.HEART_DISEASE_RISK]: 'Giảm nguy cơ bệnh tim',
    [HealthMetricType.LUNG_CANCER_RISK]: 'Giảm nguy cơ ung thư phổi',
    [HealthMetricType.HEART_ATTACK_RISK]: 'Giảm nguy cơ đau tim'
  };
  return displayNames[metricType];
};

// Helper function để lấy mô tả tiếng Việt
export const getHealthMetricDescription = (metricType: HealthMetricType): string => {
  const descriptions: Record<HealthMetricType, string> = {
    [HealthMetricType.PULSE_RATE]: 'Sau 20 phút, nhịp tim của bạn sẽ trở về bình thường',
    [HealthMetricType.OXYGEN_LEVELS]: 'Sau 8 giờ, nồng độ oxy trong máu sẽ trở về bình thường',
    [HealthMetricType.CARBON_MONOXIDE]: 'Sau 24 giờ, carbon monoxide từ thuốc lá sẽ được loại bỏ hoàn toàn',
    [HealthMetricType.NICOTINE_EXPELLED]: 'Sau 72 giờ, nicotine sẽ được đào thải khỏi cơ thể',
    [HealthMetricType.TASTE_SMELL]: 'Sau 3 ngày, vị giác và khứu giác sẽ được cải thiện đáng kể',
    [HealthMetricType.BREATHING]: 'Sau 3 ngày 20 giờ, hô hấp sẽ trở về bình thường',
    [HealthMetricType.ENERGY_LEVELS]: 'Sau 4 ngày 20 giờ, mức năng lượng sẽ trở về bình thường',
    [HealthMetricType.BAD_BREATH_GONE]: 'Sau 7 ngày 20 giờ, hơi thở hôi do thuốc lá sẽ biến mất',
    [HealthMetricType.GUMS_TEETH]: 'Sau 14 ngày 20 giờ, lưu thông máu ở nướu và răng sẽ tương tự người không hút thuốc',
    [HealthMetricType.TEETH_BRIGHTNESS]: 'Sau 14 ngày 20 giờ, vết ố vàng trên răng do thuốc lá sẽ không tăng thêm',
    [HealthMetricType.CIRCULATION]: 'Sau 2 tháng 28 ngày, tuần hoàn máu sẽ được cải thiện đáng kể',
    [HealthMetricType.GUM_TEXTURE]: 'Sau 2 tháng 28 ngày, kết cấu và màu sắc nướu sẽ trở về bình thường',
    [HealthMetricType.IMMUNITY_LUNG_FUNCTION]: 'Sau 4 tháng 17 ngày, hệ miễn dịch và chức năng phổi sẽ được cải thiện',
    [HealthMetricType.HEART_DISEASE_RISK]: 'Sau 1 năm, nguy cơ bệnh tim sẽ giảm một nửa so với người hút thuốc',
    [HealthMetricType.LUNG_CANCER_RISK]: 'Sau 10 năm, nguy cơ ung thư phổi sẽ giảm một nửa so với người vẫn hút thuốc',
    [HealthMetricType.HEART_ATTACK_RISK]: 'Sau 15 năm, nguy cơ đau tim sẽ tương đương người chưa từng hút thuốc'
  };
  return descriptions[metricType];
};

// Helper function để phân loại metrics
export const getHealthMetricCategory = (metricType: HealthMetricType): string => {
  const immediateMetrics: HealthMetricType[] = [
    HealthMetricType.PULSE_RATE,
    HealthMetricType.OXYGEN_LEVELS,
    HealthMetricType.CARBON_MONOXIDE,
    HealthMetricType.NICOTINE_EXPELLED,
    HealthMetricType.TASTE_SMELL,
    HealthMetricType.BREATHING,
    HealthMetricType.ENERGY_LEVELS,
    HealthMetricType.BAD_BREATH_GONE
  ];

  const shortTermMetrics: HealthMetricType[] = [
    HealthMetricType.GUMS_TEETH,
    HealthMetricType.TEETH_BRIGHTNESS,
    HealthMetricType.CIRCULATION,
    HealthMetricType.GUM_TEXTURE,
    HealthMetricType.IMMUNITY_LUNG_FUNCTION
  ];

  if (immediateMetrics.includes(metricType)) return 'immediate';
  if (shortTermMetrics.includes(metricType)) return 'shortTerm';
  return 'longTerm';
};

// Helper function để lấy target hours cho từng metric type
export const getHealthMetricTargetHours = (metricType: HealthMetricType): number => {
  const targetHours: Record<HealthMetricType, number> = {
    [HealthMetricType.PULSE_RATE]: 0.33,
    [HealthMetricType.OXYGEN_LEVELS]: 8.0,
    [HealthMetricType.CARBON_MONOXIDE]: 24.0,
    [HealthMetricType.NICOTINE_EXPELLED]: 72.0,
    [HealthMetricType.TASTE_SMELL]: 80.0,
    [HealthMetricType.BREATHING]: 92.0,
    [HealthMetricType.ENERGY_LEVELS]: 116.0,
    [HealthMetricType.BAD_BREATH_GONE]: 188.0,
    [HealthMetricType.GUMS_TEETH]: 356.0,
    [HealthMetricType.TEETH_BRIGHTNESS]: 356.0,
    [HealthMetricType.CIRCULATION]: 2016.0,
    [HealthMetricType.GUM_TEXTURE]: 2016.0,
    [HealthMetricType.IMMUNITY_LUNG_FUNCTION]: 3240.0,
    [HealthMetricType.HEART_DISEASE_RISK]: 8760.0,
    [HealthMetricType.LUNG_CANCER_RISK]: 87600.0,
    [HealthMetricType.HEART_ATTACK_RISK]: 131400.0
  };
  return targetHours[metricType];
};

export type HealthMetric = {
  id: string;
  userId: string;
  metricType: HealthMetricType;
  displayName: string;
  description: string;
  currentProgress: number;
  targetDate: string | null;
  achievedDate: string | null;
  isCompleted: boolean;
  timeRemainingHours: number | null;
  timeRemainingFormatted: string;
  hasRegressed?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type HealthOverview = {
  totalMetrics: number;
  completedMetrics: number;
  inProgressMetrics: number;
  overallProgress: number;
  topProgressMetrics: HealthMetric[];
  upcomingMilestones: HealthMetric[];
  recentAchievements: HealthMetric[];
  nextMilestone: string;
  daysSinceQuit: number;
  hoursSinceQuit: number;
};

export type HealthMetricCategory = {
  name: string;
  metrics: HealthMetric[];
  color: string;
};

export type HealthProgressCircleProps = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}; 