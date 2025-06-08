
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Proveedor = Tables<'proveedores'>;

export const useProveedores = () => {
  return useQuery({
    queryKey: ['proveedores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proveedores')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateProveedor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (proveedor: Omit<Proveedor, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('proveedores')
        .insert(proveedor)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};

export const useUpdateProveedor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Proveedor> & { id: string }) => {
      const { data, error } = await supabase
        .from('proveedores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
    },
  });
};
