import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, Json } from '@/integrations/supabase/types'; // Import Json if needed for specific opciones typing

// Define the type for a single product using the generic Tables helper
export type Producto = Tables<'productos'>;

/**
 * Custom hook to fetch all products from the 'productos' table in Supabase.
 * Uses React Query for caching and state management.
 * @returns A query object containing the products data, loading state, and error if any.
 */
export const useGetProductos = () => {
  return useQuery<Producto[], Error>({
    queryKey: ['productos'],
    queryFn: async () => {
      console.log('Fetching all products...'); // Diagnostic log

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response for all products:', { data, error }); // Diagnostic log

      if (error) {
        console.error('Error fetching productos:', error);
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
      }

      // Data should conform to Producto[] if Tables<'productos'> is accurate.
      // Default to empty array if data is null/undefined for some reason.
      return data || [];
    },
    // Optional: Add staleTime or cacheTime if needed
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Uploads a product image to Supabase Storage.
 * @param file The image file to upload.
 * @param userId Optional user ID to scope the file path (defaults to 'general').
 * @returns An object with the publicUrl of the uploaded image or an error.
 */
export const uploadProductImage = async (
  file: File,
  userId?: string
): Promise<{ publicUrl: string | null; error: Error | null }> => {
  try {
    const filePath = `productos/${userId || 'general'}/${Date.now()}-${file.name}`;

    console.log(`Uploading image to: ${filePath}`); // Diagnostic log

    const { error: uploadError } = await supabase.storage
      .from('public') // Corrected bucket name to 'public'
      .upload(filePath, file, {
        // cacheControl: '3600', // Optional: cache for 1 hour
        // upsert: false, // Optional: true to overwrite if file with same path exists
        // For simplicity in this step, removing optional params. Can be added back if needed.
      });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return { publicUrl: null, error: new Error(uploadError.message) };
    }

    console.log('Image uploaded successfully, getting public URL...'); // Diagnostic log

    const { data: urlData } = supabase.storage
      .from('public') // Corrected bucket name to 'public'
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      console.error('Error getting public URL, urlData:', urlData);
      return { publicUrl: null, error: new Error('Error getting public URL after upload.') };
    }

    console.log('Public URL obtained:', urlData.publicUrl); // Diagnostic log
    return { publicUrl: urlData.publicUrl, error: null };

  } catch (e) {
    console.error('Unexpected error in uploadProductImage:', e);
    const error = e instanceof Error ? e : new Error(String(e));
    return { publicUrl: null, error };
  }
};


// Future hooks for creating, updating, deleting products can be added here.
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Uncommented
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types'; // Uncommented

/**
 * Hook to create a new product.
 */
export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  return useMutation<Producto, Error, TablesInsert<'productos'>>({ // Added types for clarity
    mutationFn: async (newProducto: TablesInsert<'productos'>) => {
      console.log('Creating product with:', newProducto); // Diagnostic log
      const { data, error } = await supabase
        .from('productos')
        .insert(newProducto)
        .select()
        .single(); // Assuming you want the created record back

      if (error) {
        console.error('Error creating product:', error);
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
      }
      console.log('Product created successfully:', data); // Diagnostic log
      return data as Producto; // Cast if needed, or ensure select returns matching type
    },
    onSuccess: () => {
      console.log('Product creation successful, invalidating queries...'); // Diagnostic log
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
    onError: (error) => {
      console.error('Mutation error in useCreateProducto:', error); // Diagnostic log for mutation hook errors
    }
  });
};

export type UpdateProductoArgs = { id: string; updates: TablesUpdate<'productos'> };

/**
 * Hook to update an existing product.
 */
export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  return useMutation<Producto, Error, UpdateProductoArgs>({ // Added types for clarity
    mutationFn: async ({ id, updates }: UpdateProductoArgs) => {
      console.log(`Updating product ID ${id} with:`, updates); // Diagnostic log
      const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)
        .select() // Select all fields of the updated record
        .single();

      if (error) {
        console.error(`Error updating product ID ${id}:`, error);
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
      }
      console.log(`Product ID ${id} updated successfully:`, data); // Diagnostic log
      return data as Producto; // Cast if needed
    },
    onSuccess: (data, variables) => {
      console.log(`Product update successful for ID ${variables.id}, invalidating queries...`); // Diagnostic log
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      // Optionally, invalidate a specific product query if you have one
      // queryClient.invalidateQueries({ queryKey: ['producto', variables.id] });
    },
    onError: (error, variables) => {
      console.error(`Mutation error on useUpdateProducto for ID ${variables.id}:`, error.message); // Diagnostic log
    }
  });
};

// export const useDeleteProducto = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (id: string) => {
//       const { error } = await supabase.from('productos').delete().eq('id', id);
//       if (error) throw new Error(error.message);
//       return id;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['productos'] });
//     },
//   });
// };
