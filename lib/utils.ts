// lib/utils.ts - Utilidades generales

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { NodeState, EdgeState } from './types';


/**
 * Combina clases de Tailwind de manera inteligente
 * @param inputs - Clases a combinar
 * @returns Clases combinadas
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea el tiempo de ejecución en formato legible
 * @param ms - Milisegundos
 * @returns Tiempo formateado
 */
export function formatExecutionTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Obtiene el color del nodo según su estado
 * @param status - Estado del nodo
 * @returns Color en formato hex
 */
export function getNodeColor(status: NodeState['status']): string {
  const colors = {
    pending: '#6b7280',    // gray
    running: '#3b82f6',    // blue
    completed: '#10b981',  // green
    failed: '#ef4444',     // red
    skipped: '#f59e0b',    // amber
  };
  return colors[status] || colors.pending;
}

/**
 * Determina si un edge debe estar animado
 * @param edge - Edge a evaluar
 * @param currentNode - Nodo actualmente ejecutándose
 * @returns Si debe animarse
 */
export function shouldAnimateEdge(edge: EdgeState, currentNode?: string): boolean {
  return edge.target === currentNode;
}