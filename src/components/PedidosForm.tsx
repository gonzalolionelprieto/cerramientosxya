import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PresupuestoForm from '@/components/presupuestoForm';
import { useCreatePresupuesto } from '@/hooks/usePresupuestos';
import type { PresupuestoFormValues } from '@/components/presupuestoForm/types';
import { supabase } from '@/integrations/supabase/client';

const CrearPresupuestoPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: createPresupuesto, status } = useCreatePresupuesto();
  const isLoading = status === 'pending';

  const handleSubmit = async (data: PresupuestoFormValues) => {
    try {
      const payload = {
        ...data,
        cliente_id: data.cliente_id!,
        precio_total: 0,
        generado_el: new Date().toISOString(),
      };

      // Guardar en Supabase
      const { data: inserted, error } = await supabase
        .from('presupuestos')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      // Llamar a API para generar PDF
      const response = await fetch('/api/generar-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: data.tipo_sistema_presupuesto,
          datos: payload,
          presupuesto_id: inserted.id,
        }),
      });

      if (!response.ok) throw new Error('Error generando PDF');

      toast.success('Presupuesto creado y PDF generado con éxito');
      navigate('/pedidos');
    } catch (err) {
      console.error(err);
      toast.error('Error al crear presupuesto');
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
