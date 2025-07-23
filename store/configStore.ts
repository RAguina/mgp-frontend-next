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
  
  // ✅ NUEVO: Tipo de ejecución
  executionType: 'simple' | 'orchestrator';
  
  // ✅ NUEVO: Configuración del orchestrator
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
  
  // ✅ NUEVO: Actions para orchestrator
  setExecutionType: (type: 'simple' | 'orchestrator') => void;
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
      
      // ✅ NUEVO: Estado inicial para orchestrator
      executionType: 'simple',
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
      
      // ✅ NUEVO: Actions para orchestrator
      setExecutionType: (executionType) => set({ executionType }),
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