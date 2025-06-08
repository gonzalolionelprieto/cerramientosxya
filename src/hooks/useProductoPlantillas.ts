import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export type ProductoPlantilla = {
  id: string;
  tiposistema: string;
  descripcion: string | null;
  medidas_alto: number | null;
  medidas_ancho: number | null;
  medidas_prof: number | null;
  opciones: Json | null;
  esplantilla: boolean;
  imagen_url: string | null;
};

export const useProductoPlantillas = () => {
  return useQuery<ProductoPlantilla[], Error>({
    queryKey: ['productos', 'plantillas'],
    queryFn: async () => {
      console.log('🔍 Fetching producto plantillas...');

      const { data, error } = await supabase
        .from('productos')
        .select(`
          id,
          tiposistema,
          descripcion,
          medidas_alto,
          medidas_ancho,
          medidas_prof,
          opciones,
          esplantilla,
          imagen_url
        `)
        .eq('esplantilla', true)
        .order('tiposistema', { ascending: true });

      console.log('✅ Supabase response:', { data, error });

      if (error) {
        console.error('❌ Error fetching producto plantillas:', error.message, error.details);
        throw new Error(`Supabase error: ${error.message} (Code: ${error.code})`);
      }

      return (data || []).map((p) => ({
        ...p,
        medidas_alto: p.medidas_alto ? Number(p.medidas_alto) : null,
        medidas_ancho: p.medidas_ancho ? Number(p.medidas_ancho) : null,
        medidas_prof: p.medidas_prof ? Number(p.medidas_prof) : null,
      }));
    },
  });
};