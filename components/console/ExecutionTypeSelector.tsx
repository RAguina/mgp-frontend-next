// components/console/ExecutionTypeSelector.tsx

'use client';

import React from 'react';
import { useConfigStore } from '@/store/configStore';
import { Brain, Cpu, Settings, Zap } from 'lucide-react';

/**
 * Selector de tipo de ejecución: Simple LLM vs Orchestrator
 */
export default function ExecutionTypeSelector() {
  const {
    executionType,
    orchestrator,
    setExecutionType,
    setOrchestratorAgents,
    setOrchestratorTools,
    setOrchestratorVerbose,
  } = useConfigStore();

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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4">
      {/* Toggle Principal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Ejecución
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setExecutionType('simple')}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              executionType === 'simple'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Simple LLM</span>
            </div>
          </button>
          
          <button
            onClick={() => setExecutionType('orchestrator')}
            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
              executionType === 'orchestrator'
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Orchestrator</span>
            </div>
          </button>
        </div>
      </div>

      {/* Configuración del Orchestrator */}
      {executionType === 'orchestrator' && (
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

      {/* Indicador del tipo actual */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        {executionType === 'simple' ? (
          <span>✨ Ejecución directa con modelo LLM</span>
        ) : (
          <span>🤖 Ejecución con {orchestrator.agents.length} agentes y {orchestrator.tools.length} herramientas</span>
        )}
      </div>
    </div>
  );
}