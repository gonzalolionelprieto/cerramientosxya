import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PresupuestoForm from '@/components/presupuestoForm';
import { supabase } from '@/integrations/supabase/client';
import type { PresupuestoFormValues } from '@/components/presupuestoForm/types';
import downloadPdfPresupuesto from '@/lib/pdf/downloadPdf';
import { CONFIGS } from '@/hooks/useTipoSistemaConfig';
import type { TipoSistema } from '@/hooks/useTipoSistemaConfig';
import type { PresupuestoDB } from '@/types/PresupuestoDB';

const CrearPresupuestoPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: PresupuestoFormValues) => {
    console.log('✅ Formulario enviado:', data);

    const medidasTexto = data.medidas
      .map((m, idx) => `Paño ${idx + 1}: ${m.ancho} x ${m.alto}`)
      .join(" | ");

    console.log("📝 Texto de medidas:", medidasTexto);

    try {
      const { data: existingClient, error: findError } = await supabase
        .from('clientes')
        .select('id')
        .eq('nombre', data.cliente_nombre)
        .single();

      if (findError && findError.code !== 'PGRST116') throw findError;

      let cliente_id = existingClient?.id;

      if (!cliente_id) {
        const { data: newClient, error: createError } = await supabase
          .from('clientes')
          .insert({ nombre: data.cliente_nombre })
          .select('id')
          .single();

        if (createError) throw createError;
        cliente_id = newClient.id;
      }

      const payload: PresupuestoDB = {
        cliente_id,
        cliente_nombre: data.cliente_nombre,
        domicilio: data.domicilio,
        telefono: data.telefono,
        tipo_sistema_presupuesto: data.tipo_sistema_presupuesto,
        cantidad_panos: data.cantidad_panos,
        medidas: data.medidas,
        total: data.total,
      };

      const { error: insertError } = await supabase
        .from('presupuestos')
        .insert([payload]);

      if (insertError) throw insertError;

      const config = CONFIGS[data.tipo_sistema_presupuesto as TipoSistema];
      if (!config) throw new Error('Config no encontrada para el sistema');

      const campos = {
        ...Object.fromEntries(
          Object.keys(config.camposEnPDF).map((key) => [
            config.camposEnPDF[key],
            data[key]
          ])
        ),
        MEDIDAS: medidasTexto
      };

      // 🚀 Logs para depuración del PDF
      console.log("📄 Campos que le paso al PDF:", campos);
      console.log("📄 Archivo plantilla PDF:", config.archivoPlantilla);

      await downloadPdfPresupuesto({
        tipo_sistema_presupuesto: data.tipo_sistema_presupuesto as TipoSistema,
        campos,
      });

      toast.success('Presupuesto creado y PDF descargado');
      navigate('/pedidos');

    } catch (error: any) {
      console.error('❌ Error al guardar presupuesto:', JSON.stringify(error, null, 2));
      toast.error(`Error: ${error.message || 'Error al guardar presupuesto'}`);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nuevo Presupuesto</h1>
      <PresupuestoForm
        onSubmit={handleSubmit}
        isLoading={false}
        onClose={() => navigate('/pedidos')}
      />
    </div>
  );
};

export default CrearPresupuestoPage;
