//history/page.tsx
'use client';

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useExecutionStore } from '@/hooks/useExecution';

/**
 * Página de historial de ejecuciones
 */
export default function HistoryPage() {
  const { executionHistory, clearHistory } = useExecutionStore();

  // Agrega una entrada mock automáticamente si no hay historial
  useEffect(() => {
    if (executionHistory.length === 0) {
      const mockExecution = {
        id: uuidv4(),
        timestamp: Date.now(),
        output: 'Este es un output simulado generado por el sistema.',
        params: {
          prompt: 'Simulá una ejecución para ver cómo se muestra en el historial.',
          model: 'mistral7b',
          strategy: 'optimized',
        },
        flow: { nodes: [], edges: [] },
        metrics: {
          totalTime: 1150,
          tokensGenerated: 78,
          modelsUsed: ['mistral7b'],
        },
      };

      useExecutionStore.getState().addToHistory(mockExecution);
    }
  }, [executionHistory]);

  // Borra el historial con confirmación
  const handleClear = () => {
    const confirmed = confirm("¿Estás seguro de que querés borrar todo el historial?");
    if (confirmed) {
      clearHistory();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Historial de Ejecuciones</h1>
        {executionHistory.length > 0 && (
          <button
            onClick={handleClear}
            className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
          >
            Borrar historial
          </button>
        )}
      </div>

      {executionHistory.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">Aún no hay ejecuciones.</p>
      ) : (
        <div className="space-y-6">
          {executionHistory.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700"
            >
              <p className="text-sm text-gray-400 mb-1">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-300 mb-2 italic">
                Prompt: {entry.params.prompt}
              </p>
              <div className="text-white font-mono text-sm whitespace-pre-line mb-2">
                {entry.output}
              </div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>Modelo: {entry.params.model ?? 'N/A'}</span>
                <span>Estrategia: {entry.params.strategy ?? 'default'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
