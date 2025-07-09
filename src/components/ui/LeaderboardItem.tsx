import { Trophy, Medal, Award } from 'lucide-react';
import type { LeaderboardEntry } from '../../types/leaderboard';
import { useAuth } from '../../hooks/useAuth';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
}

export const LeaderboardItem = ({ entry, isCurrentUser = false }: LeaderboardItemProps) => {
  const { user } = useAuth();
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className="flex items-center gap-2">
          {getRankIcon(rank)}
          <span className="text-lg font-bold">#{rank}</span>
        </div>
      );
    }
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
      isCurrentUser 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
    }`}>
      {/* Rank */}
      <div className="flex-shrink-0 w-16 text-center">
        {getRankBadge(entry.rank)}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
          {entry.profilePicture ? (
            <img 
              src={entry.profilePicture} 
              alt={entry.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            entry.username.charAt(0).toUpperCase()
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`font-semibold truncate ${
            isCurrentUser 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-900 dark:text-gray-100'
          }`}>
            {entry.username}
          </h3>
          {isCurrentUser && (
            <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
              Bạn
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {entry.displayValue}
        </p>
      </div>

      {/* Score */}
      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {entry.displayValue}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {entry.achievementType === 'MONEY_SAVED' && 'VND'}
          {entry.achievementType === 'DAYS_QUIT' && 'ngày'}
          {entry.achievementType === 'CIGARETTES_AVOIDED' && 'điếu'}
        </div>
      </div>
    </div>
  );
}; 