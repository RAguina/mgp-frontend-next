// store/streamStore.ts
import { create } from 'zustand';
import type { StreamState } from '@/lib/types';

interface StreamStore extends StreamState {
  connect: () => void;
  disconnect: () => void;
  addToken: (token: string) => void;
  addLog: (log: { message: string; timestamp: number }) => void;
  setError: (error: string) => void;
}

export const useStreamStore = create<StreamStore>((set) => ({
  isConnected: false,
  isProcessing: false,
  currentTokens: [],
  logs: [],
  error: undefined,

  connect: () => set({ isConnected: true }),
  disconnect: () => set({ isConnected: false }),
  addToken: (token) => set((state) => ({ currentTokens: [...state.currentTokens, token] })),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  setError: (error) => set({ error }),
}));
