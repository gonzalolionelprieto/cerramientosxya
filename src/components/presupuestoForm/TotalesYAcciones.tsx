import React from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionProps } from "./types";

type TotalesYAccionesProps = SectionProps & {
  isLoading?: boolean;
  onClose: () => void;
};

const TotalesYAcciones = ({
  form,
  isLoading,
  onClose,
}: TotalesYAccionesProps) => (
  <div className="space-y-4">
    {/* ✅ Campo total del presupuesto */}
    <FormField
      control={form.control}
      name="total"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Total</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Ingrese el total del presupuesto"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />

    {/* ✅ Acciones */}
    <div className="flex gap-4">
      <Button type="submit" disabled={isLoading}>
        Guardar
      </Button>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancelar
      </Button>
    </div>
  </div>
);

export default TotalesYAcciones;
