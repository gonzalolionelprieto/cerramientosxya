import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useVehiculosDisponibles, type VehiculoDisponible } from '@/hooks/useVehiculosDisponibles';
import { useUpdateInstalacion } from '@/hooks/useInstalaciones'; // For updating instalacion.vehiculo_id
import { useUpdateVehiculo } from '@/hooks/useVehiculosMutations'; // For updating vehiculo.disponible
import type { InstalacionLogisticaDetalles } from '@/hooks/useInstalacionesLogistica';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { AlertCircle } from 'lucide-react'; // Import AlertCircle

interface AsignarVehiculoModalProps {
  isOpen: boolean;
  onClose: () => void;
  instalacion: InstalacionLogisticaDetalles | null;
  onVehiculoAsignado: () => void;
}

const AsignarVehiculoModal: React.FC<AsignarVehiculoModalProps> = ({
  isOpen,
  onClose,
  instalacion,
  onVehiculoAsignado,
}) => {
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<string | undefined>(undefined);
  const {
    data: vehiculosDisponibles = [],
    isLoading: isLoadingVehiculos,
    isError: isErrorVehiculos,
    error: errorVehiculos
  } = useVehiculosDisponibles();

  const updateInstalacionMutation = useUpdateInstalacion();
  const updateVehiculoMutation = useUpdateVehiculo();

  useEffect(() => {
    // Reset selected vehicle when the modal is reopened for a new installation or closed
    if (isOpen) {
      setSelectedVehiculoId(instalacion?.vehiculo_id || undefined);
    }
  }, [isOpen, instalacion]);

  const handleConfirmAsignacion = async () => {
    if (!selectedVehiculoId || !instalacion) {
      toast.warning("Por favor, seleccione un vehículo.");
      return;
    }

    const previouslyAssignedVehiculoId = instalacion.vehiculo_id;

    try {
      // Step 1: Update installation with the new vehicle_id
      await updateInstalacionMutation.mutateAsync({
        id: instalacion.id,
        vehiculo_id: selectedVehiculoId,
      });

      // Step 2: Set the newly assigned vehicle as not disponible
      await updateVehiculoMutation.mutateAsync({
        vehiculoId: selectedVehiculoId,
        updates: { disponible: false },
      });

      // Step 3: If there was a previously assigned vehicle, set it back to disponible
      if (previouslyAssignedVehiculoId && previouslyAssignedVehiculoId !== selectedVehiculoId) {
        await updateVehiculoMutation.mutateAsync({
          vehiculoId: previouslyAssignedVehiculoId,
          updates: { disponible: true },
        });
      }

      toast.success("Vehículo asignado correctamente a la instalación.");
      onVehiculoAsignado(); // This will trigger query invalidation in the parent
      onClose();
    } catch (error) {
      const err = error as Error;
      toast.error("Error al asignar vehículo", {
        description: err.message || "Ocurrió un error desconocido.",
      });
      // Potentially handle rollback or partial success if needed, though complex.
      // For now, separate error messages might indicate which step failed if one did.
    }
  };

  const isMutating = updateInstalacionMutation.isPending || updateVehiculoMutation.isPending;

  // Prepare a list of vehicles: available ones + the one currently assigned to this installation (if any)
  const selectableVehiculos = [...vehiculosDisponibles];
  if (instalacion?.vehiculo_id && instalacion.vehiculos) {
    const currentVehiculoInList = selectableVehiculos.find(v => v.id === instalacion.vehiculo_id);
    if (!currentVehiculoInList) {
      // Add the currently assigned vehicle to the list if it's not already there (e.g. if it's not 'disponible' but assigned to this one)
      selectableVehiculos.push({
        id: instalacion.vehiculo_id,
        matricula: instalacion.vehiculos.matricula,
        modelo: instalacion.vehiculos.modelo,
        disponible: false, // It's assigned, so not generally 'disponible'
      });
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Vehículo a Instalación: {instalacion?.codigo}</DialogTitle>
          <DialogDescription>
            Seleccione un vehículo disponible de la lista para asignarlo a esta instalación.
            Si ya hay un vehículo asignado, puede cambiarlo.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="vehiculo-select">Vehículos Disponibles</Label>
            <Select
              value={selectedVehiculoId}
              onValueChange={setSelectedVehiculoId}
              disabled={isLoadingVehiculos || isMutating || isErrorVehiculos}
            >
              <SelectTrigger id="vehiculo-select">
                <SelectValue placeholder={
                  isLoadingVehiculos ? "Cargando vehículos..." :
                  isErrorVehiculos ? "Error al cargar vehículos" :
                  "Seleccionar vehículo..."
                } />
              </SelectTrigger>
              <SelectContent>
                {isErrorVehiculos ? (
                  <div className="p-4 text-center text-sm text-red-600">
                    Error al cargar. Intente más tarde.
                  </div>
                ) : selectableVehiculos.length === 0 && !isLoadingVehiculos ? (
                  <SelectItem value="no-vehiculos" disabled>No hay vehículos disponibles</SelectItem>
                ) : (
                  selectableVehiculos.map((vehiculo) => (
                    <SelectItem key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.modelo} - {vehiculo.matricula}
                      {vehiculo.id === instalacion?.vehiculo_id && " (Actual)"}
                      {!vehiculo.disponible && vehiculo.id !== instalacion?.vehiculo_id && " (No disponible)"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {isLoadingVehiculos && <p className="text-xs text-muted-foreground mt-1">Cargando lista de vehículos...</p>}
            {isErrorVehiculos && (
              <p className="text-xs text-red-600 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Error: {errorVehiculos?.message || "No se pudieron cargar los vehículos."}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isMutating}>
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleConfirmAsignacion} disabled={!selectedVehiculoId || isMutating}>
            {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isMutating ? "Asignando..." : "Confirmar Asignación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AsignarVehiculoModal;
