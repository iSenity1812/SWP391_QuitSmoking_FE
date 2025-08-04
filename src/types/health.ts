export const HealthMetricType = {
  PULSE_RATE: 'PULSE_RATE',
  BLOOD_PRESSURE: 'BLOOD_PRESSURE',
  OXYGEN_LEVELS: 'OXYGEN_LEVELS',
  CARBON_MONOXIDE: 'CARBON_MONOXIDE',
  NICOTINE: 'NICOTINE',
  SENSE_OF_TASTE: 'SENSE_OF_TASTE',
  SENSE_OF_SMELL: 'SENSE_OF_SMELL',
  BREATHING: 'BREATHING',
  COUGHING: 'COUGHING',
  ENERGY_LEVELS: 'ENERGY_LEVELS',
  LUNG_FUNCTION: 'LUNG_FUNCTION',
  CIRCULATION: 'CIRCULATION',
  SKIN_IMPROVEMENT: 'SKIN_IMPROVEMENT',
  STRESS_REDUCTION: 'STRESS_REDUCTION',
  HEART_ATTACK_RISK: 'HEART_ATTACK_RISK',
  CANCER_RISK: 'CANCER_RISK'
} as const;

export type HealthMetricType = typeof HealthMetricType[keyof typeof HealthMetricType];

// Helper function để lấy tên hiển thị tiếng Việt
export const getHealthMetricDisplayName = (metricType: HealthMetricType): string => {
  const displayNames: Record<HealthMetricType, string> = {
    [HealthMetricType.PULSE_RATE]: 'Nhịp tim',
    [HealthMetricType.BLOOD_PRESSURE]: 'Huyết áp',
    [HealthMetricType.OXYGEN_LEVELS]: 'Nồng độ oxy',
    [HealthMetricType.CARBON_MONOXIDE]: 'Carbon monoxide',
    [HealthMetricType.NICOTINE]: 'Nicotine',
    [HealthMetricType.SENSE_OF_TASTE]: 'Vị giác',
    [HealthMetricType.SENSE_OF_SMELL]: 'Khứu giác',
    [HealthMetricType.BREATHING]: 'Hô hấp',
    [HealthMetricType.COUGHING]: 'Ho',
    [HealthMetricType.ENERGY_LEVELS]: 'Mức năng lượng',
    [HealthMetricType.LUNG_FUNCTION]: 'Chức năng phổi',
    [HealthMetricType.CIRCULATION]: 'Tuần hoàn máu',
    [HealthMetricType.SKIN_IMPROVEMENT]: 'Cải thiện da',
    [HealthMetricType.STRESS_REDUCTION]: 'Giảm căng thẳng',
    [HealthMetricType.HEART_ATTACK_RISK]: 'Giảm nguy cơ đau tim',
    [HealthMetricType.CANCER_RISK]: 'Giảm nguy cơ ung thư phổi'
  };
  return displayNames[metricType];
};

