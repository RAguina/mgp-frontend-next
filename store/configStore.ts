// store/configStore.ts - Store para configuración global (actualizado)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigStore {
  // Configuración existente
  defaultModel: string;
  defaultStrategy: string;
  temperature: number;
  maxTokens: number;
  mockMode: boolean;
  
  // Tipo de ejecución (expandido para incluir 'challenge')
  executionType: 'simple' | 'orchestrator' | 'challenge';
  
  // ✅ NUEVO: ID del flujo seleccionado
  selectedFlowId: string;
  
  // Configuración del orchestrator
  orchestrator: {
    agents: string[];
    tools: string[];
    verbose: boolean;
    enable_history: boolean;
    retry_on_error: boolean;
  };
  
  // Actions existentes
  setDefaultModel: (model: string) => void;
  setDefaultStrategy: (strategy: string) => void;
  setTemperature: (temp: number) => void;
  setMaxTokens: (tokens: number) => void;
  toggleMockMode: () => void;
  
  // Actions para tipo de ejecución y flujo
  setExecutionType: (type: 'simple' | 'orchestrator' | 'challenge') => void;
  setSelectedFlowId: (flowId: string) => void; // ✅ NUEVO
  
  // Actions para orchestrator
  setOrchestratorAgents: (agents: string[]) => void;
  setOrchestratorTools: (tools: string[]) => void;
  setOrchestratorVerbose: (verbose: boolean) => void;
  setOrchestratorHistory: (enable: boolean) => void;
  setOrchestratorRetry: (retry: boolean) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      // Estado inicial existente
      defaultModel: 'mistral7b',
      defaultStrategy: 'optimized',
      temperature: 0.7,
      maxTokens: 512,
      mockMode: true,
      
      // Estado inicial para tipo de ejecución
      executionType: 'simple',
      selectedFlowId: 'simple', // ✅ NUEVO: flujo seleccionado por defecto
      
      // Estado inicial para orchestrator
      orchestrator: {
        agents: ['research_agent', 'knowledge_agent'],
        tools: ['web_search', 'wikipedia'],
        verbose: false,
        enable_history: true,
        retry_on_error: true,
      },
      
      // Actions existentes
      setDefaultModel: (model) => set({ defaultModel: model }),
      setDefaultStrategy: (strategy) => set({ defaultStrategy: strategy }),
      setTemperature: (temp) => set({ temperature: temp }),
      setMaxTokens: (tokens) => set({ maxTokens: tokens }),
      toggleMockMode: () => set((state) => ({ mockMode: !state.mockMode })),
      
      // Actions para tipo de ejecución y flujo
      setExecutionType: (executionType) => set({ executionType }),
      setSelectedFlowId: (selectedFlowId) => set({ selectedFlowId }), // ✅ NUEVO
      
      // Actions para orchestrator
      setOrchestratorAgents: (agents) => 
        set((state) => ({ 
          orchestrator: { ...state.orchestrator, agents } 
        })),
      setOrchestratorTools: (tools) => 
        set((state) => ({ 
          orchestrator: { ...state.orchestrator, tools } 
        })),
      setOrchestratorVerbose: (verbose) => 
        set((state) => ({ 
          orchestrator: { ...state.orchestrator, verbose } 
        })),
      setOrchestratorHistory: (enable_history) => 
        set((state) => ({ 
          orchestrator: { ...state.orchestrator, enable_history } 
        })),
      setOrchestratorRetry: (retry_on_error) => 
        set((state) => ({ 
          orchestrator: { ...state.orchestrator, retry_on_error } 
        })),
    }),
    {
      name: 'ai-agent-lab-config',
    }
  )
);