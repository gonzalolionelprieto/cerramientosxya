import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionProps } from "./types";

const ClienteSection = ({ form }: SectionProps) => (
  <FormField
    control={form.control}
    name="cliente_id"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Cliente</FormLabel>
        <FormControl>
          <Input placeholder="ID o nombre del cliente" {...field} />
        </FormControl>
      </FormItem>
    )}
  />
);

export default ClienteSection;