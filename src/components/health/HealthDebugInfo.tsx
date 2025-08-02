import React from 'react';
import type { HealthMetric } from '../../types/health';

interface HealthDebugInfoProps {
  metrics: HealthMetric[];
  lastUpdated: Date | null;
  isAutoRefreshing: boolean;
  error: string | null;
}

const HealthDebugInfo: React.FC<HealthDebugInfoProps> = ({
  metrics,
  lastUpdated,
  isAutoRefreshing,
  error
}) => {
  // Chỉ hiển thị trong chế độ development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const completedMetrics = metrics.filter(m => m.isCompleted);
  const regressedMetrics = metrics.filter(m => m.hasRegressed);
  const penaltyMetrics = metrics.filter(m => {
    // Kiểm tra nếu có phạt (targetDate > original target date)
    if (!m.targetDate) return false;
    const targetDate = new Date(m.targetDate);
    const quitDate = new Date(); // Giả sử ngày bỏ thuốc là now - 2 days
    quitDate.setDate(quitDate.getDate() - 2);
    
    // Tính original target date dựa trên loại chỉ số
    let originalTargetHours = 24; // Mặc định
    switch (m.metricType) {
      case 'PULSE_RATE': originalTargetHours = 0.33; break;
      case 'OXYGEN_LEVELS': originalTargetHours = 8; break;
      case 'CARBON_MONOXIDE': originalTargetHours = 24; break;
      case 'NICOTINE_EXPELLED': originalTargetHours = 72; break;
      case 'TASTE_SMELL': originalTargetHours = 80; break;
      case 'BREATHING': originalTargetHours = 92; break;
      case 'ENERGY_LEVELS': originalTargetHours = 116; break;
      case 'BAD_BREATH_GONE': originalTargetHours = 188; break;
      case 'GUMS_TEETH': originalTargetHours = 356; break;
      case 'TEETH_BRIGHTNESS': originalTargetHours = 356; break;
      case 'CIRCULATION': originalTargetHours = 2016; break;
      case 'GUM_TEXTURE': originalTargetHours = 2016; break;
      case 'IMMUNITY_LUNG_FUNCTION': originalTargetHours = 3240; break;
      case 'HEART_DISEASE_RISK': originalTargetHours = 8760; break;
      case 'LUNG_CANCER_RISK': originalTargetHours = 87600; break;
      case 'HEART_ATTACK_RISK': originalTargetHours = 131400; break;
    }
    
    const originalTargetDate = new Date(quitDate.getTime() + (originalTargetHours * 60 * 60 * 1000));
    return targetDate.getTime() > originalTargetDate.getTime();
  });

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔧 Thông Tin Debug Sức Khỏe (Chỉ Dev)</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Tổng Số Chỉ Số:</strong> {metrics.length}</p>
          <p><strong>Đã Hoàn Thành:</strong> {completedMetrics.length}</p>
          <p><strong>Đã Thoái Lùi:</strong> {regressedMetrics.length}</p>
          <p><strong>Có Phạt:</strong> {penaltyMetrics.length}</p>
        </div>
        
        <div>
          <p><strong>Cập Nhật Cuối:</strong> {lastUpdated?.toLocaleTimeString() || 'Chưa bao giờ'}</p>
          <p><strong>Tự động làm mới:</strong> {isAutoRefreshing ? 'Có' : 'Không'}</p>
          <p><strong>Lỗi:</strong> {error || 'Không có'}</p>
        </div>
      </div>

      {regressedMetrics.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold text-yellow-800 mb-1">Chỉ Số Đã Thoái Lùi:</h4>
          <ul className="text-xs space-y-1">
            {regressedMetrics.map(metric => (
              <li key={metric.metricType} className="text-yellow-700">
                {metric.displayName}: {metric.currentProgress}% (đã hoàn thành: {metric.isCompleted.toString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {penaltyMetrics.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold text-yellow-800 mb-1">Chỉ Số Có Phạt:</h4>
          <ul className="text-xs space-y-1">
            {penaltyMetrics.map(metric => (
              <li key={metric.metricType} className="text-yellow-700">
                {metric.displayName}: {metric.currentProgress}% (mục tiêu: {new Date(metric.targetDate!).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HealthDebugInfo; 