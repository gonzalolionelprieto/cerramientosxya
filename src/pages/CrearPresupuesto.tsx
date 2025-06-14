import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PresupuestoForm from '@/components/presupuestoForm';
import { supabase } from '@/integrations/supabase/client';
import type { PresupuestoFormValues } from '@/components/presupuestoForm/types';
import downloadPdfPresupuesto from '@/lib/pdf/downloadPdf';
import { CONFIGS } from '@/hooks/useTipoSistemaConfig';
import type { TipoSistema } from '@/hooks/useTipoSistemaConfig';
import { PresupuestoDB } from '@/types/PresupuestoDB';

const CrearPresupuesto: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: PresupuestoFormValues) => {
        console.log('✅ Formulario enviado:', data);

        try {
            const payload: PresupuestoDB = {
                ...data,
                cliente_id: data.cliente_id!,
                costo_total: 0,
                estado: 'pendiente',
                fecha_creacion: new Date().toISOString(),
                tipo_producto: 'cerramiento', // por defecto
                sistema: data.tipo_sistema_presupuesto,
            };

            const { error } = await supabase.from('presupuestos').insert([payload]);
            if (error) throw error;

            const config = CONFIGS[data.tipo_sistema_presupuesto as TipoSistema];

            const campos = config.camposEnPDF
                ? Object.fromEntries(
                    Object.keys(config.camposEnPDF).map((key) => [key, data[key]])
                )
                : {};

            await downloadPdfPresupuesto({
                tipo_sistema_presupuesto: data.tipo_sistema_presupuesto,
                campos,
            });

            toast.success('Presupuesto creado y PDF generado');
            navigate('/pedidos');
        } catch (error) {
            toast.error('Error al crear el presupuesto');
            console.error(error);
        }
    };

    // Aquí podrías manejar el estado de carga si fuera necesario
    // const isLoading = status === 'pending';
    // Si estás usando un hook para crear presupuestos, podrías usarlo aquí
    // const { mutateAsync: createPresupuesto, status } = useCreatePresupuesto();
    // const isLoading = status === 'pending';
    
    console.log('🔍 CrearPresupuesto montado');
    // Este log es para verificar que el componente se monta correctamente
    // Si necesitas manejar el estado de carga, puedes hacerlo aquí DD
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

export default CrearPresupuesto;
