import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionProps } from "./types";

const PagoYEntrega = ({ form }: SectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <FormField
      control={form.control}
      name="forma_pago"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Forma de pago</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="tiempo_estimado"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tiempo estimado</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="validez_presupuesto"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Validez</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
);

export default PagoYEntrega;
