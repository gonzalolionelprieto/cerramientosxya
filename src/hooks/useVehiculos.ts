
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Vehiculo = Tables<'vehiculos'>;
type Instalador = Tables<'instaladores'>;

export type VehiculoWithConductor = Vehiculo & {
  instaladores: Instalador | null;
};

export const useVehiculos = () => {
  return useQuery({
    queryKey: ['vehiculos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehiculos')
        .select(`
          *,
          instaladores (*)
        `)
        .order('matricula');
      
      if (error) throw error;
      return data as VehiculoWithConductor[];
    },
  });
};
