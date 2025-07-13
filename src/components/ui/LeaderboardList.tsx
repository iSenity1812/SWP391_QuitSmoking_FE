import { Loader2, AlertCircle } from 'lucide-react';
import { LeaderboardItem } from './LeaderboardItem';
import type { LeaderboardEntry } from '../../types/leaderboard';
import { useAuth } from '../../hooks/useAuth';

interface LeaderboardListProps {
  data: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const LeaderboardList = ({ data, isLoading, error, onRetry }: LeaderboardListProps) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">Đang tải leaderboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Có lỗi xảy ra
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
          {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🏆</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Chưa có dữ liệu
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Hãy là người đầu tiên đạt được thành tích!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((entry) => (
        <LeaderboardItem
          key={`${entry.memberId}-${entry.achievementType}`}
          entry={entry}
          isCurrentUser={entry.memberId === user?.userId}
        />
      ))}
    </div>
  );
}; 