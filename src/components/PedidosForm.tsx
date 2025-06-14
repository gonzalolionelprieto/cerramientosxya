import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PresupuestoForm from '@/components/presupuestoForm';
import { useCreatePresupuesto } from '@/hooks/usePresupuestos';
import type { PresupuestoFormValues } from '@/components/presupuestoForm/types';
import { supabase } from '@/integrations/supabase/client';
import downloadPdfPresupuesto from '@/lib/pdf/downloadPdf';
import type { TipoSistema } from '@/hooks/useTipoSistemaConfig';
import { PresupuestoDB } from '@/types/PresupuestoDB';
import { CONFIGS } from '@/hooks/useTipoSistemaConfig'; // ✅ importante

const CrearPresupuestoPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: createPresupuesto, status } = useCreatePresupuesto();
  const isLoading = status === 'pending';

  const handleSubmit = async (data: PresupuestoFormValues) => {
    console.log('✅ Formulario enviado:', data); // ⬅️ este log
    try {
      const payload: PresupuestoDB = {
        ...data,
        cliente_id: data.cliente_id!,
        costo_total: 0,
        estado: 'pendiente',
        fecha_creacion: new Date().toISOString(),
        tipo_producto: "cerramiento", // ajustá si hace falta
        sistema: data.tipo_sistema_presupuesto,
      };

      const { data: inserted, error } = await supabase
        .from('presupuestos')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      // ✅ Accedemos a config
      const config = CONFIGS[data.tipo_sistema_presupuesto as TipoSistema];

      // ✅ Extraemos solo los campos requeridos por el PDF
      const campos = config.camposEnPDF
        ? Object.fromEntries(
          Object.keys(config.camposEnPDF).map((key) => [key, data[key]])
        )
        : {};

      // ✅ Generar PDF
      await downloadPdfPresupuesto({
        tipo_sistema_presupuesto: data.tipo_sistema_presupuesto,
        campos,
      });

      toast.success('Presupuesto creado y PDF descargado');
      navigate('/pedidos');
    } catch (error) {
      toast.error('Error al guardar presupuesto');
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Presupuesto</h1>
      <PresupuestoForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onClose={() => navigate('/pedidos')}
      />
    </div>
  );
};

export default CrearPresupuestoPage;
