import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Base type from Supabase schema
type PresupuestoBase = Tables<'presupuestos'>;
type ClienteBase = Tables<'clientes'>; // Using 'ClienteBase' to avoid conflict if 'Cliente' is imported/used differently

// Extended type to include selected client details
export interface PresupuestoWithCliente extends PresupuestoBase {
  clientes: Pick<ClienteBase, 'id' | 'nombre' | 'telefono' | 'email'> | null; // Expanded to include more client details
}

// Exporting the main type to be used by components
export type Presupuesto = PresupuestoWithCliente;

/**
 * Hook to fetch all presupuestos from the Supabase 'presupuestos' table,
 * including selected details from the related 'clientes' table.
 * Orders them by creation date (newest first).
 */
export const useGetPresupuestos = () => {
  return useQuery<Presupuesto[], Error>({ // Using the Presupuesto (PresupuestoWithCliente) type here
    queryKey: ['presupuestos'],
    queryFn: async () => {
      console.log('Fetching all presupuestos...'); // Diagnostic log

      const { data, error } = await supabase
        .from('presupuestos')
        .select(`
          *,
          clientes (
            id,
            nombre,
            telefono,
            email
          )
        `)
        .order('created_at', { ascending: false });

      console.log('Supabase response for all presupuestos:', { data, error }); // Diagnostic log

      if (error) {
        console.error('Error fetching presupuestos:', error);
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
      }

      return (data as Presupuesto[]) || []; // Cast to the extended type
    },
    // Optional: Add staleTime or cacheTime if needed
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Uploads a presupuesto image to Supabase Storage.
 * @param file The image file to upload.
 * @returns An object with the publicUrl of the uploaded image or an error.
 */
export const uploadPresupuestoImage = async (
  file: File
): Promise<{ publicUrl: string | null; error: Error | null }> => {
  try {
    // Sanitize filename by replacing spaces with underscores
    const sanitizedFileName = file.name.replace(/\s/g, '_');
    const filePath = `presupuestos/${Date.now()}-${sanitizedFileName}`;

    console.log(`Uploading presupuesto image to: ${filePath}`);

    const { error: uploadError } = await supabase.storage
      .from('public') // Using the 'public' bucket as specified
      .upload(filePath, file, {
        // cacheControl: '3600', // Optional
        // upsert: false, // Optional
      });

    if (uploadError) {
      console.error('Error uploading presupuesto image:', uploadError);
      return { publicUrl: null, error: new Error(uploadError.message) };
    }

    console.log('Presupuesto image uploaded successfully, getting public URL...');

    const { data: urlData } = supabase.storage
      .from('public') // Must be the same bucket name
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      console.error('Error getting public URL for presupuesto image, urlData:', urlData);
      return { publicUrl: null, error: new Error('Error getting public URL after upload for presupuesto image.') };
    }

    console.log('Public URL for presupuesto image obtained:', urlData.publicUrl);
    return { publicUrl: urlData.publicUrl, error: null };

  } catch (e) {
    console.error('Unexpected error in uploadPresupuestoImage:', e);
    const error = e instanceof Error ? e : new Error(String(e));
    return { publicUrl: null, error };
  }
};


// --- Future Mutation Hooks Placeholder ---

import { useMutation, useQueryClient } from '@tanstack/react-query'; // Uncommented
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types'; // Uncommented

/**
 * Hook to create a new presupuesto.
 */
export const useCreatePresupuesto = () => {
  const queryClient = useQueryClient();
  return useMutation<Presupuesto, Error, TablesInsert<'presupuestos'>>({
    mutationFn: async (newPresupuestoData: TablesInsert<'presupuestos'>) => {
      console.log('Attempting to create presupuesto with:', newPresupuestoData); // Diagnostic log
      const { data, error } = await supabase
        .from('presupuestos')
        .insert(newPresupuestoData)
        .select(`
          *,
          clientes (
            id,
            nombre,
            telefono,
            email
          )
        `) // Fetch related client data
        .single();

      if (error) {
        console.error('Error creating presupuesto:', error);
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
      }
      console.log('Presupuesto created successfully in DB:', data); // Diagnostic log
      return data as Presupuesto; // Ensure casting to the extended type
    },
    onSuccess: () => {
      console.log('CreatePresupuesto successful, invalidating presupuestos query...'); // Diagnostic log
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
    },
    onError: (error) => {
      // This will be caught by react-query and can be handled in the component
      // or via a global error handler if set up.
      console.error('Mutation error on useCreatePresupuesto:', error.message); // Diagnostic log
    }
  });
};

export type UpdatePresupuestoArgs = { id: string; updates: TablesUpdate<'presupuestos'> };

/**
 * Hook to update an existing presupuesto.
 */
export const useUpdatePresupuesto = () => {
  const queryClient = useQueryClient();
  return useMutation<Presupuesto, Error, UpdatePresupuestoArgs>({
    mutationFn: async ({ id, updates }: UpdatePresupuestoArgs) => {
      console.log(`Attempting to update presupuesto ID ${id} with:`, updates); // Diagnostic log
      const { data, error } = await supabase
        .from('presupuestos')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          clientes (
            id,
            nombre,
            telefono,
            email
          )
        `) // Fetch related client data
        .single();

      if (error) {
        console.error(`Error updating presupuesto ID ${id}:`, error);
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
      }
      console.log(`Presupuesto ID ${id} updated successfully:`, data); // Diagnostic log
      return data as Presupuesto; // Ensure casting to the extended type
    },
    onSuccess: (data, variables) => {
      console.log(`UpdatePresupuesto for ID ${variables.id} successful, invalidating queries...`); // Diagnostic log
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
      // Optionally invalidate a specific presupuesto query if one exists
      queryClient.invalidateQueries({ queryKey: ['presupuesto', variables.id] });
    },
    onError: (error, variables) => {
      console.error(`Mutation error on useUpdatePresupuesto for ID ${variables.id}:`, error.message); // Diagnostic log
    }
  });
};

/**
 * Hook to delete a presupuesto.
 */
// export const useDeletePresupuesto = () => {
//   const queryClient = useQueryClient();
//   return useMutation<void, Error, string>({ // Returns void or the ID of deleted item
//     mutationFn: async (id: string) => {
//       const { error } = await supabase
//         .from('presupuestos')
//         .delete()
//         .eq('id', id);
//       if (error) {
//         console.error('Error deleting presupuesto:', error);
//         throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
//     },
//   });
// };
