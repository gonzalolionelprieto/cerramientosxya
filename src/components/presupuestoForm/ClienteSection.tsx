import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionProps } from "./types";

const ClienteSection = ({ form }: SectionProps) => (
  <><FormField
    control={form.control}
    name="cliente_nombre"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Nombre cliente</FormLabel>
        <FormControl>
          <Input placeholder="Nombre del cliente" {...field} />
        </FormControl>
      </FormItem>
    )} /><FormField
      control={form.control}
      name="domicilio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Domicilio</FormLabel>
          <FormControl>
            <Input placeholder="Domicilio del cliente" {...field} />
          </FormControl>
        </FormItem>
      )} /><FormField
      control={form.control}
      name="telefono"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Teléfono</FormLabel>
          <FormControl>
            <Input placeholder="Teléfono del cliente" {...field} />
          </FormControl>
        </FormItem>
      )} /></>

);

export default ClienteSection;
