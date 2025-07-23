// hooks/useLiveStream.ts
import { useStreamStore } from '@/store/streamStore';
import { useWebSocket } from './useWebSocket';
import type { WebSocketEvent } from '@/lib/types';

export const useLiveStream = (sessionId: string) => {
  const {
    connect, disconnect, addToken, addLog, setError,
  } = useStreamStore();

  useWebSocket(`ws://localhost:8000/ws`, (event: WebSocketEvent) => {
    if (event.session_id !== sessionId) return;

    switch (event.type) {
      case 'start':
        connect();
        break;
      case 'token':
        addToken(event.data);
        break;
      case 'retry':
      case 'error':
        setError(event.data.message);
        break;
      case 'done':
        disconnect();
        break;
    }

    // Logs en vivo si hay
    if (event.type !== 'token') {
      addLog({ message: `[${event.type}]`, timestamp: Date.now() });
    }
  });
};
