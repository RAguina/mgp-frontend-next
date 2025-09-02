// components/rag/RAGUsagePanel.tsx

'use client';

import React, { useState } from 'react';
import { useConfigStore } from '@/store/configStore';
import { 
  Database, 
  Settings, 
  Eye, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText
} from 'lucide-react';
import { RagArtifact, RagUsageConfig } from '@/lib/types';

// Mock RAGs disponibles - en implementación real vendría de API
const AVAILABLE_RAGS: RagArtifact[] = [
  {
    id: 'rag_1',
    name: 'Outlier Documentation',
    description: 'Complete Outlier platform documentation and guides',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    status: 'ready',
    documents: [
      { id: 'doc_1', filename: 'user-guide.pdf', type: 'pdf', size: 1024000, uploaded_at: '2024-01-15T10:30:00Z', status: 'processed' },
      { id: 'doc_2', filename: 'api-reference.md', type: 'md', size: 512000, uploaded_at: '2024-01-15T10:30:00Z', status: 'processed' },
    ],
    processing_config: {
      chunk_size: 512,
      chunk_overlap: 50,
      embedding_model: 'bge-m3',
      vector_store: 'milvus',
      quality_filters: {
        min_chunk_length: 100,
        remove_duplicates: true,
        language_filter: 'auto',
      }
    },
    metrics: {
      total_chunks: 1247,
      duplicates_removed: 89,
      avg_quality_score: 0.85,
      processing_time_ms: 45000,
      storage_size_mb: 12.3,
      index_size: 1247,
    }
  },
  {
    id: 'rag_3',
    name: 'Support Knowledge Base',
    description: 'Customer support articles and FAQs',
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-05T09:15:00Z',
    status: 'ready',
    documents: [
      { id: 'doc_4', filename: 'faq.md', type: 'md', size: 128000, uploaded_at: '2024-01-05T09:15:00Z', status: 'processed' },
    ],
    processing_config: {
      chunk_size: 256,
      chunk_overlap: 20,
      embedding_model: 'e5-large',
      vector_store: 'weaviate',
      quality_filters: {
        min_chunk_length: 50,
        remove_duplicates: false,
      }
    },
    metrics: {
      total_chunks: 456,
      duplicates_removed: 12,
      avg_quality_score: 0.78,
      processing_time_ms: 12000,
      storage_size_mb: 3.2,
      index_size: 456,
    }
  }
];

export default function RAGUsagePanel() {
  const {
    rag: legacyRagConfig,
    setRagEnabled,
  } = useConfigStore();

  const [selectedRagId, setSelectedRagId] = useState<string>('');
  const [ragUsageConfig, setRagUsageConfig] = useState<RagUsageConfig>({
    rag_id: '',
    retrieval_config: {
      top_k: 5,
      threshold: 0.7,
      rerank: false,
      hybrid_search: false,
    }
  });

  // Filtrar solo RAGs que están listos para usar
  const readyRags = AVAILABLE_RAGS.filter(rag => rag.status === 'ready');
  const selectedRag = readyRags.find(rag => rag.id === selectedRagId);

  const handleRagSelection = (ragId: string) => {
    setSelectedRagId(ragId);
    setRagUsageConfig(prev => ({ ...prev, rag_id: ragId }));
    // Habilitar RAG cuando se selecciona uno
    if (ragId) {
      setRagEnabled(true);
    }
  };

  const handleRetrievalConfigChange = (field: keyof RagUsageConfig['retrieval_config'], value: number | boolean) => {
    setRagUsageConfig(prev => ({
      ...prev,
      retrieval_config: {
        ...prev.retrieval_config,
        [field]: value
      }
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (readyRags.length === 0) {
    return (
      <div className="text-center py-8">
        <Database className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No RAGs Available</h3>
        <p className="text-gray-500 mb-4">Create and process a RAG first to use it for conversations.</p>
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-700">
          💡 Go to the <strong>Create</strong> tab to build your first RAG, then return here to configure its usage.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RAG Selection */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Database className="w-4 h-4" />
          Select RAG for Conversations
        </h4>
        
        <div className="space-y-2">
          {/* None Option */}
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="rag-selection"
              value=""
              checked={selectedRagId === ''}
              onChange={() => {
                handleRagSelection('');
                setRagEnabled(false);
              }}
              className="mr-3 text-purple-600 focus:ring-purple-500"
            />
            <div>
              <div className="text-sm font-medium text-gray-900">No RAG</div>
              <div className="text-xs text-gray-500">Use standard LLM without knowledge retrieval</div>
            </div>
          </label>

          {/* Available RAGs */}
          {readyRags.map((rag) => (
            <label
              key={rag.id}
              className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedRagId === rag.id
                  ? 'border-purple-200 bg-purple-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="rag-selection"
                value={rag.id}
                checked={selectedRagId === rag.id}
                onChange={() => handleRagSelection(rag.id)}
                className="mt-1 mr-3 text-purple-600 focus:ring-purple-500"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm font-medium text-gray-900">{rag.name}</div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                
                {rag.description && (
                  <div className="text-xs text-gray-600 mb-2">{rag.description}</div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {rag.documents.length} doc{rag.documents.length !== 1 ? 's' : ''}
                  </span>
                  {rag.metrics && (
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {rag.metrics.total_chunks} chunks
                    </span>
                  )}
                  <span>Created {formatDate(rag.created_at)}</span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Retrieval Configuration - Only show when a RAG is selected */}
      {selectedRag && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Retrieval Configuration
          </h4>
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            {/* Basic Retrieval Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Top K (documents to retrieve)</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={ragUsageConfig.retrieval_config.top_k}
                  onChange={(e) => handleRetrievalConfigChange('top_k', parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Similarity Threshold</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={ragUsageConfig.retrieval_config.threshold}
                  onChange={(e) => handleRetrievalConfigChange('threshold', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={ragUsageConfig.retrieval_config.rerank}
                  onChange={(e) => handleRetrievalConfigChange('rerank', e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Re-rank results for better relevance
              </label>
              
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={ragUsageConfig.retrieval_config.hybrid_search}
                  onChange={(e) => handleRetrievalConfigChange('hybrid_search', e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Enable hybrid search (semantic + keyword)
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Selected RAG Info */}
      {selectedRag && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Current RAG Configuration
          </h4>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-purple-700">RAG:</span>
              <span className="text-purple-900 font-medium">{selectedRag.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Embedding Model:</span>
              <span className="text-purple-900">{selectedRag.processing_config.embedding_model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Vector Store:</span>
              <span className="text-purple-900">{selectedRag.processing_config.vector_store}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Retrieval:</span>
              <span className="text-purple-900">
                Top-{ragUsageConfig.retrieval_config.top_k}, Threshold {ragUsageConfig.retrieval_config.threshold}
              </span>
            </div>
            {selectedRag.metrics && (
              <div className="flex justify-between">
                <span className="text-purple-700">Knowledge Base:</span>
                <span className="text-purple-900">
                  {selectedRag.metrics.total_chunks} chunks, {selectedRag.metrics.storage_size_mb.toFixed(1)} MB
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legacy Warning - Remove after migration */}
      {legacyRagConfig.enabled && !selectedRagId && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <div>
              <div className="font-medium">Legacy RAG Configuration Detected</div>
              <div className="text-xs text-amber-700 mt-1">
                You have legacy RAG settings enabled. Please select a RAG artifact above for better performance.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        💡 <strong>How it works:</strong> Select a RAG to enhance your conversations with relevant knowledge. 
        The system will automatically retrieve relevant chunks based on your prompt and include them as context for the LLM.
      </div>
    </div>
  );
}