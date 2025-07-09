import { Trophy, TrendingUp, Users } from 'lucide-react';
import { LeaderboardTabs } from '../../components/ui/LeaderboardTabs';
import { LeaderboardList } from '../../components/ui/LeaderboardList';
import { useLeaderboard } from '../../hooks/useLeaderboard';

export const LeaderboardPage = () => {
  const {
    activeTab,
    leaderboardData,
    userRank,
    isLoading,
    error,
    handleTabChange,
    refetch
  } = useLeaderboard();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Bảng xếp hạng
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Xem ai đang dẫn đầu trong hành trình bỏ thuốc
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Tổng người tham gia</p>
                  <p className="text-2xl font-bold">{leaderboardData.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Đang hoạt động</p>
                  <p className="text-2xl font-bold">
                    {leaderboardData.filter(entry => entry.score > 0).length}
                  </p>
                </div>
              </div>
            </div>

            {userRank && (
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8" />
                  <div>
                    <p className="text-sm opacity-90">Rank của bạn</p>
                    <p className="text-2xl font-bold">#{userRank.rank}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <LeaderboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Leaderboard List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Top 10 {activeTab === 'MONEY_SAVED' && 'Tiền tiết kiệm'}
              {activeTab === 'DAYS_QUIT' && 'Số ngày bỏ thuốc'}
              {activeTab === 'CIGARETTES_AVOIDED' && 'Số điếu đã tránh'}
              {activeTab === 'ACHIEVEMENT_COUNT' && 'Thành tựu'}
            </h2>
            <button
              onClick={refetch}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Làm mới
            </button>
          </div>

          <LeaderboardList
            data={leaderboardData}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />
        </div>

        {/* User Rank Card */}
        {userRank && (
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Thành tích của bạn</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">#{userRank.rank}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm opacity-90">Bạn đang xếp hạng</p>
                <p className="text-2xl font-bold">{userRank.displayValue}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Trong {leaderboardData.length} người</p>
                <p className="text-lg font-semibold">
                  Top {Math.round((userRank.rank / leaderboardData.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 