// components/rag/RAGCreationPanel.tsx

'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Settings, Play, AlertCircle } from 'lucide-react';
import { RagDocument, RagProcessingConfig } from '@/lib/types';

const EMBEDDING_MODELS = [
  { value: 'bge-m3', label: 'BGE-M3 (Multilingual)', description: 'Best for multilingual content' },
  { value: 'e5-large', label: 'E5-Large (English)', description: 'High quality English embeddings' },
  { value: 'openai-embed', label: 'OpenAI Embeddings', description: 'Commercial, high performance' },
  { value: 'sentence-transformers', label: 'Sentence Transformers', description: 'Open source, versatile' },
];

const VECTOR_STORES = [
  { value: 'milvus', label: 'Milvus', description: 'Open source vector database' },
  { value: 'weaviate', label: 'Weaviate', description: 'Graph + vector hybrid' },
  { value: 'pinecone', label: 'Pinecone', description: 'Managed vector service' },
  { value: 'chroma', label: 'ChromaDB', description: 'Local vector database' },
];

export default function RAGCreationPanel() {
  const [ragName, setRagName] = useState('');
  const [ragDescription, setRagDescription] = useState('');
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [processingConfig, setProcessingConfig] = useState<RagProcessingConfig>({
    chunk_size: 512,
    chunk_overlap: 50,
    embedding_model: 'bge-m3',
    vector_store: 'milvus',
    quality_filters: {
      min_chunk_length: 100,
      remove_duplicates: true,
      language_filter: 'auto',
      quality_threshold: 0.3,
    },
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList) => {
    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      const doc: RagDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename: file.name,
        type: getFileType(file.name),
        size: file.size,
        uploaded_at: new Date().toISOString(),
        status: 'uploading',
      };
      
      setDocuments(prev => [...prev, doc]);
      
      // Simular upload (aquí iría la lógica real de upload)
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? { ...d, status: 'uploaded' as const } : d)
        );
      }, 1000 + Math.random() * 2000);
    }
    
    setIsUploading(false);
  };

  const getFileType = (filename: string): RagDocument['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'pdf';
      case 'md': case 'markdown': return 'md';
      case 'txt': return 'txt';
      case 'docx': case 'doc': return 'docx';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'image';
      default: return 'txt';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleCreateRAG = async () => {
    if (!ragName.trim()) {
      alert('Please enter a RAG name');
      return;
    }
    
    if (documents.length === 0) {
      alert('Please upload at least one document');
      return;
    }

    // Aquí iría la lógica real para crear el RAG
    console.log('Creating RAG:', {
      name: ragName,
      description: ragDescription,
      documents,
      processing_config: processingConfig,
    });
    
    // Simular creación
    alert('RAG creation started! Check the Manage tab for progress.');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: RagDocument['type']) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'md': return '📝';
      case 'txt': return '📄';
      case 'docx': return '📘';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  const canCreate = ragName.trim() && documents.length > 0 && documents.every(d => d.status === 'uploaded');

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Basic Information</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">RAG Name *</label>
            <input
              type="text"
              value={ragName}
              onChange={(e) => setRagName(e.target.value)}
              placeholder="e.g., Outlier Documentation RAG"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Description</label>
            <textarea
              value={ragDescription}
              onChange={(e) => setRagDescription(e.target.value)}
              placeholder="Describe what this RAG contains..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Documents</h4>
        
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Drop files here or <span className="text-purple-600 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF, MD, TXT, DOCX, and images
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.md,.txt,.docx,.doc,.jpg,.jpeg,.png,.gif"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />

        {/* Document List */}
        {documents.length > 0 && (
          <div className="mt-4 space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">{getFileIcon(doc.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{doc.filename}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.size)} • {doc.status === 'uploading' ? 'Uploading...' : 'Ready'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === 'uploading' && (
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {doc.status === 'uploaded' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDocument(doc.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Processing Configuration */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Processing Configuration
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chunking Settings */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-gray-700">Chunking</h5>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Chunk Size</label>
              <input
                type="number"
                min="128"
                max="2048"
                step="128"
                value={processingConfig.chunk_size}
                onChange={(e) => setProcessingConfig(prev => ({
                  ...prev,
                  chunk_size: parseInt(e.target.value)
                }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Overlap (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={processingConfig.chunk_overlap}
                onChange={(e) => setProcessingConfig(prev => ({
                  ...prev,
                  chunk_overlap: parseInt(e.target.value)
                }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Model Settings */}
          <div className="space-y-3">
            <h5 className="text-xs font-medium text-gray-700">Models</h5>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Embedding Model</label>
              <select
                value={processingConfig.embedding_model}
                onChange={(e) => setProcessingConfig(prev => ({
                  ...prev,
                  embedding_model: e.target.value
                }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
              >
                {EMBEDDING_MODELS.map(model => (
                  <option key={model.value} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Vector Store</label>
              <select
                value={processingConfig.vector_store}
                onChange={(e) => setProcessingConfig(prev => ({
                  ...prev,
                  vector_store: e.target.value
                }))}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
              >
                {VECTOR_STORES.map(store => (
                  <option key={store.value} value={store.value}>
                    {store.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quality Filters */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Quality Filters</h5>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={processingConfig.quality_filters.remove_duplicates}
                onChange={(e) => setProcessingConfig(prev => ({
                  ...prev,
                  quality_filters: { ...prev.quality_filters, remove_duplicates: e.target.checked }
                }))}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Remove duplicate chunks
            </label>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Min chunk length:</span>
              <input
                type="number"
                min="50"
                max="500"
                value={processingConfig.quality_filters.min_chunk_length}
                onChange={(e) => setProcessingConfig(prev => ({
                  ...prev,
                  quality_filters: { ...prev.quality_filters, min_chunk_length: parseInt(e.target.value) }
                }))}
                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
              />
              <span className="text-xs text-gray-500">chars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>{documents.length} document{documents.length !== 1 ? 's' : ''} selected</span>
        </div>
        
        <button
          onClick={handleCreateRAG}
          disabled={!canCreate || isUploading}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            canCreate && !isUploading
              ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4" />
          Create RAG
        </button>
      </div>
    </div>
  );
}