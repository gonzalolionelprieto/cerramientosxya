import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useInstaladores } from '@/hooks/useInstaladores'; // For populating select
import { useUpdateInstalacion, InstalacionWithDetails } from '@/hooks/useInstalaciones'; // Or a more generic type
import type { InstalacionLogisticaDetalles } from '@/hooks/useInstalacionesLogistica';
import { Loader2 } from 'lucide-react';

// Form schema for validation
const instalacionFormSchema = z.object({
  hora_inicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:MM requerido"),
  hora_fin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:MM requerido"),
  instalador_id: z.string().min(1, "Instalador es requerido"),
  herramientas_requeridas: z.string().optional(), // Comma-separated string
});

type InstalacionFormData = z.infer<typeof instalacionFormSchema>;

// Define a union type for the instalacion prop to be flexible
type InstalacionEditable = InstalacionWithDetails | InstalacionLogisticaDetalles;

interface EditInstalacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  instalacionToEdit: InstalacionEditable | null;
  onInstalacionUpdated: () => void;
}

const EditInstalacionModal: React.FC<EditInstalacionModalProps> = ({
  isOpen,
  onClose,
  instalacionToEdit,
  onInstalacionUpdated,
}) => {
  const { data: instaladores = [], isLoading: isLoadingInstaladores } = useInstaladores();
  const updateInstalacionMutation = useUpdateInstalacion();

  const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<InstalacionFormData>({
    resolver: zodResolver(instalacionFormSchema),
    defaultValues: {
      hora_inicio: '',
      hora_fin: '',
      instalador_id: '',
      herramientas_requeridas: '',
    }
  });

  useEffect(() => {
    if (instalacionToEdit) {
      reset({
        hora_inicio: instalacionToEdit.hora_inicio || '',
        hora_fin: instalacionToEdit.hora_fin || '',
        // The 'instaladores' field in InstalacionWithDetails/LogisticaDetalles is an object, not just an ID.
        // The form needs instalador_id.
        instalador_id: instalacionToEdit.instaladores?.id ||
                       (typeof instalacionToEdit.instalador_id === 'string' ? instalacionToEdit.instalador_id : ''),
        herramientas_requeridas: Array.isArray(instalacionToEdit.herramientas_requeridas)
                                 ? instalacionToEdit.herramientas_requeridas.join(', ')
                                 : '',
      });
    } else {
      reset(); // Reset to default values when no installation is being edited or modal closes
    }
  }, [instalacionToEdit, reset]);

  const onSubmit: SubmitHandler<InstalacionFormData> = async (formData) => {
    if (!instalacionToEdit) return;

    const updates = {
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
      instalador_id: formData.instalador_id,
      herramientas_requeridas: formData.herramientas_requeridas?.split(',').map(h => h.trim()).filter(h => h) || [],
    };

    try {
      await updateInstalacionMutation.mutateAsync({
        id: instalacionToEdit.id,
        ...updates,
      });
      toast.success("Instalación actualizada correctamente.");
      onInstalacionUpdated(); // This will trigger query invalidation in the parent
      onClose();
    } catch (error) {
      const err = error as Error;
      toast.error("Error al actualizar instalación", {
        description: err.message || "No se pudo actualizar la instalación.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Editar Instalación: {instalacionToEdit?.codigo}</DialogTitle>
          <DialogDescription>
            Modifique los detalles de la instalación. Haga clic en guardar cuando haya terminado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="hora_inicio">Hora de Inicio</Label>
            <Controller
              name="hora_inicio"
              control={control}
              render={({ field }) => <Input id="hora_inicio" type="time" {...field} />}
            />
            {errors.hora_inicio && <p className="text-xs text-red-600 mt-1">{errors.hora_inicio.message}</p>}
          </div>

          <div>
            <Label htmlFor="hora_fin">Hora de Fin</Label>
            <Controller
              name="hora_fin"
              control={control}
              render={({ field }) => <Input id="hora_fin" type="time" {...field} />}
            />
            {errors.hora_fin && <p className="text-xs text-red-600 mt-1">{errors.hora_fin.message}</p>}
          </div>

          <div>
            <Label htmlFor="instalador_id">Instalador</Label>
            <Controller
              name="instalador_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingInstaladores}>
                  <SelectTrigger id="instalador_id">
                    <SelectValue placeholder={isLoadingInstaladores ? "Cargando..." : "Seleccionar instalador..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {instaladores
                      .filter(inst => inst.activo) // Assuming 'activo' field from useInstaladores hook
                      .map(instalador => (
                      <SelectItem key={instalador.id} value={instalador.id}>
                        {instalador.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.instalador_id && <p className="text-xs text-red-600 mt-1">{errors.instalador_id.message}</p>}
          </div>

          <div>
            <Label htmlFor="herramientas_requeridas">Herramientas Requeridas (separadas por coma)</Label>
            <Controller
              name="herramientas_requeridas"
              control={control}
              render={({ field }) => <Input id="herramientas_requeridas" placeholder="Ej: Taladro, Escalera, Nivel" {...field} />}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={updateInstalacionMutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isDirty || updateInstalacionMutation.isPending}>
              {updateInstalacionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {updateInstalacionMutation.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInstalacionModal;
