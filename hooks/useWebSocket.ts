// hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';

export const useWebSocket = (url: string, onMessage: (data: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      onMessage(parsed);
    };

    socketRef.current.onopen = () => console.log('[WS] Conectado');
    socketRef.current.onerror = (e) => console.error('[WS] Error', e);
    socketRef.current.onclose = () => console.log('[WS] Desconectado');

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  return socketRef;
};
