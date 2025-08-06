import React from 'react';
import type { HealthMetric } from '../../types/health';

interface HealthDebugInfoProps {
  metrics: HealthMetric[];
  lastUpdated: Date | null;
  isRefreshing: boolean;
  error: string | null;
}

const HealthDebugInfo: React.FC<HealthDebugInfoProps> = ({
  metrics,
  lastUpdated,
  isRefreshing,
  error
}) => {
  // Chỉ hiển thị trong development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const completedMetrics = metrics.filter(m => m.isCompleted);
  const regressedMetrics = metrics.filter(m => m.hasRegressed);
  const penaltyMetrics = metrics.filter(m => {
    // Kiểm tra nếu có penalty (targetDate > original target date)
    if (!m.targetDate) return false;
    const targetDate = new Date(m.targetDate);
    const quitDate = new Date(); // Giả sử quit date là now - 2 days
    quitDate.setDate(quitDate.getDate() - 2);
    
    // Tính original target date dựa trên metric type
    let originalTargetHours = 24; // Default
    switch (m.metricType) {
      case 'PULSE_RATE': originalTargetHours = 0.33; break;
      case 'OXYGEN_LEVELS': originalTargetHours = 8; break;
      case 'CARBON_MONOXIDE': originalTargetHours = 24; break;
      case 'NICOTINE': originalTargetHours = 72; break;
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
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔧 Health Debug Info (Dev Only)</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Total Metrics:</strong> {metrics.length}</p>
          <p><strong>Completed:</strong> {completedMetrics.length}</p>
          <p><strong>Regressed:</strong> {regressedMetrics.length}</p>
          <p><strong>With Penalty:</strong> {penaltyMetrics.length}</p>
        </div>
        
        <div>
          <p><strong>Last Updated:</strong> {lastUpdated?.toLocaleTimeString() || 'Never'}</p>
          <p><strong>Auto-refreshing:</strong> {isRefreshing ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
        </div>
      </div>

      {regressedMetrics.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold text-yellow-800 mb-1">Regressed Metrics:</h4>
          <ul className="text-xs space-y-1">
            {regressedMetrics.map(metric => (
              <li key={metric.metricType} className="text-yellow-700">
                {metric.displayName}: {metric.currentProgress}% (completed: {metric.isCompleted.toString()})
              </li>
            ))}
          </ul>
        </div>
      )}

      {penaltyMetrics.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold text-yellow-800 mb-1">Penalty Metrics:</h4>
          <ul className="text-xs space-y-1">
            {penaltyMetrics.map(metric => (
              <li key={metric.metricType} className="text-yellow-700">
                {metric.displayName}: {metric.currentProgress}% (target: {new Date(metric.targetDate!).toLocaleDateString()})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HealthDebugInfo; 