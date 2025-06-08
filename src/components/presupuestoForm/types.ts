import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { presupuestoFormSchema } from "./schemas";

export type PresupuestoFormValues = z.infer<typeof presupuestoFormSchema>;

export type SectionProps = {
  form: UseFormReturn<PresupuestoFormValues>;
};
