import { useState } from 'react';
import { Coins, Calendar, Cigarette } from 'lucide-react';
import type { LeaderboardType, LeaderboardTab } from '../../types/leaderboard';

interface LeaderboardTabsProps {
  activeTab: LeaderboardType;
  onTabChange: (tab: LeaderboardType) => void;
}

const tabs: LeaderboardTab[] = [
  {
    id: 'MONEY_SAVED',
    label: 'Tiền tiết kiệm',
    icon: '💰',
    description: 'Xem ai tiết kiệm được nhiều tiền nhất'
  },
  {
    id: 'DAYS_QUIT',
    label: 'Số ngày bỏ thuốc',
    icon: '📅',
    description: 'Xem ai bỏ thuốc được lâu nhất'
  },
  {
    id: 'CIGARETTES_AVOIDED',
    label: 'Số điếu đã tránh',
    icon: '🚭',
    description: 'Xem ai tránh được nhiều điếu thuốc nhất'
  },
  {
    id: 'ACHIEVEMENT_COUNT',
    label: 'Thành tựu',
    icon: '🏆',
    description: 'Ai đạt nhiều thành tựu nhất'
  }
];

export const LeaderboardTabs = ({ activeTab, onTabChange }: LeaderboardTabsProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              activeTab === tab.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{tab.icon}</span>
              <div className="text-left">
                <h3 className={`font-semibold ${
                  activeTab === tab.id 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {tab.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {tab.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 