import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionProps } from "./types";


const TotalSection = ({ form }: SectionProps) => (
    <div className="space-y-4">

        {/* Total manual */}
        <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Total ($)</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            placeholder="Monto total"
                            value={field.value === undefined ? "" : field.value}
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
);

export default TotalSection;
