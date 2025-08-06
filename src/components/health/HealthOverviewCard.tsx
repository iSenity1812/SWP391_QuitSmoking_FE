import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Award, Clock } from 'lucide-react';
import type { HealthOverview } from '@/types/health';

interface HealthOverviewCardProps {
  overview: HealthOverview;
  quitDate: string; // startDate from quit plan
}

const HealthOverviewCard: React.FC<HealthOverviewCardProps> = ({ overview, quitDate }) => {
  // Handle undefined overview
  if (!overview) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            Tổng quan Sức khỏe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  const completionRate = overview.totalMetrics > 0 
    ? Math.round((overview.completedMetrics / overview.totalMetrics) * 100) 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <TrendingUp className="h-5 w-5" />
          Tổng quan Sức khỏe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{overview.totalMetrics}</div>
            <div className="text-sm text-green-700">Tổng chỉ số</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{overview.completedMetrics}</div>
            <div className="text-sm text-blue-700">Đã hoàn thành</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{overview.inProgressMetrics}</div>
            <div className="text-sm text-orange-700">Đang tiến hành</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{overview.upcomingMilestones?.length || 0}</div>
            <div className="text-sm text-gray-700">Sắp tới</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Tỷ lệ hoàn thành</span>
            <span className="text-lg font-bold text-green-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>



        {/* Recent Achievements */}
        {overview.recentAchievements?.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <Award className="h-4 w-4" />
              Thành tựu gần đây
            </div>
            <div className="space-y-2">
              {overview.recentAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-2 p-2 bg-white rounded border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-800">{achievement.displayName}</div>
                    <div className="text-xs text-green-600">{achievement.description}</div>
                  </div>
                  {achievement.achievedDate && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(achievement.achievedDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthOverviewCard; 