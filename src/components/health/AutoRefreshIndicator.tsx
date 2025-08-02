import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock } from 'lucide-react';

interface AutoRefreshIndicatorProps {
  isAutoRefreshing: boolean;
  lastUpdated: Date | null;
}

export const AutoRefreshIndicator: React.FC<AutoRefreshIndicatorProps> = ({
  isAutoRefreshing,
  lastUpdated
}) => {
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Chưa cập nhật';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Vừa cập nhật';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="bg-green-500 text-white">
        <RefreshCw className={`h-3 w-3 mr-1 ${isAutoRefreshing ? 'animate-spin' : ''}`} />
        {isAutoRefreshing ? 'Đang cập nhật...' : 'Tự động cập nhật'}
      </Badge>
      <span className="text-green-200 text-sm">
        <Clock className="h-3 w-3 inline mr-1" />
        {formatLastUpdated(lastUpdated)}
      </span>
    </div>
  );
}; 