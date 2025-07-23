// hooks/useSystemMetrics.ts - Hook para métricas del sistema

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
* Hook para obtener y actualizar métricas del sistema
* @param refetchInterval - Intervalo de actualización en ms
* @returns Objeto con métricas y funciones de control
*/
export function useSystemMetrics(refetchInterval: number = 30000) { // ✅ 30s en lugar de 5s
 const query = useQuery({
   queryKey: ['systemMetrics-singleton'], // ✅ Singleton para evitar duplicados
   queryFn: () => api.getSystemMetrics(),
   refetchInterval,
   refetchIntervalInBackground: false,
   staleTime: 15000, // ✅ No refetch por 15s si se re-monta el componente
 });

 return {
   metrics: query.data,
   isLoading: query.isLoading,
   error: query.error,
   refetch: query.refetch,
 };
}