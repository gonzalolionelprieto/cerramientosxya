
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Pedido = Tables<'pedidos'>;
type Cliente = Tables<'clientes'>;

export type PedidoWithCliente = Pedido & {
  clientes: Cliente | null;
};

export const usePedidos = () => {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes (*)
        `)
        .order('fecha_pedido', { ascending: false });
      
      if (error) throw error;
      return data as PedidoWithCliente[];
    },
  });
};

export const useCreatePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pedido: Omit<Pedido, 'id' | 'created_at' | 'updated_at' | 'fecha_pedido'>) => {
      const { data, error } = await supabase
        .from('pedidos')
        .insert(pedido)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};

export const useUpdatePedido = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pedido> & { id: string }) => {
      const { data, error } = await supabase
        .from('pedidos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
};
