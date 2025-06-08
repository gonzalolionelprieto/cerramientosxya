import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
// We are not importing Tables<'vehiculos'> directly into the type yet
// because we are assuming 'disponible' which is not in the current types.ts.
// The report will highlight this.

// Define the expected shape of the data for an available vehicle.
// This type definition ASSUMES the 'vehiculos' table will have a 'disponible: boolean' field.
// It also includes other relevant fields for display.
export interface VehiculoDisponible {
  id: string;
  matricula: string;
  modelo: string | null;
  // Add other fields like 'tipo' if they are useful for display or selection logic.
  // tipo: string;
  disponible: boolean; // Assumed field based on user feedback
}

/**
 * Hook to fetch available vehicles.
 * Filters for vehicles where 'disponible' is true.
 *
 * IMPORTANT ASSUMPTION: This hook assumes the `vehiculos` table has a boolean column
 * named `disponible`. The current `types.ts` (as of previous reviews) shows an
 * `estado: string` field instead. The database schema and `types.ts` for `vehiculos`
 * will need to be updated by the user to include `disponible: boolean` for this hook
 * to function as intended with type safety.
 */
export const useVehiculosDisponibles = () => {
  return useQuery<VehiculoDisponible[], Error>({
    queryKey: ['vehiculosDisponibles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehiculos')
        .select(`
          id,
          matricula,
          modelo,
          disponible
        `)
        .eq('disponible', true) // Querying the assumed 'disponible' field
        .order('modelo', { ascending: true })
        .order('matricula', { ascending: true });

      if (error) {
        console.error('Error fetching vehiculos disponibles:', error);
        // If the error is due to the 'disponible' column not existing,
        // this log will help the user diagnose.
        if (error.message.includes('column "disponible" does not exist')) {
            console.warn("Hint: The 'disponible' column might be missing from the 'vehiculos' table or not included in RLS policies for select.");
        }
        throw new Error(error.message);
      }

      // Casting to VehiculoDisponible[].
      // If 'disponible' field is missing, this cast will be unsafe at runtime for that field.
      return data as VehiculoDisponible[] || [];
    },
  });
};
