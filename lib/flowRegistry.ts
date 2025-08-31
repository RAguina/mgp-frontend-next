// lib/flowRegistry.ts - NUEVO

import { FlowDefinition } from './flowDefinitions';

class FlowRegistry {
  private static instance: FlowRegistry;
  private flows = new Map<string, FlowDefinition>();
  
  static getInstance(): FlowRegistry {
    if (!FlowRegistry.instance) {
      FlowRegistry.instance = new FlowRegistry();
      FlowRegistry.instance.registerDefaultFlows();
    }
    return FlowRegistry.instance;
  }
  
  private registerDefaultFlows() {
    // Challenge Flow
    this.register({
      id: 'challenge',
      name: 'Challenge Flow',
      description: 'Creator → Challenger → Refiner',
      layout: 'horizontal',
      responseMapping: {
        outputPath: 'challenge_flow',
        primaryNode: 'refiner'
      },
      display: {
        type: 'tabs',
        groups: [
          { label: 'Initial', nodeIds: ['creator'] },
          { label: 'Critique', nodeIds: ['challenger'] },
          { label: 'Final', nodeIds: ['refiner'] }
        ]
      },
      requestConfig: {
        execution_type: 'challenge'
      }
    });
    
    // Linear Flow (tu actual)
    this.register({
      id: 'linear',
      name: 'Linear Flow',
      description: 'Traditional orchestrator flow',
      layout: 'vertical',
      responseMapping: {
        outputPath: 'output',
        primaryNode: 'summary'
      },
      display: {
        type: 'single'
      },
      requestConfig: {
        execution_type: 'orchestrator'
      }
    });
  }
  
  register(flow: FlowDefinition) {
    this.flows.set(flow.id, flow);
  }
  
  get(id: string): FlowDefinition | undefined {
    return this.flows.get(id);
  }
  
  list(): FlowDefinition[] {
    return Array.from(this.flows.values());
  }
}

export const flowRegistry = FlowRegistry.getInstance();