// hooks/useModels.ts - Hook para obtener modelos disponibles

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * Hook para obtener la lista de modelos disponibles
 * @returns Objeto con modelos y estado de carga
 */
export function useModels() {
  const query = useQuery({
    queryKey: ['models'],
    queryFn: () => api.getModels(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return {
    models: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}