// Helper function để lấy mô tả tiếng Việt
export const getHealthMetricDescription = (metricType: HealthMetricType): string => {
  const descriptions: Record<HealthMetricType, string> = {
    [HealthMetricType.PULSE_RATE]: 'Sau 20 phút, nhịp tim của bạn sẽ trở về bình thường',
    [HealthMetricType.BLOOD_PRESSURE]: 'Sau 20 phút, huyết áp sẽ giảm xuống mức bình thường',
    [HealthMetricType.OXYGEN_LEVELS]: 'Sau 8 giờ, nồng độ oxy trong máu sẽ trở về bình thường',
    [HealthMetricType.CARBON_MONOXIDE]: 'Sau 24 giờ, carbon monoxide sẽ được loại bỏ khỏi cơ thể',
    [HealthMetricType.NICOTINE]: 'Sau 72 giờ, nicotine sẽ được loại bỏ khỏi cơ thể',
    [HealthMetricType.SENSE_OF_TASTE]: 'Sau 48 giờ, vị giác sẽ được cải thiện',
    [HealthMetricType.SENSE_OF_SMELL]: 'Sau 48 giờ, khứu giác sẽ được cải thiện',
    [HealthMetricType.BREATHING]: 'Sau 72 giờ, hơi thở sẽ dễ dàng hơn',
    [HealthMetricType.COUGHING]: 'Sau 1 tuần, ho sẽ giảm đáng kể',
    [HealthMetricType.ENERGY_LEVELS]: 'Sau 2 tuần, mức năng lượng sẽ tăng lên',
    [HealthMetricType.LUNG_FUNCTION]: 'Sau 1 tháng, chức năng phổi sẽ được cải thiện',
    [HealthMetricType.CIRCULATION]: 'Sau 3 tháng, tuần hoàn máu sẽ được cải thiện',
    [HealthMetricType.SKIN_IMPROVEMENT]: 'Sau 1 tháng, da sẽ trở nên tươi sáng hơn',
    [HealthMetricType.STRESS_REDUCTION]: 'Sau 2 tuần, mức độ căng thẳng sẽ giảm',
    [HealthMetricType.HEART_ATTACK_RISK]: 'Sau 15 năm, nguy cơ đau tim sẽ tương đương người chưa từng hút thuốc',
    [HealthMetricType.CANCER_RISK]: 'Sau 10 năm, nguy cơ ung thư phổi sẽ giảm 50%'
  };
  return descriptions[metricType];
};

// Helper function để phân loại metrics
export const getHealthMetricCategory = (metricType: HealthMetricType): string => {
  const immediateMetrics: HealthMetricType[] = [
    HealthMetricType.PULSE_RATE,
    HealthMetricType.OXYGEN_LEVELS,
    HealthMetricType.CARBON_MONOXIDE,
    HealthMetricType.NICOTINE,
    HealthMetricType.BREATHING,
    HealthMetricType.ENERGY_LEVELS,
    HealthMetricType.COUGHING
  ];

  const shortTermMetrics: HealthMetricType[] = [
    HealthMetricType.BLOOD_PRESSURE,
    HealthMetricType.SENSE_OF_TASTE,
    HealthMetricType.SENSE_OF_SMELL,
    HealthMetricType.CIRCULATION,
    HealthMetricType.SKIN_IMPROVEMENT,
    HealthMetricType.STRESS_REDUCTION
  ];

  if (immediateMetrics.includes(metricType)) return 'immediate';
  if (shortTermMetrics.includes(metricType)) return 'shortTerm';
  return 'longTerm';
};

// Helper function để lấy target hours cho từng metric type
export const getHealthMetricTargetHours = (metricType: HealthMetricType): number => {
  const targetHours: Record<HealthMetricType, number> = {
    [HealthMetricType.PULSE_RATE]: 0.33,
    [HealthMetricType.BLOOD_PRESSURE]: 0.33,
    [HealthMetricType.OXYGEN_LEVELS]: 8.0,
    [HealthMetricType.CARBON_MONOXIDE]: 24.0,
    [HealthMetricType.NICOTINE]: 72.0,
    [HealthMetricType.SENSE_OF_TASTE]: 48.0,
    [HealthMetricType.SENSE_OF_SMELL]: 48.0,
    [HealthMetricType.BREATHING]: 72.0,
    [HealthMetricType.COUGHING]: 7.0,
    [HealthMetricType.ENERGY_LEVELS]: 14.0,
    [HealthMetricType.LUNG_FUNCTION]: 30.0,
    [HealthMetricType.CIRCULATION]: 90.0,
    [HealthMetricType.SKIN_IMPROVEMENT]: 30.0,
    [HealthMetricType.STRESS_REDUCTION]: 14.0,
    [HealthMetricType.HEART_ATTACK_RISK]: 131400.0,
    [HealthMetricType.CANCER_RISK]: 87600.0
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