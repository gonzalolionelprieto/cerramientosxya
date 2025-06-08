import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { PresupuestoFormData } from '@/components/PresupuestoForm';

export function useSubmitPresupuesto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPresupuesto = async (data: PresupuestoFormData, editId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const {
        imagen_file,
        imagen_url,
        opciones_adicionales,
        precio_total,
        precio_base,
        tipo_sistema_presupuesto,
        estado,
        forma_pago,
        aclaraciones,
        cliente_id,
        medidas_alto,
        medidas_ancho,
        medidas_profundidad,
        trabajos_incluidos,
        accesorios_incluidos,
        tiempo_estimado,
        validez_presupuesto,
        composicion,
        incluye_riesgo_anclaje,
        garantia,
        producto_plantilla_id,
        materiales,
      } = data;

      const record = {
        cliente_id,
        producto_plantilla_id,
        medidas_alto,
        medidas_ancho,
        medidas_profundidad,
        materiales,
        precio_base,
        precio_total, // ⚠️ Este campo es requerido
        estado,
        imagen_url,
        opciones_adicionales, // ⚠️ Este debe ir así, no "accesorios"
        tipo_sistema_presupuesto,
        composicion,
        accesorios_incluidos,
        trabajos_incluidos,
        forma_pago,
        tiempo_estimado,
        validez_presupuesto,
        aclaraciones,
        incluye_riesgo_anclaje,
        garantia,
      };
      

      let response;

      if (editId) {
        response = await supabase
          .from('presupuestos')
          .update(record)
          .eq('id', editId);
      } else {
        response = await supabase
          .from('presupuestos')
          .insert([record]);
      }

      if (response.error) throw response.error;

      return response.data;
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitPresupuesto, loading, error };
}
