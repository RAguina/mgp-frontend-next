// components/panels/HistoryPanel.tsx

'use client';

import React from 'react';
import { useExecutionStore } from '@/hooks/useExecution';
import { Clock, History } from 'lucide-react';

/**
 * Panel lateral que muestra el historial de ejecuciones recientes
 */
export default function HistoryPanel() {
  const { executionHistory, setCurrentExecution } = useExecutionStore();

  if (executionHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-gray-400 text-sm italic">
        Aún no hay ejecuciones en el historial.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 max-h-[400px] overflow-y-auto space-y-3">
      <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold text-sm">
        <History className="w-4 h-4" />
        Historial Reciente
      </div>

      {executionHistory.map((entry) => (
        <button
          key={entry.id}
          onClick={() => setCurrentExecution(entry)}
          className="w-full text-left text-sm p-2 rounded hover:bg-gray-100 transition border border-gray-200"
        >
          <div className="text-gray-800 font-medium truncate">
            {entry.params.prompt}
          </div>
          <div className="text-gray-500 text-xs flex justify-between">
            <span>{entry.params.model} / {entry.params.strategy}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
