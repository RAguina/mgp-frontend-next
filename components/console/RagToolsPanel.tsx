// components/console/RagToolsPanel.tsx

'use client';

import React from 'react';
import { useConfigStore } from '@/store/configStore';
import { Database, Brain, Cpu, Settings2, ChevronDown } from 'lucide-react';

const EMBEDDING_OPTIONS = [
  { value: "bge-m3", label: "BGE-M3 (Multilingual)" },
  { value: "e5-large", label: "E5-Large (English)" },
  { value: "openai-embed", label: "OpenAI Embeddings" },
  { value: "sentence-transformers", label: "Sentence Transformers" }
];

const VECTOR_DB_OPTIONS = [
  { value: "milvus", label: "Milvus (Open Source)" },
  { value: "weaviate", label: "Weaviate (Graph + Vector)" },
  { value: "pinecone", label: "Pinecone (Managed)" },
  { value: "chroma", label: "ChromaDB (Local)" }
];

export default function RagToolsPanel() {
  const {
    rag,
    setRagEnabled,
    setRagEmbeddingModel,
    setRagVectorStore,
    setRagConfig,
  } = useConfigStore();

  const handleConfigChange = (field: string, value: number) => {
    setRagConfig({ [field]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <label className="text-sm font-medium text-gray-700">
            RAG Tools (Optional)
          </label>
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={rag.enabled}
            onChange={(e) => setRagEnabled(e.target.checked)}
            className="sr-only"
          />
          <div className={`relative w-11 h-6 rounded-full transition-colors ${
            rag.enabled ? 'bg-purple-600' : 'bg-gray-200'
          }`}>
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              rag.enabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
          <span className="ml-2 text-xs text-gray-500">
            {rag.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {/* RAG Configuration - Only show when enabled */}
      {rag.enabled && (
        <div className="space-y-4 pt-2 border-t border-gray-100">
          
          {/* Embedding Model Selector */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Cpu className="w-4 h-4 mr-1" />
              Embedding Model
            </label>
            <div className="relative">
              <select
                value={rag.embedding_model}
                onChange={(e) => setRagEmbeddingModel(e.target.value)}
                className="w-full p-2 pr-8 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
              >
                {EMBEDDING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Vector Database Selector */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Database className="w-4 h-4 mr-1" />
              Vector Database
            </label>
            <div className="relative">
              <select
                value={rag.vector_store}
                onChange={(e) => setRagVectorStore(e.target.value)}
                className="w-full p-2 pr-8 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
              >
                {VECTOR_DB_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Configuration Parameters */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
              <Settings2 className="w-4 h-4 mr-1" />
              Configuration
            </label>
            
            <div className="bg-gray-50 p-3 rounded-lg space-y-3">
              {/* Top K */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">
                  Top K (documents to retrieve)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={rag.config.top_k}
                    onChange={(e) => handleConfigChange('top_k', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Threshold */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">
                  Similarity Threshold
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={rag.config.threshold}
                    onChange={(e) => handleConfigChange('threshold', parseFloat(e.target.value))}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Chunk Size */}
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">
                  Chunk Size (tokens)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="128"
                    max="2048"
                    step="128"
                    value={rag.config.chunk_size}
                    onChange={(e) => handleConfigChange('chunk_size', parseInt(e.target.value))}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="text-xs text-gray-500 bg-purple-50 p-2 rounded border-l-4 border-purple-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>
                RAG Active: {rag.embedding_model} + {rag.vector_store} 
                (K={rag.config.top_k}, Threshold={rag.config.threshold})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-400 italic">
        {rag.enabled 
          ? "RAG enhancement will be applied to any execution type selected above."
          : "Enable RAG to enhance responses with external knowledge retrieval."
        }
      </div>
    </div>
  );
}