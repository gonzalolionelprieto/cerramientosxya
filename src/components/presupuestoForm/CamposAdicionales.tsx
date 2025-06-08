// src/components/presupuestoForm/CamposAdicionales.tsx
import React from "react";
import { useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { SectionProps } from "./types";
import { useTipoSistemaConfig } from "@/hooks/useTipoSistemaConfig";

const CamposAdicionales = ({ form }: SectionProps) => {
  const tipoSistema = useWatch({
    control: form.control,
    name: "tipo_sistema_presupuesto",
  });

  const config = useTipoSistemaConfig(tipoSistema);
  const camposAdicionales = config?.camposAdicionales || [];

  if (camposAdicionales.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {camposAdicionales.map((campoName) => (
        <FormField
          key={campoName}
          control={form.control}
          name={campoName as keyof typeof form.getValues}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{campoName.replace(/_/g, " ").toUpperCase()}</FormLabel>
              <FormControl>
                <Input placeholder={`Ingrese ${campoName}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export default CamposAdicionales;
