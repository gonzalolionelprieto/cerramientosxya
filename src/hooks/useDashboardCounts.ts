import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateYYYYMMDD = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Fetches the count of 'pendiente' orders.
 */
export const usePedidosPendientesCount = () => {
  return useQuery<number, Error>({
    queryKey: ['dashboardCounts', 'pedidosPendientes'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'pendiente');

      if (error) {
        console.error('Error fetching pedidos pendientes count:', error);
        throw new Error(error.message);
      }
      return count ?? 0;
    },
  });
};

/**
 * Fetches the count of installations scheduled for today.
 */
export const useInstalacionesHoyCount = () => {
  const today = getTodayDateYYYYMMDD();
  return useQuery<number, Error>({
    queryKey: ['dashboardCounts', 'instalacionesHoy', today],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('instalaciones')
        .select('*', { count: 'exact', head: true })
        .eq('fecha', today);

      if (error) {
        console.error('Error fetching instalaciones hoy count:', error);
        throw new Error(error.message);
      }
      return count ?? 0;
    },
  });
};

/**
 * Fetches the count of 'instalado' (completed) installations.
 */
export const useTrabajosCompletadosCount = () => {
  return useQuery<number, Error>({
    queryKey: ['dashboardCounts', 'trabajosCompletados'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('instalaciones')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'instalado'); // Assuming 'instalado' is the status for completed

      if (error) {
        console.error('Error fetching trabajos completados count:', error);
        throw new Error(error.message);
      }
      return count ?? 0;
    },
  });
};

/**
 * Fetches the count of active 'instaladores'.
 */
export const useInstaladoresActivosCount = () => {
  return useQuery<number, Error>({
    queryKey: ['dashboardCounts', 'instaladoresActivos'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('instaladores')
        .select('*', { count: 'exact', head: true })
        .eq('activo', true);

      if (error) {
        console.error('Error fetching instaladores activos count:', error);
        throw new Error(error.message);
      }
      return count ?? 0;
    },
  });
};
