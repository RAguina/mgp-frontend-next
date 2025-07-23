// lib/api.ts - Cliente API actualizado para backend real

import axios from 'axios';
import type { 
  GenerationParams, 
  ExecutionResult, 
  SystemMetrics, 
  ModelConfig, 
  FlowState, 
  ExecutionPayload, 
  WebSocketEvent,
  ExecutionRequest
} from './types';

// Tipos específicos del backend
interface BackendExecutionRequest {
  prompt: string;
  model?: string;
  strategy?: string;
  temperature?: number;
  max_tokens?: number;
}

interface BackendExecutionResponse {
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
    gpu_info?: any;
  };
  success: boolean;
}

interface BackendModelInfo {
  key: string;
  name: string;
  available: boolean;
  loaded?: boolean;
}

interface BackendHealthResponse {
  status: string;
  gpu_info: {
    cuda: boolean;
    device: string;
    total_gb: number;
    allocated_gb: number;
    free_gb: number;
    memory_status: string;
  };
  models_loaded: number;
  models_cached: number;
  uptime: string;
}

/**
 * Cliente API para comunicarse con el backend FastAPI
 */
class ApiClient {
  private baseURL: string;
  private mockMode: boolean;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.mockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
  }

  /**
   * Obtiene la lista de modelos disponibles del backend
   */
  async getModels(): Promise<ModelConfig[]> {
    if (this.mockMode) {
      return this.getMockModels();
    }

    try {
      // Llamar al endpoint del backend que llama al lab
      const response = await axios.get(`${this.baseURL}/api/v1/models`);
      
      // Si el backend no tiene endpoint de modelos, llamar directamente al lab
      const labResponse = await axios.get('http://localhost:8001/models/');
      
      return labResponse.data.map((model: BackendModelInfo): ModelConfig => ({
        key: model.key,
        name: model.name,
        type: 'local',
        available: model.available,
        loaded: model.loaded,
        vramRequired: this.getEstimatedVRAM(model.key),
      }));
    } catch (error) {
      console.error('Error fetching models:', error);
      // Fallback a modelos conocidos
      return [
        { key: 'mistral7b', name: 'Mistral 7B Instruct', type: 'local', available: true, vramRequired: 4 },
        { key: 'llama3', name: 'Llama 3 8B Instruct', type: 'local', available: true, vramRequired: 5 },
        { key: 'deepseek7b', name: 'DeepSeek 7B Instruct', type: 'local', available: true, vramRequired: 4 },
        { key: 'deepseek-coder', name: 'DeepSeek Coder 6.7B', type: 'local', available: true, vramRequired: 4 },
      ];
    }
  }

  /**
   * Obtiene las métricas del sistema desde el backend/lab
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    if (this.mockMode) {
      return this.getMockMetrics();
    }

    try {
      // Intentar backend primero
      let healthData: BackendHealthResponse;
      
      try {
        const backendResponse = await axios.get(`${this.baseURL}/api/v1/health`);
        healthData = backendResponse.data;
      } catch {
        // Fallback al lab directo
        const labResponse = await axios.get('http://localhost:8001/health/');
        healthData = labResponse.data;
      }

      // Obtener cache info del lab
      let cacheData: any = {};
      try {
        const cacheResponse = await axios.get('http://localhost:8001/cache/');
        cacheData = cacheResponse.data;
      } catch {
        console.warn('Could not fetch cache data');
      }

      return {
        gpuAvailable: healthData.gpu_info.cuda,
        vramTotal: healthData.gpu_info.total_gb,
        vramUsed: healthData.gpu_info.allocated_gb,
        vramFree: healthData.gpu_info.free_gb,
        cpuUsage: 0, // No disponible en el backend actual
        modelsInCache: Object.keys(cacheData.cached_models || {}),
        uptime: healthData.uptime,
        memoryStatus: healthData.gpu_info.memory_status,
        modelsCached: healthData.models_cached || 0,
      };
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      throw error;
    }
  }

  /**
   * Ejecuta una generación usando el backend real
   */
  async generate(params: GenerationParams): Promise<ExecutionResult> {
    if (this.mockMode) {
      return this.getMockGeneration(params);
    }

    try {
      const backendRequest: BackendExecutionRequest = {
        prompt: params.prompt,
        model: params.modelKey || 'mistral7b',
        strategy: params.strategy || 'optimized',
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens || 512,
      };

      const response = await axios.post<BackendExecutionResponse>(
        `${this.baseURL}/api/v1/execute`,
        backendRequest,
        {
          timeout: 300000, // 5 minutos timeout para modelos pesados
        }
      );

      return this.mapBackendResponseToExecutionResult(response.data, params);
    } catch (error) {
      console.error('Error executing generation:', error);
      throw error;
    }
  }

  /**
   * Limpia el cache de modelos
   */
  async clearCache(): Promise<void> {
    try {
      await axios.post('http://localhost:8001/cache/clear/');
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * Descarga un modelo específico del cache
   */
  async unloadModel(modelKey: string, strategy: string = 'optimized'): Promise<void> {
    try {
      await axios.delete(`http://localhost:8001/cache/${modelKey}?strategy=${strategy}`);
    } catch (error) {
      console.error('Error unloading model:', error);
      throw error;
    }
  }

  /**
   * Obtiene el estado del cache
   */
  async getCacheStatus(): Promise<any> {
    try {
      const response = await axios.get('http://localhost:8001/cache/');
      return response.data;
    } catch (error) {
      console.error('Error fetching cache status:', error);
      throw error;
    }
  }

  // Métodos privados
  private getEstimatedVRAM(modelKey: string): number {
    const vramMap: Record<string, number> = {
      'mistral7b': 4,
      'llama3': 5,
      'deepseek7b': 4,
      'deepseek-coder': 4,
    };
    return vramMap[modelKey] || 4;
  }

  private mapBackendResponseToExecutionResult(
    response: BackendExecutionResponse,
    params: GenerationParams
  ): ExecutionResult {
    const flow: FlowState = {
      nodes: response.flow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        label: node.name,
        status: node.status,
        data: {
          output: node.output,
          error: node.error,
          startTime: node.start_time,
          endTime: node.end_time,
        },
      })),
      edges: response.flow.edges.map(edge => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      })),
      currentNode: response.flow.current_node,
      finalOutput: response.output,
    };

    return {
      id: response.id,
      timestamp: new Date(response.timestamp).getTime(),
      params,
      flow,
      output: response.output,
      metrics: {
        totalTime: response.metrics.total_time * 1000, // Backend en segundos, frontend en ms
        tokensGenerated: response.metrics.tokens_generated || 0,
        modelsUsed: response.metrics.models_used || [params.modelKey || 'unknown'],
        cacheHit: response.metrics.cache_hit,
        loadTime: (response.metrics.load_time_sec || 0) * 1000,
        inferenceTime: (response.metrics.inference_time_sec || 0) * 1000,
        gpuInfo: response.metrics.gpu_info,
      },
    };
  }

  // Métodos mock (mantener para desarrollo)
  private getMockModels(): ModelConfig[] {
    return [
      { key: 'llama3', name: 'Llama 3 8B', type: 'local', available: true, vramRequired: 16 },
      { key: 'mistral7b', name: 'Mistral 7B', type: 'local', available: true, vramRequired: 14 },
      { key: 'deepseek7b', name: 'DeepSeek 7B', type: 'local', available: true, vramRequired: 14 },
      { key: 'deepseek-coder', name: 'DeepSeek Coder', type: 'local', available: true, vramRequired: 13 },
    ];
  }

  private getMockMetrics(): SystemMetrics {
    return {
      gpuAvailable: true,
      vramTotal: 8,
      vramUsed: 3.85,
      vramFree: 4.15,
      cpuUsage: 45,
      modelsInCache: ['mistral7b'],
      uptime: '2h 15m',
      memoryStatus: 'warning',
      modelsCached: 1,
    };
  }

  private async getMockGeneration(params: GenerationParams): Promise<ExecutionResult> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 2000));

    const flow: FlowState = {
      nodes: [
        { 
          id: '1', 
          type: 'model_execution', 
          label: `Model: ${params.modelKey}`, 
          status: 'completed',
          data: { 
            model: params.modelKey,
            strategy: params.strategy,
            output: 'Model execution completed successfully'
          }
        },
      ],
      edges: [],
      finalOutput: `Mock response for prompt: "${params.prompt}"`,
    };

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      params,
      flow,
      output: flow.finalOutput || '',
      metrics: {
        totalTime: 3500,
        tokensGenerated: 150,
        modelsUsed: [params.modelKey || 'mistral7b'],
        cacheHit: Math.random() > 0.5,
        loadTime: Math.random() > 0.5 ? 0 : 2000,
        inferenceTime: 1500,
      },
    };
  }

  // Métodos legacy para compatibilidad
  async execute(payload: ExecutionPayload): Promise<Response> {
    const response = await fetch(`${this.baseURL}/api/v1/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response;
  }

  async getHistory(userId?: string): Promise<ExecutionResult[]> {
    // TODO: Implementar cuando el backend tenga historial
    return [];
  }

  createWebSocketConnection(): WebSocket {
    return new WebSocket(`${this.baseURL.replace(/^http/, 'ws')}/ws`);
  }

  /**
 * Ejecuta una generación usando execution_type (simple o orchestrator)
 */
async executeWithType(request: ExecutionRequest): Promise<ExecutionResult> {
  if (this.mockMode) {
    // Convertir ExecutionRequest a GenerationParams para mock
    const params: GenerationParams = {
      prompt: request.prompt,
      modelKey: request.model || 'mistral7b',
      strategy: request.strategy,
      temperature: request.temperature,
      maxTokens: request.max_tokens,
    };
    return this.getMockGeneration(params);
  }

  try {
    const response = await axios.post<BackendExecutionResponse>(
      `${this.baseURL}/api/v1/execute`,
      request,
      {
        timeout: 300000, // 5 minutos timeout para orchestrator
      }
    );

    // Convertir a ExecutionResult usando el método existente
    const params: GenerationParams = {
      prompt: request.prompt,
      modelKey: request.model || 'mistral7b',
      strategy: request.strategy,
      temperature: request.temperature,
      maxTokens: request.max_tokens,
    };

    return this.mapBackendResponseToExecutionResult(response.data, params);
  } catch (error) {
    console.error('Error executing with type:', error);
    throw error;
  }
}
}

export const api = new ApiClient();