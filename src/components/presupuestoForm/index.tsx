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
import TotalesYAcciones from "./TotalesYAcciones";

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
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ClienteSection form={form} />
        <PlantillaSelector form={form} />
        <ComposicionProducto form={form} />
        <OpcionesAdicionales form={form} />
        <DetallesExtras form={form} />
        <PagoYEntrega form={form} />
        <AclaracionesYRiesgo form={form} />
        <TotalesYAcciones form={form} isLoading={isLoading} onClose={onClose} />
      </form>
    </Form>
  );
};

export default PresupuestoForm;
