// hooks/useExecution.ts - Hook para manejar la ejecución con soporte para flujos dinámicos

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { create } from 'zustand';
import { api } from '@/lib/api';
import { GenerationParams, ExecutionResult, FlowState, NodeState, ExecutionRequest, RagUsageConfig } from '@/lib/types';
import { useConfigStore } from '@/store/configStore';
import { flowRegistry } from '@/lib/flowRegistry';
import { FlowAdapter } from '@/lib/flowAdapter';

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
 * Hook personalizado para manejar la ejecución de prompts con soporte para flujos
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
      
      // Obtener el flujo seleccionado del registry
      const selectedFlow = config.selectedFlowId 
        ? flowRegistry.get(config.selectedFlowId)
        : undefined;
      
      console.log('📋 Selected flow:', selectedFlow?.name || 'none');
      
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
      console.log('🔄 Flow ID:', config.selectedFlowId);
      
      // En modo mock, simular actualizaciones progresivas
      if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
        console.log('📝 Using mock mode');
        const result = await api.generate(fullParams);
        
        // Si hay un flujo seleccionado, enriquecer el resultado
        const enrichedResult = selectedFlow 
          ? FlowAdapter.enrichExecutionResult(result, selectedFlow)
          : result;
        
        // Iniciar con todos los nodos en "pending"
        const initialFlow: FlowState = {
          ...enrichedResult.flow,
          nodes: enrichedResult.flow.nodes.map(node => ({ ...node, status: 'pending' as const })),
        };
        
        const initialExecution = { ...enrichedResult, flow: initialFlow };
        setCurrentExecution(initialExecution);
        
        // Simular actualizaciones progresivas
        await simulateFlowUpdates(enrichedResult);
        
        return enrichedResult;
      }
      
      // En modo real, determinar el tipo de ejecución
      console.log('🌐 Using real API mode');
      
      let executionRequest: ExecutionRequest;
      
      // Función helper para construir RAG fields
      const buildRagFields = () => {
        if (!config.rag.enabled) return {};
        
        return {
          embedding_model: config.rag.embedding_model,
          vector_store: config.rag.vector_store,
          rag_config: config.rag.config,
        };
      };

      // Construir request basado en el tipo de flujo
      if (config.selectedFlowId === 'simple' || config.executionType === 'simple') {
        console.log('⚡ Using simple LLM mode');
        
        executionRequest = {
          prompt: params.prompt,
          model: fullParams.modelKey,
          execution_type: 'simple',
          strategy: fullParams.strategy as 'standard' | 'optimized' | 'streaming' | undefined,
          temperature: fullParams.temperature,
          max_tokens: fullParams.maxTokens,
          ...buildRagFields(), // 🆕 Agregar campos RAG si están habilitados
        };
      } 
      else if (config.selectedFlowId === 'challenge') {
        console.log('🔄 Using challenge flow mode');
        
        executionRequest = {
          prompt: params.prompt,
          model: fullParams.modelKey,
          execution_type: 'challenge',
          flow_type: 'challenge', // Agregar tipo de flujo específico
          strategy: fullParams.strategy as 'standard' | 'optimized' | 'streaming' | undefined,
          temperature: fullParams.temperature,
          max_tokens: fullParams.maxTokens,
          ...buildRagFields(), // 🆕 Agregar campos RAG si están habilitados
          // Para challenge flow, no necesitamos agents/tools
        };
      }
      else if (config.executionType === 'orchestrator') {
        console.log('🤖 Using orchestrator mode');
        
        executionRequest = {
          prompt: params.prompt,
          model: fullParams.modelKey,
          execution_type: 'orchestrator',
          flow_type: config.selectedFlowId || 'linear', // Especificar tipo de flujo
          strategy: fullParams.strategy as 'standard' | 'optimized' | 'streaming' | undefined,
          temperature: fullParams.temperature,
          max_tokens: fullParams.maxTokens,
          agents: config.orchestrator.agents,
          tools: config.orchestrator.tools,
          verbose: config.orchestrator.verbose,
          enable_history: config.orchestrator.enable_history,
          retry_on_error: config.orchestrator.retry_on_error,
          ...buildRagFields(), // 🆕 Agregar campos RAG si están habilitados
        };
      } 
      else {
        // Fallback a simple
        console.log('⚠️ Unknown execution type, falling back to simple');
        
        executionRequest = {
          prompt: params.prompt,
          model: fullParams.modelKey,
          execution_type: 'simple',
          strategy: fullParams.strategy as 'standard' | 'optimized' | 'streaming' | undefined,
          temperature: fullParams.temperature,
          max_tokens: fullParams.maxTokens,
          ...buildRagFields(), // 🆕 Agregar campos RAG si están habilitados
        };
      }
      
      console.log('🔧 Execution request:', executionRequest);
      
      // 🆕 NUEVO: Log RAG configuration if enabled
      if (config.rag.enabled) {
        console.log('🧠 RAG Configuration:');
        console.log('  Embedding Model:', config.rag.embedding_model);
        console.log('  Vector Store:', config.rag.vector_store);
        console.log('  RAG Config:', config.rag.config);
      }
      
      try {
        const result = await api.executeWithType(executionRequest);
        console.log('✅ Response received:', result);
        
        // Enriquecer el resultado con la definición del flujo si existe
        const enrichedResult = selectedFlow 
          ? FlowAdapter.enrichExecutionResult(result, selectedFlow)
          : result;
        
        // Si es challenge flow, extraer outputs específicos
        if (config.selectedFlowId === 'challenge' && (result as any).challenge_flow) {
          console.log('📦 Processing challenge flow outputs');
          
          const challengeOutputs = (result as any).challenge_flow;
          const nodeOutputs: Record<string, string> = {};
          
          // Extraer outputs de cada nodo del challenge flow
          Object.entries(challengeOutputs).forEach(([nodeId, nodeData]: [string, any]) => {
            nodeOutputs[nodeId] = nodeData.output || '';
          });
          
          // Agregar los outputs extraídos al resultado enriquecido
          (enrichedResult as any).nodeOutputs = nodeOutputs;
          (enrichedResult as any).challengeFlow = challengeOutputs;
        }
        
        console.log('📊 Enriched result:', enrichedResult);
        return enrichedResult;
        
      } catch (error) {
        console.error('❌ Execution error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Execution successful:', data);
      setCurrentExecution(data);
      addToHistory(data);
    },
    onError: (error) => {
      console.error('❌ Execution failed:', error);
      // Aquí podrías agregar notificaciones de error o manejo específico
    },
    onSettled: () => {
      setIsExecuting(false);
    },
  });

  // Función auxiliar para detectar el tipo de flujo desde el resultado
  const detectFlowType = useCallback((result: ExecutionResult): string => {
    // Detectar por la estructura de los nodos
    if (result.flow.nodes.some(n => n.type === 'creator')) {
      return 'challenge';
    }
    if (result.flow.nodes.some(n => n.type === 'task_analyzer')) {
      return 'linear';
    }
    return 'simple';
  }, []);

  // Función para obtener outputs por nodo
  const getNodeOutputs = useCallback((execution: ExecutionResult | null): Record<string, string> => {
    if (!execution) return {};
    
    const outputs: Record<string, string> = {};
    
    // Extraer de nodeOutputs si existe (agregado por FlowAdapter)
    if ((execution as any).nodeOutputs) {
      return (execution as any).nodeOutputs;
    }
    
    // Extraer de challenge_flow si existe
    if ((execution as any).challengeFlow) {
      Object.entries((execution as any).challengeFlow).forEach(([nodeId, data]: [string, any]) => {
        outputs[nodeId] = data.output || '';
      });
      return outputs;
    }
    
    // Extraer de los nodos del flow
    execution.flow.nodes.forEach(node => {
      if (node.data?.output) {
        outputs[node.id] = node.data.output;
      }
    });
    
    return outputs;
  }, []);

  return {
    execute: executeMutation.mutate,
    executeAsync: executeMutation.mutateAsync,
    isExecuting,
    isLoading: executeMutation.isPending,
    currentExecution,
    error: executeMutation.error,
    detectFlowType,
    getNodeOutputs,
    reset: executeMutation.reset,
  };
}