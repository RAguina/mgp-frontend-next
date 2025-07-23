// app/page.tsx - Página principal

'use client';

import React, { useState, useCallback } from 'react';
import ExportControls from '@/components/output/ExportControls';
import { FlowVisualizer } from '@/components/flow/FlowVisualizer';
import { NodeDetailPanel } from '@/components/flow/NodeDetailPanel';
import ExecutionTypeSelector from '@/components/console/ExecutionTypeSelector';
import ModelSelector from '@/components/console/ModelSelector';
import { PromptConsole } from '@/components/console/PromptConsole';
import { MetricsPanel } from '@/components/panels/MetricsPanel';
import { OutputDisplay } from '@/components/output/OutputDisplay';
import { ExportButton } from '@/components/ui/ExportButton';
import { useExecution } from '@/hooks/useExecution';
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { NodeState } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Activity, Code } from 'lucide-react';

/**
 * Página principal de la aplicación
 */
export default function Home() {
  const [selectedNode, setSelectedNode] = useState<NodeState | null>(null);
  const { execute, isExecuting, currentExecution } = useExecution();
  const { metrics } = useSystemMetrics();

  /**
   * Maneja el envío de un prompt
   */
  const handlePromptSubmit = useCallback(async (prompt: string) => {
    setSelectedNode(null);
    await execute({ prompt });
  }, [execute]);

  /**
   * Maneja el click en un nodo del flujo
   */
  const handleNodeClick = useCallback((nodeId: string) => {
    const node = currentExecution?.flow.nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
    }
  }, [currentExecution]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Agent Lab</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <Activity className="w-4 h-4" />
              <span>Sistema: {metrics?.gpuAvailable ? 'GPU Disponible' : 'Sin GPU'}</span>
              {metrics?.vramFree && (
                <span>VRAM: {metrics.vramFree.toFixed(1)}GB libres</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-12 gap-6 h-full">
          
          {/* Columna Izquierda */}
          <div className="col-span-4 space-y-6">
            <PromptConsole onSubmit={handlePromptSubmit} isLoading={isExecuting} />
            {/* TODO: ModelSelector */}
            <div className="bg-white rounded-lg shadow p-4 text-gray-500 italic text-sm">
              <ModelSelector />
              <ExecutionTypeSelector />
            </div>
            <MetricsPanel execution={currentExecution} systemMetrics={metrics} />
          </div>

          {/* Columna Central */}
          <div className="col-span-5 space-y-4">
            <Tabs defaultValue="flow">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="stream">Live</TabsTrigger>
                <TabsTrigger value="flow">Flujo</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>

              {/* Panel Stream */}
              <TabsContent value="stream">
                <div className="bg-white p-6 rounded shadow text-gray-500 italic text-sm">
                  LiveStream aún no implementado
                </div>
              </TabsContent>

              {/* Panel Flujo */}
              <TabsContent value="flow" className="space-y-4">
                <ExportControls
                  flow={
                    currentExecution
                      ? {
                          executionId: currentExecution.id,
                          timestamp: currentExecution.timestamp,
                          flow: currentExecution.flow,
                          output: currentExecution.output,
                        }
                      : undefined
                  }
                />

                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="h-[500px] relative">
                    {currentExecution?.flow ? (
                      <FlowVisualizer
                        flowState={currentExecution.flow}
                        onNodeClick={handleNodeClick}
                        isExecuting={isExecuting}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Ingresa un prompt para visualizar el flujo de ejecución</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>


              {/* Panel Output */}
              <TabsContent value="output" className="space-y-4">
                <ExportControls 
                  output={currentExecution?.output} 
                  metrics={currentExecution?.metrics}
                />

                <OutputDisplay
                  output={currentExecution?.output || ''}
                  isLoading={isExecuting}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Columna Derecha */}
          <div className="col-span-3 space-y-4">
            {selectedNode ? (
              <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
            ) : (
              <div className="bg-white rounded-lg shadow p-4 text-gray-400 text-sm italic">
                Selecciona un nodo para ver detalles
              </div>
            )}
            {/* TODO: HistoryPanel */}
            <div className="bg-white rounded-lg shadow p-4 text-gray-500 italic text-sm">
              HistoryPanel aún no implementado
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
