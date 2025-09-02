// lib/types.ts - Definiciones de tipos actualizadas para backend real

/**
 * Estado de un nodo en el grafo de LangGraph
 */
export interface NodeState {
  id: string;
  type: 
    | 'task_analyzer' 
    | 'resource_monitor' 
    | 'execution' 
    | 'validator' 
    | 'history_reader' 
    | 'summary'
    | 'model_execution'  // Nuevo: para modelos individuales
    | 'llm_inference'    // Nuevo: para inferencia directa
    | 'error'            // Nuevo: para nodos de error
    | string;            // Flexible para tipos del backend
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  data?: {
    model?: string;
    strategy?: string;
    taskType?: string;
    vramStatus?: string;
    executionTime?: number;
    tokensUsed?: number;
    output?: string;
    error?: string;
    decision?: string;
    startTime?: number;     // Nuevo: tiempo de inicio
    endTime?: number;       // Nuevo: tiempo de fin
  };
}

/**
 * Conexión entre nodos del grafo
 */
export interface EdgeState {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: {
    stroke?: string;
    strokeDasharray?: string;
  };
}

/**
 * Estado completo del flujo de ejecución
 */
export interface FlowState {
  nodes: NodeState[];
  edges: EdgeState[];
  currentNode?: string;
  startTime?: number;
  endTime?: number;
  totalTokens?: number;
  finalOutput?: string;
}

/**
 * Configuración de un modelo LLM
 */
export interface ModelConfig {
  key: string;
  name: string;
  type: 'local' | 'api';
  available: boolean;
  loaded?: boolean;        // Nuevo: si está cargado en cache
  vramRequired?: number;
  defaultStrategy?: 'standard' | 'optimized' | 'streaming';
}

/**
 * Parámetros de generación
 */
export interface GenerationParams {
  prompt: string;
  model?: string;
  modelKey?: string;       // Nuevo: clave del modelo (alias para compatibilidad)
  strategy?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

/**
 * Métricas del sistema
 */
export interface SystemMetrics {
  gpuAvailable: boolean;
  vramTotal: number;
  vramUsed: number;
  vramFree: number;
  cpuUsage?: number;
  modelsInCache: string[];
  uptime?: string;         // Nuevo: tiempo de actividad
  memoryStatus?: string;   // Nuevo: estado de memoria (excellent/warning/critical)
  modelsCached?: number;   // Nuevo: número de modelos en cache
}

/**
 * Métricas de ejecución extendidas
 */
export interface ExecutionMetrics {
  totalTime: number;
  tokensGenerated: number;
  modelsUsed: string[];
  cacheHit?: boolean;      // Nuevo: si fue cache hit
  loadTime?: number;       // Nuevo: tiempo de carga del modelo
  inferenceTime?: number;  // Nuevo: tiempo de inferencia
  gpuInfo?: Record<string, unknown>;          // Nuevo: información de GPU
}

/**
 * Resultado de una ejecución
 */
export interface ExecutionResult {
  id: string;
  timestamp: number;
  params: GenerationParams;
  flow: FlowState;
  output: string;
  metrics: ExecutionMetrics;
}

/**
 * Payload para enviar una ejecución al backend
 */
export interface ExecutionPayload {
  prompt: string;
  model: 'gpt-4' | 'claude-3' | 'local-llama' | 'mistral7b' | 'llama3' | 'deepseek7b' | 'deepseek-coder';
  strategy?: 'standard' | 'optimized' | 'streaming';
  user_id?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Evento WebSocket enviado por el backend
 */
export interface WebSocketEvent {
  type: 'start' | 'token' | 'retry' | 'error' | 'done';
  data: Record<string, unknown>;
  session_id: string;
  timestamp: number;
}

/**
 * Estado de una sesión de streaming
 */
export interface StreamState {
  isConnected: boolean;
  isProcessing: boolean;
  currentTokens: string[];
  logs: { message: string; timestamp: number }[];
  error?: string;
}

/**
 * Información del cache de modelos (nuevo)
 */
export interface CacheInfo {
  cached_models: Record<string, {
    model_key: string;
    strategy: string;
    loaded_at: string;
    last_used: string;
    memory_usage_gb: number;
  }>;
  memory_stats: {
    cache_size: number;
    loaded_models: [string, string][];
    gpu_info: Record<string, unknown>;
    memory_pressure: boolean;
    max_vram_limit_gb: number;
  };
  cache_size: number;
}

/**
 * Respuesta del health check (nuevo)
 */
export interface HealthResponse {
  status: string;
  gpu_info: {
    cuda: boolean;
    device: string;
    device_id: number;
    total_gb: number;
    allocated_gb: number;
    free_gb: number;
    memory_status: string;
  };
  models_loaded: number;
  models_cached?: number;
  uptime: string;
}

/**
 * Request para ejecutar modelo (nuevo)
 */
export interface ExecutionRequest {
  prompt: string;
  model?: string;
  strategy?: 'standard' | 'optimized' | 'streaming';
  temperature?: number;
  max_tokens?: number;
}

/**
 * Response del backend para ejecución (nuevo)
 */
export interface ExecutionResponse {
  id: string;
  timestamp: string;
  prompt: string;
  output: string;
  flow: {
    nodes: Array<{
      id: string;
      name: string;
      type: string;
      status: 'pending' | 'running' | 'completed' | 'error';
      start_time?: number;
      end_time?: number;
      output?: string;
      error?: string;
    }>;
    edges: Array<{
      source: string;
      target: string;
      label?: string;
    }>;
    current_node?: string;
  };
  metrics: {
    total_time: number;
    tokens_generated?: number;
    models_used?: string[];
    cache_hit?: boolean;
    load_time_sec?: number;
    inference_time_sec?: number;
    gpu_info?: Record<string, unknown>;
  };
  success: boolean;
}

/**
 * Tipos para hooks de React Query (nuevo)
 */
export interface UseExecutionOptions {
  onSuccess?: (data: ExecutionResult) => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

export interface UseModelsOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

export interface UseSystemMetricsOptions {
  refetchInterval?: number;
  enabled?: boolean;
}

/**
 * Estados de UI (nuevo)
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface UIState {
  isExecuting: boolean;
  loadingState: LoadingState;
  error?: string;
  selectedModel?: string;
  selectedStrategy?: string;
}

/**
 * Configuración de la aplicación (nuevo)
 */
export interface AppConfig {
  apiUrl: string;
  mockMode: boolean;
  defaultModel: string;
  defaultStrategy: string;
  defaultMaxTokens: number;
  defaultTemperature: number;
}

/**
 * Configuración para orchestrator (nuevo)
 */
export interface OrchestratorConfig {
  agents: string[];
  tools: string[];
  verbose: boolean;
  enable_history: boolean;
  retry_on_error: boolean;
}

/**
 * Request actualizado para execution_type (nuevo)
 */
export interface ExecutionRequest {
  prompt: string;
  model?: string;
  
