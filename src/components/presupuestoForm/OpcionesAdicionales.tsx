import React from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { SectionProps } from "./types";

const OpcionesAdicionales = ({ form }: SectionProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "opciones_adicionales",
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Opciones Adicionales</h3>
        <Button type="button" variant="outline" onClick={() => append({ nombre: "", precio: null })}>
          Agregar opción
        </Button>
      </div>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-2">
            <div className="col-span-7">
              <FormField
                control={form.control}
                name={`opciones_adicionales.${index}.nombre`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3">
              <FormField
                control={form.control}
                name={`opciones_adicionales.${index}.precio`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpcionesAdicionales;
