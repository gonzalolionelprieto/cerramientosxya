import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TablesUpdate } from '@/integrations/supabase/types';

/**
 * Hook to update a vehiculo record.
 *
 * IMPORTANT ASSUMPTION: This hook assumes the `vehiculos` table might have fields
 * like 'disponible: boolean' which may not be in the current global `types.ts`
 * if it hasn't been updated by the user yet. The `updates` parameter is typed
 * broadly using `TablesUpdate<'vehiculos'>`.
 */
export const useUpdateVehiculo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehiculoId, updates }: { vehiculoId: string; updates: TablesUpdate<'vehiculos'> }) => {
      const { data, error } = await supabase
        .from('vehiculos')
        .update(updates)
        .eq('id', vehiculoId)
        .select()
        .single();

      if (error) {
        console.error(`Error updating vehiculo ${vehiculoId}:`, error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate queries related to vehicles to refetch and reflect changes
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] }); // General list of vehicles
      queryClient.invalidateQueries({ queryKey: ['vehiculosDisponibles'] }); // Specifically available vehicles
      // Add any other specific vehicle-related queries if necessary
    },
    onError: (error, variables) => {
      console.error(`Error during mutation for vehiculo ${variables.vehiculoId}:`, error);
    },
  });
};
