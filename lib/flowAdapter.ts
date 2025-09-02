// lib/flowAdapter.ts - NUEVO

import { ExecutionResult, NodeState } from './types';
import { FlowDefinition } from './flowDefinitions';

export class FlowAdapter {
  /**
   * Adapta la respuesta del backend a tu estructura existente
   * No rompe nada, solo enriquece
   */
  static enrichExecutionResult(
    result: ExecutionResult,
    flowDef: FlowDefinition
  ): ExecutionResult & { flowDefinition?: FlowDefinition; nodeOutputs?: Record<string, string> } {
    
    // Extraer outputs según la definición
    const nodeOutputs: Record<string, string> = {};
    
    // Si hay challenge_flow en la respuesta
    if ((result as unknown as Record<string, unknown>).challenge_flow) {
      Object.entries((result as unknown as Record<string, unknown>).challenge_flow as Record<string, unknown>).forEach(([nodeId, data]: [string, unknown]) => {
        nodeOutputs[nodeId] = (data as Record<string, unknown>).output as string || '';
      });
    }
    
    // Extraer de los nodos normales
    result.flow.nodes.forEach(node => {
      if (node.data?.output) {
        nodeOutputs[node.id] = node.data.output;
      }
    });
    
    return {
      ...result,
      flowDefinition: flowDef,
      nodeOutputs
    };
  }
  
  /**
   * Ajusta el layout de los nodos según la definición
   */
  static adjustNodeLayout(
    nodes: NodeState[],
    layout: FlowDefinition['layout']
  ): NodeState[] {
    // Tu FlowVisualizer ya maneja esto, pero puedes
    // agregar hints para layouts específicos
    return nodes.map((node, index) => ({
      ...node,
      data: {
        ...node.data,
        layoutHint: layout,
        position: index
      }
    }));
  }
}