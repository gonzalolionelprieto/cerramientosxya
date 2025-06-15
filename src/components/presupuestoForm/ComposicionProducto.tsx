import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";
import { SectionProps } from "./types";

const ComposicionProducto = ({ form }: SectionProps) => (
  <div className="space-y-6">
    <FormField
      control={form.control}
      name="cantidad_panos"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cantidad de paños</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Ej: 2"
              value={field.value ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                const cant = value === "" ? undefined : Number(value);
                field.onChange(cant);
                form.setValue(
                  "medidas",
                  cant
                    ? Array.from({ length: cant }, () => ({ ancho: undefined, alto: undefined }))
                    : []
                );
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />

    {form.watch("medidas")?.map((_, index) => (
      <div key={index} className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name={`medidas.${index}.ancho`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancho paño {index + 1} (mm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ej: 1000"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`medidas.${index}.alto`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alto paño {index + 1} (mm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ej: 1200"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    ))}
  </div>
);

export default ComposicionProducto;
// Este componente permite ingresar la cantidad de paños y sus medidas (ancho y alto).