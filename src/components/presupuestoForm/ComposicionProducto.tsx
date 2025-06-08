import React from "react";
import { Input } from "@/components/ui/input"; // Adjusted import for Input
import {
  FormField,
  FormItem,
  FormLabel,
    FormControl
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea"; // Adjusted import for Textarea
import { SectionProps } from "./types";

const ComposicionProducto = ({ form }: SectionProps) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="medidas_alto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alto (cm)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Ej: 120.5" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="medidas_ancho"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ancho (cm)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Ej: 80" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="medidas_prof"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profundidad (cm)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Ej: 4.5" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={form.control}
      name="descripcion"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Materiales y Detalles Específicos</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Describe los materiales, acabados, o detalles técnicos del sistema..."
              rows={3}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
);

export default ComposicionProducto;
// This component handles the product composition section of the budget form, allowing users to input dimensions and specific details about the product.
// It uses a responsive grid layout for the input fields and includes a textarea for detailed descriptions.