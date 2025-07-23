// components/OutputDisplay.tsx - Componente para mostrar el output

'use client';

import React from 'react';
import { Copy, CheckCircle, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props para el componente OutputDisplay
 */
interface OutputDisplayProps {
  /** Output a mostrar */
  output: string;
  /** Si está cargando */
  isLoading?: boolean;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente para mostrar el output generado
 * @param props - Props del componente
 */
export const OutputDisplay: React.FC<OutputDisplayProps> = ({
  output,
  isLoading = false,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  /**
   * Copia el output al portapapeles
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-lg", className)}>
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Output Generado</h3>
        </div>
        {output && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="space-y-3 text-center">
              <div className="animate-pulse flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="animate-pulse flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="animate-pulse flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : output ? (
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {output}
          </pre>
        ) : (
          <p className="text-gray-400 text-center py-12">
            El output aparecerá aquí después de la ejecución
          </p>
        )}
      </div>
    </div>
  );
};