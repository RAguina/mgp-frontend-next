// lib/flowDefinitions.ts - NUEVO archivo

// Types are used indirectly in the interface definitions

/**
 * Definición de un flujo configurable
 * Se mapea a tu FlowState existente
 */
export interface FlowDefinition {
  id: string;
  name: string;
  description: string;
  layout: 'horizontal' | 'vertical' | 'auto';
  
  // Define cómo mapear la respuesta del backend
  responseMapping: {
    // Dónde buscar los outputs en la respuesta
    outputPath?: string; // ej: "challenge_flow", "nodes", etc.
    // Nodo principal para mostrar
    primaryNode?: string;
    // Cómo extraer outputs de cada nodo
    nodeOutputExtractor?: (node: Record<string, unknown>) => string;
  };
  
  // Configuración de visualización
  display: {
    type: 'single' | 'tabs' | 'split' | 'accordion';
    // Mapeo de tipos de nodo a colores (usa tu getNodeColor existente)
    nodeColors?: Record<string, string>;
    // Agrupación de nodos para display
    groups?: Array<{
      label: string;
      nodeIds: string[];
    }>;
  };
  
  // Configuración para el request
  requestConfig?: {
    execution_type?: string; // "challenge", "research", etc.
    additional_params?: Record<string, unknown>;
  };
}