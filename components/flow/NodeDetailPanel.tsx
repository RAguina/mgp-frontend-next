// components/flow/NodeDetailPanel.tsx - Panel de detalles del nodo

import React from 'react';
import { X, Cpu, Clock, Zap, FileText, AlertTriangle } from 'lucide-react';
import { NodeState } from '@/lib/types';
import { formatExecutionTime, cn } from '@/lib/utils';

/**
 * Props para el componente NodeDetailPanel
 */
interface NodeDetailPanelProps {
  /** Nodo a mostrar */
  node: NodeState | null;
  /** Callback para cerrar el panel */
  onClose: () => void;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Panel lateral para mostrar detalles de un nodo
 * @param props - Props del componente
 */
export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({
  node,
  onClose,
  className,
}) => {
  if (!node) return null;

  const statusColors = {
    pending: 'text-gray-500 bg-gray-50',
    running: 'text-blue-500 bg-blue-50',
    completed: 'text-green-500 bg-green-50',
    failed: 'text-red-500 bg-red-50',
    skipped: 'text-amber-500 bg-amber-50',
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-xl p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{node.label}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Status */}
      <div className="mb-6">
        <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", statusColors[node.status])}>
          {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
        </div>
      </div>

      {/* Details */}
      {node.data && (
        <div className="space-y-4">
          {node.data.model && (
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Modelo</div>
                <div className="text-sm text-gray-600">{node.data.model}</div>
              </div>
            </div>
          )}

          {node.data.strategy && (
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Estrategia</div>
                <div className="text-sm text-gray-600">{node.data.strategy}</div>
              </div>
            </div>
          )}

          {node.data.executionTime && (
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Tiempo de ejecución</div>
                <div className="text-sm text-gray-600">{formatExecutionTime(node.data.executionTime)}</div>
              </div>
            </div>
          )}

          {node.data.tokensUsed && (
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Tokens utilizados</div>
                <div className="text-sm text-gray-600">{node.data.tokensUsed}</div>
              </div>
            </div>
          )}

          {node.data.decision && (
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Decisión</div>
                <div className="text-sm text-gray-600">{node.data.decision}</div>
              </div>
            </div>
          )}

          {node.data.error && (
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Error</div>
                <div className="text-sm text-red-600">{node.data.error}</div>
              </div>
            </div>
          )}

          {node.data.output && (
            <div className="mt-6">
              <div className="text-sm font-medium text-gray-700 mb-2">Output</div>
              <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">
                {node.data.output}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};