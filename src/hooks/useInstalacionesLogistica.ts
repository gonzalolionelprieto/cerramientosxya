import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateYYYYMMDD = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Define the expected shape of the data for an installation in the Logistica view
export interface InstalacionLogisticaDetalles extends Omit<Tables<'instalaciones'>, 'pedido_id' | 'instalador_id' | 'vehiculo_id'> { // vehiculo_id also omitted here if it was part of Tables<'instalaciones'>
  // Explicitly include vehiculo_id as per assumption
  // vehiculo_id: string | null; // Temporarily commented out for diagnostics

  pedidos: {
    id: string; // Assuming pedido_id is needed for context or linking
    clientes: {
      nombre: string;
      direccion: string | null;
      telefono: string | null;
    } | null; // Clientes might be null if the relation from pedidos allows it
  } | null; // Pedido might be null if the relation from instalaciones allows it

  instaladores: {
    nombre: string;
  } | null; // Instalador might be null

  // vehiculos: { // This part assumes vehiculo_id and relation will be added to 'instalaciones'
  //   matricula: string;
  //   modelo: string | null;
  // } | null; // Temporarily commented out for diagnostics
}

/**
 * Hook to fetch installations for the Logistica view.
 * Filters for 'programada' status and dates from today onwards.
 * Assumes 'vehiculo_id' field and 'vehiculos' relation exist on the 'instalaciones' table.
 */
export const useInstalacionesLogistica = () => {
  const today = getTodayDateYYYYMMDD(); // Keep for queryKey if needed, or remove if queryKey also simplifies

  // Temporarily changing return type for diagnostics
  return useQuery<Tables<'instalaciones'>[], Error>({
    // Query key might need adjustment if 'today' filter is also removed, or kept if we want to see if this key itself has issues.
    // For now, keeping 'today' in queryKey as the select is the primary change.
    queryKey: ['instalacionesLogistica', 'diagnostic_select_all', today],
    queryFn: async () => {
      console.log('Fetching ALL instalaciones (diagnostic)...', { today }); // Updated logging

      // Simplified query for diagnostics
      const { data, error } = await supabase
        .from('instalaciones')
        .select('*'); // Select all columns, no joins, no filters

      console.log('Supabase response for ALL instalaciones (diagnostic):', { data, error }); // Updated logging

      if (error) {
        console.error('Error fetching ALL instalaciones (diagnostic):', error);
        throw new Error(`Supabase error (diagnostic_select_all): ${error.message} (Code: ${error.code})`);
      }

      // Return raw data, or empty array if null
      return (data as Tables<'instalaciones'>[]) || [];
    },
  });
};
