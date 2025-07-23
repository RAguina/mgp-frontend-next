import { ExecutionResult } from '@/lib/types';

export const mockExecutionResult: ExecutionResult = {
  id: 'mock-exec-001',
  timestamp: Date.now(),
  params: {
    prompt: '¿Qué es un LLM?',
    model: 'mistral7b',
    strategy: 'optimized',
    temperature: 0.7,
    maxTokens: 512,
  },
  output: 'Un LLM es un modelo de lenguaje entrenado con grandes corpus de texto...',
  flow: {
    currentNode: 'summary',
    nodes: [],
    edges: [],
    startTime: Date.now() - 12000,
    endTime: Date.now(),
    totalTokens: 127,
    finalOutput: 'Un LLM es un modelo de lenguaje...',
  },
  metrics: {
    totalTime: 12.5,
    tokensGenerated: 127,
    modelsUsed: ['mistral7b'],
  }
};
