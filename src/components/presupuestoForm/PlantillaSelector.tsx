import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { SectionProps } from "./types";
import { Input } from "@/components/ui/input";

// ✅ PlantillaSelector bien tipado
const PlantillaSelector = ({ form }: SectionProps) => {
  return <div>Selector de Plantilla (pendiente de lógica)</div>;
};

export default PlantillaSelector;

// ✅ ComposicionProducto correctamente exportado y funcionando
export const ComposicionProducto = ({ form }: SectionProps) => (
  <div className="grid grid-cols-3 gap-4">
    <FormField
      control={form.control}
      name="medidas_ancho"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ancho</FormLabel>
          <FormControl>
            <Input type="number" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="medidas_alto"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Alto</FormLabel>
          <FormControl>
            <Input type="number" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="medidas_prof"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profundidad</FormLabel>
          <FormControl>
            <Input type="number" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
);
