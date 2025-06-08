import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Define the expected shape of the data for recent pedidos
// This includes the nested client name.
export interface PedidoReciente extends Pick<Tables<'pedidos'>, 'id' | 'numero_orden' | 'estado' | 'fecha_pedido'> {
  clientes: { nombre: string } | null; // Client might be null if the relation allows it
}
// Or, more strictly if 'clientes' is guaranteed via !inner:
// export interface PedidoRecienteStrict extends Pick<Tables<'pedidos'>, 'id' | 'numero_orden' | 'estado' | 'fecha_pedido'> {
//   clientes: { nombre: string };
// }


/**
 * Fetches the 3 most recent orders with specific fields for the dashboard.
 */
export const usePedidosRecientes = () => {
  return useQuery<PedidoReciente[], Error>({
    queryKey: ['pedidos', 'recientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          numero_orden,
          estado,
          fecha_pedido,
          clientes (nombre)
        `)
        // Ensure fecha_pedido is treated as the creation date for ordering if that's the intent.
        // The type PedidoReciente maps fecha_pedido directly.
        .order('fecha_pedido', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching pedidos recientes:', error);
        throw new Error(error.message);
      }
      // Supabase with typed client should return data matching the select string,
      // but casting might be needed if the auto-generated types aren't precise enough for nested selections.
      // For now, we assume the structure matches PedidoReciente[].
      return data as PedidoReciente[] || [];
    },
  });
};
