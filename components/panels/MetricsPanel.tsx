// components/panels/MetricsPanel.tsx - Panel de métricas

'use client';

import React from 'react';
import { Activity, Cpu, Clock, Zap, HardDrive } from 'lucide-react';
import { ExecutionResult, SystemMetrics } from '@/lib/types';
import { formatExecutionTime, cn } from '@/lib/utils';

/**
 * Props para el componente MetricsPanel
 */
interface MetricsPanelProps {
  /** Resultado de la ejecución */
  execution?: ExecutionResult | null;
  /** Métricas del sistema */
  systemMetrics?: SystemMetrics | null;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente para mostrar métricas de ejecución y sistema
 * @param props - Props del componente
 */
export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  execution,
  systemMetrics,
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Métricas del Sistema */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Métricas del Sistema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Cpu className="w-5 h-5" />}
            label="GPU"
            value={systemMetrics?.gpuAvailable ? 'Disponible' : 'No disponible'}
            color={systemMetrics?.gpuAvailable ? 'green' : 'red'}
          />
          <MetricCard
            icon={<HardDrive className="w-5 h-5" />}
            label="VRAM Total"
            value={`${systemMetrics?.vramTotal || 0} GB`}
            color="blue"
          />
          <MetricCard
            icon={<HardDrive className="w-5 h-5" />}
            label="VRAM Libre"
            value={`${systemMetrics?.vramFree?.toFixed(1) || 0} GB`}
            color="green"
          />
          <MetricCard
            icon={<Zap className="w-5 h-5" />}
            label="Modelos en Caché"
            value={systemMetrics?.modelsInCache?.length || 0}
            color="purple"
          />
        </div>
      </div>

      {/* Métricas de Ejecución */}
      {execution && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Métricas de Ejecución
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              icon={<Clock className="w-5 h-5" />}
              label="Tiempo Total"
              value={formatExecutionTime(execution.metrics.totalTime)}
              color="blue"
            />
            <MetricCard
              icon={<Zap className="w-5 h-5" />}
              label="Tokens Generados"
              value={execution.metrics.tokensGenerated}
              color="green"
            />
            <MetricCard
              icon={<Cpu className="w-5 h-5" />}
              label="Modelos Usados"
              value={execution.metrics.modelsUsed.join(', ')}
              color="purple"
            />
          </div>

          {/* Timeline de nodos */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline de Ejecución</h4>
            <div className="space-y-2">
              {execution.flow.nodes.map((node) => (
                <div key={node.id} className="flex items-center gap-3 text-sm">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    node.status === 'completed' ? 'bg-green-500' : 
                    node.status === 'failed' ? 'bg-red-500' :
                    node.status === 'skipped' ? 'bg-amber-500' : 'bg-gray-500'
                  )} />
                  <span className="font-medium">{node.label}</span>
                  {node.data?.executionTime && (
                    <span className="text-gray-500">
                      ({formatExecutionTime(node.data.executionTime)})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Componente para mostrar una métrica individual
 */
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className={cn("inline-flex p-2 rounded-lg mb-2", colorClasses[color])}>
        {icon}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
};