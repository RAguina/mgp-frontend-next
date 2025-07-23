// components/console/ModelSelector.tsx

'use client';

import { useConfigStore } from '@/store/configStore';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { ModelConfig } from '@/lib/types';

/**
 * Selector de modelo LLM y estrategia
 */
export default function ModelSelector() {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const {
    defaultModel,
    defaultStrategy,
    setDefaultModel,
    setDefaultStrategy,
  } = useConfigStore();

  // Cargar modelos disponibles
  useEffect(() => {
    api.getModels().then(setModels).catch(console.error);
  }, []);

  const strategies = ['standard', 'optimized', 'streaming'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4 text-sm text-gray-700">
      <div>
        <label htmlFor="model" className="block font-medium mb-1">
          Modelo
        </label>
        <select
          id="model"
          className="w-full p-2 border rounded-md"
          value={defaultModel}
          onChange={(e) => setDefaultModel(e.target.value)}
        >
          {models.map((model) => (
            <option key={model.key} value={model.key}>
              {model.name}
              {model.type === 'local' ? ' (Local)' : ' (API)'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="strategy" className="block font-medium mb-1">
          Estrategia
        </label>
        <select
          id="strategy"
          className="w-full p-2 border rounded-md"
          value={defaultStrategy}
          onChange={(e) => setDefaultStrategy(e.target.value)}
        >
          {strategies.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
