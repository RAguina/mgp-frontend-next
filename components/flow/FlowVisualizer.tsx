// components/flow/FlowVisualizer.tsx - Visualizador interactivo del flujo de LangGraph

'use client';

import React, { useCallback, useEffect, useState } from 'react';
/* import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant,
} from 'reactflow'; */
 import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { NodeState, EdgeState, FlowState } from '@/lib/types';
import { getNodeColor } from '@/lib/utils';
import { Clock, Cpu, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Props para el componente CustomNode
 */
interface CustomNodeData {
  nodeState: NodeState;
  onNodeClick: (nodeId: string) => void;
  model?: string;
  executionTime?: number;
  decision?: string;
}


/**
 * Componente personalizado para renderizar cada nodo del flujo
 * @param props - Props del nodo incluyendo data con información del estado
 */
const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  const { nodeState, onNodeClick } = data;
  const color = getNodeColor(nodeState.status);
  
  const statusIcons = {
    pending: <AlertCircle className="w-4 h-4" />,
    running: <Zap className="w-4 h-4 animate-pulse" />,
    completed: <CheckCircle className="w-4 h-4" />,
    failed: <XCircle className="w-4 h-4" />,
    skipped: <AlertCircle className="w-4 h-4" />,
    error: <XCircle className="w-4 h-4" />,
  };

  return (
    <div
      className="px-4 py-3 rounded-lg border-2 bg-white shadow-lg cursor-pointer transition-all hover:shadow-xl"
      style={{ borderColor: color }}
      onClick={() => onNodeClick(nodeState.id)}
    >
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color }}>{statusIcons[nodeState.status]}</div>
        <div className="font-semibold text-sm">{nodeState.label}</div>
      </div>
      
      {nodeState.data && (
        <div className="text-xs text-gray-600 space-y-1">
          {nodeState.data.model && (
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>{nodeState.data.model}</span>
            </div>
          )}
          {nodeState.data.executionTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{nodeState.data.executionTime}ms</span>
            </div>
          )}
          {nodeState.data.decision && (
            <div className="italic">{nodeState.data.decision}</div>
          )}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

/**
 * Props para el componente FlowVisualizer
 */
interface FlowVisualizerProps {
  /** Estado del flujo a visualizar */
  flowState: FlowState;
  /** Callback cuando se hace click en un nodo */
  onNodeClick?: (nodeId: string) => void;
  /** Si el flujo está actualmente ejecutándose */
  isExecuting?: boolean;
}

/**
 * Componente principal para visualizar el flujo de ejecución de LangGraph
 * @param props - Props del componente
 */
export const FlowVisualizer: React.FC<FlowVisualizerProps> = ({
  flowState,
  onNodeClick = () => {},
  isExecuting = false,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  /**
   * Convierte el estado del flujo a nodos de ReactFlow
   */
  const convertToReactFlowNodes = useCallback((nodeStates: NodeState[]): Node[] => {
    const nodeWidth = 200;
    const nodeHeight = 100;
    const horizontalSpacing = 250;
    const verticalSpacing = 150;

    // Organizar nodos en niveles
    const levels: { [key: string]: number } = {
      'task_analyzer': 0,
      'resource_monitor': 1,
      'execution': 2,
      'validator': 3,
      'history_reader': 4,
      'summary': 5,
    };

    return nodeStates.map((nodeState, index) => {
      const level = levels[nodeState.type] ?? index;
      const nodesInLevel = nodeStates.filter(n => levels[n.type] === level).length;
      const indexInLevel = nodeStates.filter(n => levels[n.type] === level).indexOf(nodeState);
      
      return {
        id: nodeState.id,
        type: 'custom',
        position: {
          x: (indexInLevel - (nodesInLevel - 1) / 2) * horizontalSpacing + 400,
          y: level * verticalSpacing + 50,
        },
        data: {
          nodeState,
          onNodeClick: handleNodeClick,
          ...nodeState.data,
        },
      };
    });
  }, []);

  /**
   * Convierte el estado del flujo a edges de ReactFlow
   */
  const convertToReactFlowEdges = useCallback((edgeStates: EdgeState[]): Edge[] => {
    return edgeStates.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.animated || (isExecuting && edge.target === flowState.currentNode),
      style: edge.style || {
        stroke: '#6b7280',
        strokeWidth: 2,
      },
    }));
  }, [isExecuting, flowState.currentNode]);

  /**
   * Maneja el click en un nodo
   */
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick(nodeId);
  }, [onNodeClick]);

  // Actualizar nodos y edges cuando cambia el estado del flujo
  useEffect(() => {
    setNodes(convertToReactFlowNodes(flowState.nodes));
    setEdges(convertToReactFlowEdges(flowState.edges));
  }, [flowState, convertToReactFlowNodes, convertToReactFlowEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
      
      {/* Indicador de ejecución */}
      {isExecuting && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Zap className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">Ejecutando...</span>
        </div>
      )}
    </div>
  );
};