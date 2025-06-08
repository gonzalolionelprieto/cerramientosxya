import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Define the type for the search result items
export type ClienteSearchResult = Pick<
  Tables<'clientes'>,
  'id' | 'nombre' | 'email' | 'telefono' | 'direccion' // Including common fields for display or selection context
>;

/**
 * Hook to search for clientes by name.
 * @param searchTerm The string to search for in client names.
 */
export const useSearchClientes = (searchTerm: string) => {
  return useQuery<ClienteSearchResult[], Error>({
    queryKey: ['clientes', 'search', searchTerm],
    queryFn: async () => {
      // Ensure the query only runs if searchTerm is valid and long enough (as per 'enabled' option)
      // This check inside queryFn is an additional safeguard, though 'enabled' is the primary controller.
      if (!searchTerm || searchTerm.length < 2) {
        return []; // Return empty array if search term is too short, matching 'enabled' logic
      }

      console.log(`Searching clientes with term: "${searchTerm}"`); // Diagnostic log

      const { data, error } = await supabase
        .from('clientes')
        .select('id, nombre, email, telefono, direccion')
        .ilike('nombre', `%${searchTerm}%`) // Case-insensitive search
        .order('nombre', { ascending: true })
        .limit(10); // Limit results for performance and usability

      console.log('Supabase response for client search:', { data, error }); // Diagnostic log

      if (error) {
        console.error('Error searching clientes:', error);
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
      }

      return data || [];
    },
    // Only run the query if searchTerm is not empty and has a minimum length (e.g., 2 characters)
    // This prevents excessive queries for very short or empty search terms.
    enabled: !!searchTerm && searchTerm.trim().length >= 2,
    // Optional: Add staleTime if desired, e.g., to cache search results for a short period
    // staleTime: 60 * 1000, // 1 minute
  });
};