  // Campos para simple LLM (existentes)
  execution_type: 'simple' | 'orchestrator' | 'challenge';
  strategy?: 'standard' | 'optimized' | 'streaming';
  temperature?: number;
  max_tokens?: number;
  
  // Campos para orchestrator (nuevos)
  agents?: string[];
  tools?: string[];
  verbose?: boolean;
  enable_history?: boolean;
  retry_on_error?: boolean;

  // ✅ NUEVO: Campo para especificar el tipo de flujo
  flow_type?: string; // 'linear' | 'challenge' | 'research' | etc.

  // 🆕 NUEVOS CAMPOS RAG (todos opcionales)
  embedding_model?: string;      // "bge-m3", "e5-large", "openai-embed"
  vector_store?: string;         // "milvus", "weaviate", "pinecone"
  rag_config?: {                 // Configuración específica
    top_k?: number;              // Número de documentos a recuperar
    threshold?: number;          // Umbral de similitud
    chunk_size?: number;         // Tamaño de chunks
    [key: string]: unknown;          // Extensible
  };
}

// 🆕 NUEVOS TIPOS PARA RAG WORKSPACE (se agregan sin modificar nada existente)

export interface RagDocument {
  id: string;
  filename: string;
  type: 'pdf' | 'md' | 'txt' | 'image' | 'docx';
  size: number;
  uploaded_at: string;
  status: 'uploading' | 'uploaded' | 'processing' | 'processed' | 'error';
}

export interface RagProcessingConfig {
  chunk_size: number;
  chunk_overlap: number;
  embedding_model: string;
  vector_store: string;
  quality_filters: {
    min_chunk_length: number;
    remove_duplicates: boolean;
    language_filter?: string;
    quality_threshold?: number;
  };
}

export interface RagMetrics {
  total_chunks: number;
  duplicates_removed: number;
  avg_quality_score: number;
  processing_time_ms: number;
  storage_size_mb: number;
  index_size: number;
}

export interface RagArtifact {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: 'creating' | 'processing' | 'ready' | 'error';
  
  documents: RagDocument[];
  processing_config: RagProcessingConfig;
  metrics?: RagMetrics;
  error_message?: string;
}

export interface RagProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress?: number;
  message?: string;
  started_at?: string;
  completed_at?: string;
}

export interface RagProcessingPipeline {
  rag_id: string;
  steps: RagProcessingStep[];
  overall_status: 'pending' | 'running' | 'completed' | 'error';
  started_at?: string;
  completed_at?: string;
}

export interface RagUsageConfig {
  rag_id: string;
  retrieval_config: {
    top_k: number;
    threshold: number;
    rerank?: boolean;
    hybrid_search?: boolean;
  };
}