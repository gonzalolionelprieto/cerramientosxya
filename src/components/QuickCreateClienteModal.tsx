import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateCliente } from '@/hooks/useClientes'; // Assuming useCreateCliente is in useClientes.ts
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Schema for the quick create client form
const quickCreateClienteSchema = z.object({
  nombre: z.string().min(1, "Nombre es requerido."),
  email: z.string().email("Email no válido.").optional().or(z.literal('')),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  // ciudad and codigo_postal could be added if needed
});

type QuickCreateClienteFormData = z.infer<typeof quickCreateClienteSchema>;

interface QuickCreateClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClienteCreated: (newCliente: Tables<'clientes'>) => void;
}

const QuickCreateClienteModal: React.FC<QuickCreateClienteModalProps> = ({
  isOpen,
  onClose,
  onClienteCreated,
}) => {
  const createClienteMutation = useCreateCliente();

  const form = useForm<QuickCreateClienteFormData>({
    resolver: zodResolver(quickCreateClienteSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
    },
  });

  const onSubmit: SubmitHandler<QuickCreateClienteFormData> = async (data) => {
    try {
      // Prepare data for Supabase (ensure optional empty strings are nulls if DB expects that)
      const payload = {
        ...data,
        email: data.email || null,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
      };
      const newCliente = await createClienteMutation.mutateAsync(payload);
      if (newCliente) {
        toast.success(`Cliente "${newCliente.nombre}" creado exitosamente.`);
        onClienteCreated(newCliente as Tables<'clientes'>); // Pass the full client object
        form.reset(); // Reset form for next time
        onClose();
      }
    } catch (error) {
      const err = error as Error;
      toast.error("Error al crear cliente", {
        description: err.message || "No se pudo crear el nuevo cliente.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente Rápido</DialogTitle>
          <DialogDescription>
            Complete los detalles básicos del nuevo cliente. Podrá agregar más información luego.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Juan Pérez García" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ej: juan.perez@correo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: +34 600123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Calle Falsa 123, Ciudad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={createClienteMutation.isPending}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createClienteMutation.isPending}>
                {createClienteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {createClienteMutation.isPending ? "Creando..." : "Crear Cliente"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCreateClienteModal;
