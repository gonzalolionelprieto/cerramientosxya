import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { SectionProps } from "./types";

const PlantillaSelector: React.FC<SectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="tipo_sistema_presupuesto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de sistema</FormLabel>
            <FormControl>
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                defaultValue={field.value ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de sistema..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="techo">Techo</SelectItem>
                  <SelectItem value="baranda_postes">Baranda con Postes</SelectItem>
                  <SelectItem value="baranda_click">Baranda Click</SelectItem>
                  <SelectItem value="cerramiento">Cerramiento</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PlantillaSelector;
// Este componente permite seleccionar el tipo de sistema del presupuesto
// y se integra con el formulario principal para manejar el estado y la validación.