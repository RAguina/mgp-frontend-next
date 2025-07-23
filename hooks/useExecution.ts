// hooks/useExecution.ts - Hook para manejar la ejecución (actualizado)

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { create } from 'zustand';
import { api } from '@/lib/api';
import { GenerationParams, ExecutionResult, FlowState, NodeState, ExecutionRequest } from '@/lib/types';
import { useConfigStore } from '@/store/configStore';

/**
 * Store de Zustand para el estado de ejecución
 */
interface ExecutionStore {
  currentExecution: ExecutionResult | null;
  executionHistory: ExecutionResult[];
  setCurrentExecution: (execution: ExecutionResult | null) => void;
  addToHistory: (execution: ExecutionResult) => void;
  clearHistory: () => void;
}

export const useExecutionStore = create<ExecutionStore>((set) => ({
  currentExecution: null,
  executionHistory: [],
  setCurrentExecution: (execution) => set({ currentExecution: execution }),
  addToHistory: (execution) =>
    set((state) => ({
      executionHistory: [execution, ...state.executionHistory].slice(0, 10), // Mantener últimas 10
    })),
  clearHistory: () => set({ executionHistory: [] }),
}));

/**
 * Hook personalizado para manejar la ejecución de prompts
 * @returns Objeto con funciones y estado de ejecución
 */
export function useExecution() {
  const { currentExecution, setCurrentExecution, addToHistory } = useExecutionStore();
  const [isExecuting, setIsExecuting] = useState(false);

  // Simular actualizaciones del flujo durante la ejecución
  const simulateFlowUpdates = useCallback(async (execution: ExecutionResult) => {
    const nodes = execution.flow.nodes;
    const totalNodes = nodes.length;
    
    for (let i = 0; i < totalNodes; i++) {
      // Actualizar nodo actual a "running"
      const updatedNodes = [...nodes];
      updatedNodes[i] = { ...updatedNodes[i], status: 'running' as const };
      
      setCurrentExecution({
        ...execution,
        flow: {
          ...execution.flow,
          nodes: updatedNodes,
          currentNode: updatedNodes[i].id,
        },
      });
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Actualizar nodo a "completed"
      updatedNodes[i] = { ...updatedNodes[i], status: 'completed' as const };
      setCurrentExecution({
        ...execution,
        flow: {
          ...execution.flow,
          nodes: updatedNodes,
          currentNode: i < totalNodes - 1 ? updatedNodes[i + 1].id : undefined,
        },
      });
    }
  }, [setCurrentExecution]);

  const executeMutation = useMutation({
    mutationFn: async (params: GenerationParams) => {
      console.log('🚀 Executing with params:', params);
      
      setIsExecuting(true);
      
      // Obtener configuración actual del store
      const config = useConfigStore.getState();
      
      // Completar parámetros con valores del store
      const fullParams: GenerationParams = {
        ...params,
        modelKey: params.modelKey || params.model || config.defaultModel,
        model: params.model || params.modelKey || config.defaultModel,
        strategy: (params.strategy || config.defaultStrategy) as 'standard' | 'optimized' | 'streaming',
        temperature: params.temperature || config.temperature,
        maxTokens: params.maxTokens || config.maxTokens,
      };

      console.log('🔧 Full params:', fullParams);
      console.log('🎯 Execution type:', config.executionType);
      
      // En modo mock, simular actualizaciones progresivas
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        console.log('📝 Using mock mode');
        const result = await api.generate(fullParams);
        
        // Iniciar con todos los nodos en "pending"
        const initialFlow: FlowState = {
          ...result.flow,
          nodes: result.flow.nodes.map(node => ({ ...node, status: 'pending' as const })),
        };
        
        const initialExecution = { ...result, flow: initialFlow };
        setCurrentExecution(initialExecution);
        
        // Simular actualizaciones progresivas
        await simulateFlowUpdates(result);
        
        return result;
      }
      
      // En modo real, elegir entre simple y orchestrator
      console.log('🌐 Using real API mode');
      
      if (config.executionType === 'orchestrator') {
        console.log('🤖 Using orchestrator mode');
        
        const executionRequest: ExecutionRequest = {
          prompt: params.prompt,
          model: fullParams.modelKey,
          execution_type: 'orchestrator',
          strategy: fullParams.strategy as 'standard' | 'optimized' | 'streaming' | undefined,
          temperature: fullParams.temperature,
          max_tokens: fullParams.maxTokens,
          agents: config.orchestrator.agents,
          tools: config.orchestrator.tools,
          verbose: config.orchestrator.verbose,
          enable_history: config.orchestrator.enable_history,
          retry_on_error: config.orchestrator.retry_on_error,
        };
        
        console.log('🔧 Orchestrator request:', executionRequest);
        const result = await api.executeWithType(executionRequest);
        console.log('✅ Orchestrator response:', result);
        
        return result;
      } else {
        console.log('⚡ Using simple LLM mode');
        
        const executionRequest: ExecutionRequest = {
          prompt: params.prompt,
          model: fullParams.modelKey,
          execution_type: 'simple',
          strategy: fullParams.strategy as 'standard' | 'optimized' | 'streaming' | undefined,
          temperature: fullParams.temperature,
          max_tokens: fullParams.maxTokens,
        };
        
        console.log('🔧 Simple request:', executionRequest);
        const result = await api.executeWithType(executionRequest);
        console.log('✅ Simple response:', result);
        
        return result;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Execution successful:', data);
      setCurrentExecution(data);
      addToHistory(data);
    },
    onError: (error) => {
      console.error('❌ Execution failed:', error);
    },
    onSettled: () => {
      setIsExecuting(false);
    },
  });

  return {
    execute: executeMutation.mutate,
    isExecuting,
    currentExecution,
    error: executeMutation.error,
  };
}