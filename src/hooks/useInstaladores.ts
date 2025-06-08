
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Instalador = Tables<'instaladores'>;

export const useInstaladores = () => {
  return useQuery({
    queryKey: ['instaladores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instaladores')
        .select('*')
        .eq('activo', true)
        .order('nombre');
      
      if (error) throw error;
      return data as Instalador[];
    },
  });
};

export const useInstaladorByCredentials = (usuario: string, password: string) => {
  return useQuery({
    queryKey: ['instalador-auth', usuario],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instaladores')
        .select('*')
        .eq('usuario', usuario)
        .eq('activo', true)
        .single();
      
      if (error) throw error;
      // En un entorno real, deberías verificar el password hasheado
      // Por ahora usamos una verificación simple
      return data as Instalador;
    },
    enabled: !!usuario && !!password,
  });
};
