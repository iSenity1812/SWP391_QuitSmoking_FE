import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useWebSocket } from '@/hooks/useWebSocket';

export function WebSocketStatus() {
  const { connected } = useWebSocket();

  return (
    <Badge
      variant={connected ? "default" : "destructive"}
      className="flex items-center gap-1"
    >
      {connected ? (
        <>
          <Wifi className="h-3 w-3" />
          Kết nối
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Mất kết nối
        </>
      )}
    </Badge>
  );
}
