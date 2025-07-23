// mocks/stream.mock.ts

import type { WebSocketEvent } from '@/lib/types';

export const mockStreamEvents: WebSocketEvent[] = [
  { type: 'start', data: null, session_id: 'abc123', timestamp: Date.now() },
  { type: 'token', data: 'def', session_id: 'abc123', timestamp: Date.now() + 100 },
  { type: 'token', data: ' fibonacci', session_id: 'abc123', timestamp: Date.now() + 200 },
  { type: 'done', data: null, session_id: 'abc123', timestamp: Date.now() + 300 },
];
