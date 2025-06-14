import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { presupuestoFormSchema } from "./schemas";
import type { PresupuestoFormValues } from "./types";
import { Form } from "@/components/ui/form";

import ClienteSection from "./ClienteSection";
import PlantillaSelector from "./PlantillaSelector";
import ComposicionProducto from "./ComposicionProducto";
import OpcionesAdicionales from "./OpcionesAdicionales";
import DetallesExtras from "./DetallesExtras";
import PagoYEntrega from "./PagoYEntrega";
import AclaracionesYRiesgo from "./AclaracionesYRiesgo";
import TotalesYAccionesButtons from "./TotalesYAccionesButtons";

type PresupuestoFormProps = {
  onSubmit: (data: PresupuestoFormValues) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
};

const PresupuestoForm: React.FC<PresupuestoFormProps> = ({
  onSubmit,
  onClose,
  isLoading
}) => {
  const form = useForm<PresupuestoFormValues>({
    resolver: zodResolver(presupuestoFormSchema),
    mode: "onChange", // ✅ Esto hace que isValid se calcule correctamente
    defaultValues: {
      tipo_sistema_presupuesto: undefined,
      cliente_id: "",
      descripcion: null,
      medidas_alto: null,
      medidas_ancho: null,
      medidas_prof: null,
      accesorios_incluidos: null,
      trabajos_incluidos: null,
      forma_pago: null,
      tiempo_estimado: null,
      validez_presupuesto: null,
      incluye_riesgo_anclaje: false,
      aclaraciones: null,
      garantia: null,
    },
  });


  // ✅ Debug mejorado
  const handleFormSubmit = async (data: PresupuestoFormValues) => {
    console.log('📝 Datos del formulario:', data);
    console.log('🔍 Errores:', form.formState.errors);
    console.log('✅ Es válido:', form.formState.isValid);
    console.log('📊 Estado del form:', {
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
      isValid: form.formState.isValid,
      errors: form.formState.errors,
      values: form.getValues()
    });

    // Solo continuar si es válido
    if (form.formState.isValid) {
      await onSubmit(data);
    } else {
      console.error('❌ Formulario inválido, no se puede enviar');
    }
  };

  // ✅ Debug en tiempo real
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log(`🔄 Campo ${name} cambió:`, value[name]);
      console.log('🔍 Errores actuales:', form.formState.errors);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* ✅ Mostrar errores visualmente */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="text-red-800 font-semibold">Errores de validación:</h3>
            <ul className="text-red-600 mt-2">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  <strong>{field}:</strong> {error?.message || 'Error desconocido'}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ClienteSection form={form} />
        <PlantillaSelector form={form} />
        <ComposicionProducto form={form} />
        <OpcionesAdicionales form={form} />
        <DetallesExtras form={form} />
        <PagoYEntrega form={form} />
        <AclaracionesYRiesgo form={form} />

        <TotalesYAccionesButtons
          isLoading={isLoading}
          onClose={onClose}
        />
      </form>
    </Form>
  );
}

export default PresupuestoForm;