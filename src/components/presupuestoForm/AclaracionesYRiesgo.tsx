import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SectionProps } from "./types";

const AclaracionesYRiesgo = ({ form }: SectionProps) => (
  <div className="space-y-4">
    <FormField
      control={form.control}
      name="incluye_riesgo_anclaje"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-2">
          <FormLabel>Incluye riesgo de anclaje</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="aclaraciones"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Aclaraciones</FormLabel>
          <FormControl>
            <Textarea rows={3} placeholder="Ej: Este presupuesto es válido por 72hs..." {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
);

export default AclaracionesYRiesgo;
