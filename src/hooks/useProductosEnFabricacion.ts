import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation and useQueryClient
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types'; // Import TablesUpdate

// Define the type for a single product in fabrication
type ProductoEnFabricacion = Tables<'productos_en_fabricacion'>;

interface UseProductosEnFabricacionProps {
  searchTerm?: string;
  filterStatus?: string;
}

/**
 * Hook to fetch products currently in fabrication from Supabase.
 * @param searchTerm Optional string to filter products by name.
 * @param filterStatus Optional string to filter products by status.
 */
export const useProductosEnFabricacion = ({
  searchTerm,
  filterStatus
}: UseProductosEnFabricacionProps = {}) => {
  return useQuery<ProductoEnFabricacion[], Error>({
    // Add searchTerm and filterStatus to the queryKey to trigger refetch when they change
    queryKey: ['productos_en_fabricacion', searchTerm, filterStatus],
    queryFn: async () => {
      let query = supabase
        .from('productos_en_fabricacion')
        .select('*')
        .order('nombre_producto');

      if (searchTerm) {
        query = query.ilike('nombre_producto', `%${searchTerm}%`);
      }

      if (filterStatus && filterStatus !== 'Todos') { // 'Todos' means no filter by status
        query = query.eq('estado', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching productos_en_fabricacion:", error);
        throw new Error(error.message);
      }

      return data || []; // Return empty array if data is null
    },
  });
};

/**
 * Hook to update a product's status to 'finalizado' and set the completion date.
 */
export const useMarkAsFinalizado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const updates: TablesUpdate<'productos_en_fabricacion'> = {
        estado: 'finalizado',
        fecha_real_finalizacion: new Date().toISOString(),
        updated_at: new Date().toISOString(), // Also update the updated_at timestamp
      };

      const { data, error } = await supabase
        .from('productos_en_fabricacion')
        .update(updates)
        .eq('id', productId)
        .select()
        .single(); // Assuming you want the updated record back

      if (error) {
        console.error('Error marking as finalizado:', error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the list of products to reflect the change.
      // We can be more specific with the query key if searchTerm and filterStatus are stable
      // or if we pass them through the mutation's context.
      // For simplicity, invalidating all queries starting with 'productos_en_fabricacion'.
      queryClient.invalidateQueries({ queryKey: ['productos_en_fabricacion'] });

      // Optionally, you could update the cache directly if you have the full product list
      // available in the mutation's context or via a find from the cache,
      // but invalidation is simpler and often sufficient.
      console.log(`Product ${variables} marked as finalizado. Data:`, data);
    },
    onError: (error, variables) => {
      console.error(`Error marking product ${variables} as finalizado:`, error);
    },
  });
};
