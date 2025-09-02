// components/rag/RAGProcessingStatus.tsx

'use client';

import React from 'react';
import { 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  Clock,
  Upload,
  Scissors,
  Brain,
  Database,
  BarChart3
} from 'lucide-react';
import { RagProcessingPipeline, RagProcessingStep } from '@/lib/types';

interface RAGProcessingStatusProps {
  pipeline: RagProcessingPipeline;
  onClose?: () => void;
}

const STEP_ICONS: Record<string, React.ReactNode> = {
  upload: <Upload className="w-4 h-4" />,
  chunking: <Scissors className="w-4 h-4" />,
  embedding: <Brain className="w-4 h-4" />,
  indexing: <Database className="w-4 h-4" />,
  validation: <BarChart3 className="w-4 h-4" />,
};

const STEP_DESCRIPTIONS: Record<string, string> = {
  upload: 'Uploading and validating documents',
  chunking: 'Splitting documents into chunks',
  embedding: 'Generating vector embeddings',
  indexing: 'Storing vectors in database',
  validation: 'Validating and analyzing results',
};

export default function RAGProcessingStatus({ pipeline, onClose }: RAGProcessingStatusProps) {
  const getStepIcon = (step: RagProcessingStep) => {
    const baseIcon = STEP_ICONS[step.id] || <Clock className="w-4 h-4" />;
    
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
      default:
        return <div className="w-4 h-4 text-gray-400">{baseIcon}</div>;
    }
  };

  const getStepStatusColor = (status: RagProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'running':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'pending':
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getOverallProgress = () => {
    const completedSteps = pipeline.steps.filter(s => s.status === 'completed').length;
    return Math.round((completedSteps / pipeline.steps.length) * 100);
  };

  const formatDuration = (startTime?: string, endTime?: string) => {
    if (!startTime) return '';
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const durationMs = end.getTime() - start.getTime();
    
    if (durationMs < 1000) return `${durationMs}ms`;
    if (durationMs < 60000) return `${(durationMs / 1000).toFixed(1)}s`;
    return `${(durationMs / 60000).toFixed(1)}m`;
  };

  const overallProgress = getOverallProgress();
  const currentStep = pipeline.steps.find(s => s.status === 'running');
  const hasError = pipeline.steps.some(s => s.status === 'error');

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {pipeline.overall_status === 'running' && (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          )}
          {pipeline.overall_status === 'completed' && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          {pipeline.overall_status === 'error' && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <h3 className="text-sm font-semibold text-gray-900">
            Processing RAG
          </h3>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Overall Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              hasError ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        
        {currentStep && (
          <p className="text-xs text-gray-500 mt-1">
            Currently: {STEP_DESCRIPTIONS[currentStep.id] || currentStep.name}
            {currentStep.progress && ` (${currentStep.progress}%)`}
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {pipeline.steps.map((step) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg border ${getStepStatusColor(step.status)}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getStepIcon(step)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium truncate">
                    {step.name}
                  </h4>
                  <span className="text-xs ml-2">
                    {step.status === 'running' && step.progress && `${step.progress}%`}
                    {step.status === 'completed' && '✓'}
                    {step.status === 'error' && '✗'}
                  </span>
                </div>
                
                {step.message && (
                  <p className="text-xs opacity-75 mt-1 truncate">
                    {step.message}
                  </p>
                )}
                
                {step.started_at && (
                  <p className="text-xs opacity-60 mt-1">
                    Duration: {formatDuration(step.started_at, step.completed_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Progress bar for running steps */}
            {step.status === 'running' && step.progress !== undefined && (
              <div className="mt-2">
                <div className="w-full bg-white bg-opacity-50 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-current transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer with timing */}
      {pipeline.started_at && (
        <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
          {pipeline.overall_status === 'completed' ? (
            <span>
              Completed in {formatDuration(pipeline.started_at, pipeline.completed_at)}
            </span>
          ) : (
            <span>
              Running for {formatDuration(pipeline.started_at)}
            </span>
          )}
        </div>
      )}

      {/* Error details */}
      {hasError && (
        <div className="mt-4 pt-3 border-t border-red-200 bg-red-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
          <div className="flex items-center gap-2 text-sm text-red-800 font-medium mb-1">
            <AlertCircle className="w-4 h-4" />
            Processing Failed
          </div>
          {pipeline.steps
            .filter(s => s.status === 'error')
            .map(step => (
              <p key={step.id} className="text-xs text-red-700">
                {step.name}: {step.message || 'Unknown error occurred'}
              </p>
            ))
          }
        </div>
      )}
    </div>
  );
}

// Hook para usar el componente como toast/modal
export function useRAGProcessingStatus() {
  const [activePipelines, setActivePipelines] = React.useState<RagProcessingPipeline[]>([]);

  const addPipeline = (pipeline: RagProcessingPipeline) => {
    setActivePipelines(prev => [...prev, pipeline]);
  };

  const updatePipeline = (ragId: string, updatedPipeline: RagProcessingPipeline) => {
    setActivePipelines(prev => 
      prev.map(p => p.rag_id === ragId ? updatedPipeline : p)
    );
  };

  const removePipeline = (ragId: string) => {
    setActivePipelines(prev => prev.filter(p => p.rag_id !== ragId));
  };

  return {
    activePipelines,
    addPipeline,
    updatePipeline,
    removePipeline,
  };
}