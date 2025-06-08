
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Instalacion = Tables<'instalaciones'>;
type Pedido = Tables<'pedidos'>;
type Cliente = Tables<'clientes'>;
type Instalador = Tables<'instaladores'>;

export type InstalacionWithDetails = Instalacion & {
  pedidos: (Pedido & { clientes: Cliente | null }) | null;
  instaladores: Instalador | null;
};

export const useInstalaciones = (fecha?: string) => {
  return useQuery({
    queryKey: ['instalaciones', fecha],
    queryFn: async () => {
      let query = supabase
        .from('instalaciones')
        .select(`
          *,
          pedidos (
            *,
            clientes (*)
          ),
          instaladores (*)
        `)
        .order('fecha', { ascending: true })
        .order('hora_inicio', { ascending: true });

      if (fecha) {
        query = query.eq('fecha', fecha);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as InstalacionWithDetails[];
    },
  });
};

export const useUpdateInstalacion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Instalacion> & { id: string }) => {
      const { data, error } = await supabase
        .from('instalaciones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instalaciones'] });
    },
  });
};
