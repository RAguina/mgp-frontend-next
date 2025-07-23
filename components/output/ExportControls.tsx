'use client';

import React from 'react';
import { ExportButton } from '@/components/ui/ExportButton';
import { ExecutionResult } from '@/lib/types';

interface ExportControlsProps {
  flow?: {
    executionId: string;
    timestamp: number;
    flow: ExecutionResult['flow'];
    output?: string;
  };
  output?: string;
  metrics?: ExecutionResult['metrics'];
}

/**
 * ExportControls permite exportar datos relacionados a la ejecución:
 * - Flow (JSON)
 * - Output (TXT)
 * - Métricas (JSON)
 */
export default function ExportControls({ flow, output, metrics }: ExportControlsProps) {
  const hasData = !!flow || !!output || !!metrics;

  if (!hasData) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-end items-center text-sm">
      {flow && (
        <ExportButton
          label="Exportar Flujo"
          filename="flow.json"
          data={flow}
          type="json"
        />
      )}

      {output && (
        <ExportButton
          label="Exportar Output"
          filename="output.txt"
          data={output}
          type="txt"
        />
      )}

      {metrics && (
        <ExportButton
          label="Exportar Métricas"
          filename="metrics.json"
          data={metrics}
          type="json"
        />
      )}
    </div>
  );
}
