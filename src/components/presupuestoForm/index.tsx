import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { presupuestoFormSchema } from "./schemas";
import type { PresupuestoFormValues } from "./types";
import { Form } from "@/components/ui/form";
import ClienteSection from "./ClienteSection";
import PlantillaSelector from "./PlantillaSelector";
import ComposicionProducto from "./ComposicionProducto";
import TotalesYAccionesButtons from "./TotalesYAccionesButtons";
import TotalSection from "./TotalSection";
import { toast } from "sonner";

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
    mode: "onChange",
    defaultValues: {
      cliente_nombre: "",
      domicilio: "",
      telefono: "",
      tipo_sistema_presupuesto: undefined,
      cantidad_panos: 1,
      medidas: [{ ancho: undefined, alto: undefined }],
      total: undefined,
    },
  });

  const handleFormSubmit = async (data: PresupuestoFormValues) => {
  console.log("📌 Datos enviados:", data);
  // No chequees isValid, porque handleSubmit lo garantiza
  await onSubmit(data);
};


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h3 className="text-red-800 font-semibold">Errores de validación:</h3>
            <ul className="text-red-600 mt-2">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  <strong>{field}:</strong> {error?.message || "Error desconocido"}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ClienteSection form={form} />
        <PlantillaSelector form={form} />
        <ComposicionProducto form={form} />
        <TotalSection form={form} />
        <TotalesYAccionesButtons isLoading={isLoading} onClose={onClose} />
      </form>
    </Form>
  );
};

export default PresupuestoForm;
