// components/output/DynamicOutputDisplay.tsx - NUEVO

import React from 'react';
import { OutputDisplay } from './OutputDisplay';
import { ExecutionResult } from '@/lib/types';
import { FlowDefinition } from '@/lib/flowDefinitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  result: ExecutionResult & { 
    flowDefinition?: FlowDefinition;
    nodeOutputs?: Record<string, string>;
  };
  isLoading?: boolean;
}

export const DynamicOutputDisplay: React.FC<Props> = ({ result, isLoading }) => {
  const { flowDefinition, nodeOutputs } = result;
  
  // Si no hay definición, usar tu OutputDisplay actual
  if (!flowDefinition || !nodeOutputs) {
    return <OutputDisplay output={result.output} isLoading={isLoading} />;
  }
  
  // Renderizar según el tipo de display
  switch (flowDefinition.display.type) {
    case 'tabs':
      return (
        <Tabs defaultValue={flowDefinition.responseMapping.primaryNode || flowDefinition.display.groups?.[0]?.nodeIds[0] || 'default'}>
          <TabsList>
            {flowDefinition.display.groups?.map(group => (
              <TabsTrigger key={group.label} value={group.nodeIds[0]}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {flowDefinition.display.groups?.map(group => 
            group.nodeIds.map(nodeId => (
              <TabsContent key={nodeId} value={nodeId}>
                <OutputDisplay 
                  output={nodeOutputs[nodeId] || ''} 
                  isLoading={isLoading}
                />
              </TabsContent>
            ))
          )}
        </Tabs>
      );
      
    case 'split':
      return (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(nodeOutputs).map(([nodeId, output]) => (
            <div key={nodeId}>
              <h3 className="font-semibold mb-2">{nodeId}</h3>
              <OutputDisplay output={output} isLoading={isLoading} />
            </div>
          ))}
        </div>
      );
      
    default:
      return <OutputDisplay output={result.output} isLoading={isLoading} />;
  }
};