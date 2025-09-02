// components/rag/RAGWorkspace.tsx

'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Plus, Database, Settings } from 'lucide-react';

// Importar los paneles (los crearemos después)
import RAGCreationPanel from './RAGCreationPanel';
import RAGManagementPanel from './RAGManagementPanel';
import RAGUsagePanel from './RAGUsagePanel';

export default function RAGWorkspace() {
  const activeTab = 'use';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">RAG Workspace</h3>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </TabsTrigger>
          <TabsTrigger value="manage">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Manage</span>
          </TabsTrigger>
          <TabsTrigger value="use">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Use</span>
          </TabsTrigger>
        </TabsList>

        {/* Create RAG Panel */}
        <TabsContent value="create" className="mt-4">
          <RAGCreationPanel />
        </TabsContent>

        {/* Manage RAGs Panel */}
        <TabsContent value="manage" className="mt-4">
          <RAGManagementPanel />
        </TabsContent>

        {/* Use RAG Panel */}
        <TabsContent value="use" className="mt-4">
          <RAGUsagePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}