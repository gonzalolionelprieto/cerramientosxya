
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Herramienta = Tables<'herramientas'>;

export const useHerramientas = () => {
  return useQuery({
    queryKey: ['herramientas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('herramientas')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      return data as Herramienta[];
    },
  });
};
