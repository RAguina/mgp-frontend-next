// components/console/ExecutionTypeSelector.tsx

'use client';

import React from 'react';
import { useConfigStore } from '@/store/configStore';
import { Brain, Cpu, Settings, Zap, Layers, GitBranch } from 'lucide-react';
import { flowRegistry } from '@/lib/flowRegistry';

/**
 * Selector de tipo de ejecución con soporte para flujos dinámicos
 */
export default function ExecutionTypeSelector() {
  const {
    executionType,
    selectedFlowId,
    orchestrator,
    setExecutionType,
    setSelectedFlowId,
    setOrchestratorAgents,
    setOrchestratorTools,
    setOrchestratorVerbose,
  } = useConfigStore();

  // Obtener flujos disponibles del registry
  const availableFlows = flowRegistry.list();
  
  const availableAgents = [
    'research_agent',
    'knowledge_agent', 
    'task_analyzer',
    'validator_agent',
    'summary_agent'
  ];

  const availableTools = [
    'web_search',
    'wikipedia',
    'calculator',
    'code_executor',
    'file_reader'
  ];

  const handleAgentToggle = (agent: string) => {
    const newAgents = orchestrator.agents.includes(agent)
      ? orchestrator.agents.filter(a => a !== agent)
      : [...orchestrator.agents, agent];
    setOrchestratorAgents(newAgents);
  };

  const handleToolToggle = (tool: string) => {
    const newTools = orchestrator.tools.includes(tool)
      ? orchestrator.tools.filter(t => t !== tool)
      : [...orchestrator.tools, tool];
    setOrchestratorTools(newTools);
  };

  const handleFlowSelection = (flowId: string) => {
    const flow = flowRegistry.get(flowId);
    if (flow) {
      setSelectedFlowId(flowId);
      // Establecer el execution_type basado en la configuración del flujo
      const execType = flow.requestConfig?.execution_type || 'orchestrator';
      setExecutionType(execType as 'simple' | 'orchestrator' | 'challenge');
    }
  };

  // Iconos para cada tipo de flujo
  const flowIcons: Record<string, React.ReactNode> = {
    simple: <Zap className="w-4 h-4" />,
    linear: <Brain className="w-4 h-4" />,
    challenge: <GitBranch className="w-4 h-4" />,
    research: <Layers className="w-4 h-4" />,
  };

  // Colores para cada tipo de flujo
  const flowColors: Record<string, { active: string; inactive: string }> = {
    simple: {
      active: 'bg-blue-50 border-blue-200 text-blue-700',
      inactive: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
    },
    linear: {
      active: 'bg-purple-50 border-purple-200 text-purple-700',
      inactive: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
    },
    challenge: {
      active: 'bg-green-50 border-green-200 text-green-700',
      inactive: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
    },
    research: {
      active: 'bg-amber-50 border-amber-200 text-amber-700',
      inactive: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4">
      {/* Selector de Tipo de Flujo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Ejecución
        </label>
        
        {/* Modo Simple LLM */}
        <div className="mb-2">
          <button
            onClick={() => {
              setExecutionType('simple');
              setSelectedFlowId('simple');
            }}
            className={`w-full p-3 rounded-lg border text-sm font-medium transition-all ${
              executionType === 'simple'
                ? flowColors.simple.active
                : flowColors.simple.inactive
            }`}
          >
            <div className="flex items-center gap-2">
              {flowIcons.simple}
              <div className="text-left flex-1">
                <div>Simple LLM</div>
                <div className="text-xs font-normal opacity-75">
                  Ejecución directa con modelo único
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Flujos de Orchestrator */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Flujos Avanzados
          </div>
          {availableFlows.map((flow) => {
            const isActive = selectedFlowId === flow.id;
            const colors = flowColors[flow.id] || flowColors.linear;
            
            return (
              <button
                key={flow.id}
                onClick={() => handleFlowSelection(flow.id)}
                className={`w-full p-3 rounded-lg border text-sm font-medium transition-all ${
                  isActive ? colors.active : colors.inactive
                }`}
              >
                <div className="flex items-center gap-2">
                  {flowIcons[flow.id] || flowIcons.linear}
                  <div className="text-left flex-1">
                    <div>{flow.name}</div>
                    <div className="text-xs font-normal opacity-75">
                      {flow.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuración del Orchestrator - Solo mostrar para flujos que lo requieran */}
      {executionType === 'orchestrator' && selectedFlowId !== 'challenge' && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          
          {/* Agents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Cpu className="w-4 h-4 inline mr-1" />
              Agentes ({orchestrator.agents.length})
            </label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {availableAgents.map((agent) => (
                <label key={agent} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={orchestrator.agents.includes(agent)}
                    onChange={() => handleAgentToggle(agent)}
                    className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-600">{agent}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Settings className="w-4 h-4 inline mr-1" />
              Herramientas ({orchestrator.tools.length})
            </label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {availableTools.map((tool) => (
                <label key={tool} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={orchestrator.tools.includes(tool)}
                    onChange={() => handleToolToggle(tool)}
                    className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-600">{tool}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Verbose Toggle */}
          <div>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={orchestrator.verbose}
                onChange={(e) => setOrchestratorVerbose(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-600">Modo verbose (logs detallados)</span>
            </label>
          </div>
        </div>
      )}

      {/* Challenge Flow Config - Configuración específica */}
      {selectedFlowId === 'challenge' && (
        <div className="pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Creator: Genera solución inicial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Challenger: Analiza y critica</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Refiner: Mejora basado en críticas</span>
            </div>
          </div>
        </div>
      )}

      {/* Indicador del estado actual */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        {executionType === 'simple' ? (
          <span>✨ Ejecución directa con modelo LLM</span>
        ) : selectedFlowId === 'challenge' ? (
          <span>🔄 Flujo de desafío con 3 etapas de refinamiento</span>
        ) : (
          <span>🤖 Ejecución con {orchestrator.agents.length} agentes y {orchestrator.tools.length} herramientas</span>
        )}
      </div>
    </div>
  );
}