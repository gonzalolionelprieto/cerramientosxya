import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SectionProps } from "./types";

const DetallesExtras = ({ form }: SectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="accesorios_incluidos"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Accesorios incluidos</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="trabajos_incluidos"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Trabajos incluidos</FormLabel>
          <FormControl>
            <Textarea rows={3} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
);

export default DetallesExtras;

