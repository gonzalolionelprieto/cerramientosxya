
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type PedidoProveedor = Tables<'pedidos_proveedor'>;
type Proveedor = Tables<'proveedores'>;
type Pedido = Tables<'pedidos'>;

export type PedidoProveedorWithDetails = PedidoProveedor & {
  proveedores: Proveedor | null;
  pedidos: Pedido | null;
};

export const usePedidosProveedor = () => {
  return useQuery({
    queryKey: ['pedidos-proveedor'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pedidos_proveedor')
        .select(`
          *,
          proveedores (*),
          pedidos (*)
        `)
        .order('fecha_pedido', { ascending: false });
      
      if (error) throw error;
      return data as PedidoProveedorWithDetails[];
    },
  });
};

export const useCreatePedidoProveedor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pedido: Omit<PedidoProveedor, 'id' | 'created_at' | 'updated_at' | 'fecha_pedido'>) => {
      const { data, error } = await supabase
        .from('pedidos_proveedor')
        .insert(pedido)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos-proveedor'] });
    },
  });
};

export const useUpdatePedidoProveedor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PedidoProveedor> & { id: string }) => {
      const { data, error } = await supabase
        .from('pedidos_proveedor')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos-proveedor'] });
    },
  });
};
