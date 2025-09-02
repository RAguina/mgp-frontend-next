// components/rag/RAGManagementPanel.tsx

'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  Clock, 
  FileText, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { RagArtifact } from '@/lib/types';

// Mock data - en implementación real vendría de API
const MOCK_RAGS: RagArtifact[] = [
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
    id: 'rag_2',
    name: 'Legal Documents RAG',
    description: 'Company policies and legal documentation',
    created_at: '2024-01-10T14:20:00Z',
    updated_at: '2024-01-10T14:20:00Z',
    status: 'processing',
    documents: [
      { id: 'doc_3', filename: 'privacy-policy.pdf', type: 'pdf', size: 256000, uploaded_at: '2024-01-10T14:20:00Z', status: 'processing' },
    ],
    processing_config: {
      chunk_size: 768,
      chunk_overlap: 25,
      embedding_model: 'e5-large',
      vector_store: 'pinecone',
      quality_filters: {
        min_chunk_length: 200,
        remove_duplicates: true,
      }
    }
  },
  {
    id: 'rag_3',
    name: 'Support Knowledge Base',
    description: 'Customer support articles and FAQs',
    created_at: '2024-01-05T09:15:00Z',
    updated_at: '2024-01-05T09:15:00Z',
    status: 'error',
    error_message: 'Failed to embed documents: API rate limit exceeded',
    documents: [
      { id: 'doc_4', filename: 'faq.md', type: 'md', size: 128000, uploaded_at: '2024-01-05T09:15:00Z', status: 'error' },
    ],
    processing_config: {
      chunk_size: 256,
      chunk_overlap: 20,
      embedding_model: 'openai-embed',
      vector_store: 'weaviate',
      quality_filters: {
        min_chunk_length: 50,
        remove_duplicates: false,
      }
    }
  }
];

export default function RAGManagementPanel() {
  const [rags, setRags] = useState<RagArtifact[]>(MOCK_RAGS);
  const [selectedRag, setSelectedRag] = useState<RagArtifact | null>(null);

  const getStatusIcon = (status: RagArtifact['status']) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
      case 'creating':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: RagArtifact['status']) => {
    switch (status) {
      case 'ready': return 'Ready';
      case 'processing': return 'Processing';
      case 'creating': return 'Creating';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDelete = (ragId: string) => {
    if (confirm('Are you sure you want to delete this RAG? This action cannot be undone.')) {
      setRags(prev => prev.filter(r => r.id !== ragId));
      if (selectedRag?.id === ragId) {
        setSelectedRag(null);
      }
    }
  };

  const handleDuplicate = (rag: RagArtifact) => {
    const newRag: RagArtifact = {
      ...rag,
      id: `rag_${Date.now()}`,
      name: `${rag.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'creating',
      metrics: undefined,
    };
    setRags(prev => [newRag, ...prev]);
  };

  if (rags.length === 0) {
    return (
      <div className="text-center py-8">
        <Database className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No RAGs Created</h3>
        <p className="text-gray-500 mb-4">Create your first RAG in the Create tab to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* RAG List */}
      <div className="space-y-3">
        {rags.map((rag) => (
          <div
            key={rag.id}
            className={`p-4 border rounded-lg transition-colors cursor-pointer ${
              selectedRag?.id === rag.id
                ? 'border-purple-200 bg-purple-50'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
            onClick={() => setSelectedRag(selectedRag?.id === rag.id ? null : rag)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{rag.name}</h4>
                  {getStatusIcon(rag.status)}
                  <span className="text-xs text-gray-500">{getStatusText(rag.status)}</span>
                </div>
                
                {rag.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{rag.description}</p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {rag.documents.length} doc{rag.documents.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(rag.created_at)}
                  </span>
                  {rag.metrics && (
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {rag.metrics.total_chunks} chunks
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRag(rag);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(rag);
                  }}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement edit functionality
                    alert('Edit functionality coming soon!');
                  }}
                  className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(rag.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {rag.status === 'error' && rag.error_message && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <strong>Error:</strong> {rag.error_message}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Selected RAG Details */}
      {selectedRag && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            RAG Details: {selectedRag.name}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-2">Information</h5>
              <div className="space-y-1 text-xs">
                <div><span className="text-gray-500">Status:</span> {getStatusText(selectedRag.status)}</div>
                <div><span className="text-gray-500">Created:</span> {formatDate(selectedRag.created_at)}</div>
                <div><span className="text-gray-500">Documents:</span> {selectedRag.documents.length}</div>
                <div><span className="text-gray-500">Model:</span> {selectedRag.processing_config.embedding_model}</div>
                <div><span className="text-gray-500">Vector Store:</span> {selectedRag.processing_config.vector_store}</div>
              </div>
            </div>

            {/* Metrics */}
            {selectedRag.metrics && (
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-2">Metrics</h5>
                <div className="space-y-1 text-xs">
                  <div><span className="text-gray-500">Total Chunks:</span> {selectedRag.metrics.total_chunks.toLocaleString()}</div>
                  <div><span className="text-gray-500">Duplicates Removed:</span> {selectedRag.metrics.duplicates_removed}</div>
                  <div><span className="text-gray-500">Avg Quality:</span> {(selectedRag.metrics.avg_quality_score * 100).toFixed(1)}%</div>
                  <div><span className="text-gray-500">Storage Size:</span> {selectedRag.metrics.storage_size_mb.toFixed(1)} MB</div>
                  <div><span className="text-gray-500">Processing Time:</span> {(selectedRag.metrics.processing_time_ms / 1000).toFixed(1)}s</div>
                </div>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="mt-4">
            <h5 className="text-xs font-medium text-gray-700 mb-2">Documents</h5>
            <div className="space-y-1">
              {selectedRag.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between text-xs bg-white p-2 rounded">
                  <span className="truncate">{doc.filename}</span>
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-gray-500">{formatFileSize(doc.size)}</span>
                    <span className={`px-1 py-0.5 rounded text-xs ${
                      doc.status === 'processed' ? 'bg-green-100 text-green-700' :
                      doc.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      doc.status === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}