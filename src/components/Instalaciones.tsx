
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, Wrench, CheckCircle, Download, X, Loader2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useInstalaciones, InstalacionWithDetails, useUpdateInstalacion } from '@/hooks/useInstalaciones';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import EditInstalacionModal from './EditInstalacionModal';


const Instalaciones: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: instalaciones = [], isLoading, isError, error: instalacionError, refetch: refetchInstalaciones } = useInstalaciones(selectedDate);
  const updateInstalacionMutation = useUpdateInstalacion(); // Renamed for clarity as it's used for multiple actions

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInstalacion, setEditingInstalacion] = useState<InstalacionWithDetails | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingInstalacion, setViewingInstalacion] = useState<InstalacionWithDetails | null>(null);

  // Form related hooks (useForm, useEffect for reset) are removed as they are now in EditInstalacionModal

  const handleEditClick = (instalacion: InstalacionWithDetails) => {
    setEditingInstalacion(instalacion);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingInstalacion(null);
    // reset() call removed, form reset is handled within EditInstalacionModal
  };

  const handleViewDetailsClick = (instalacion: InstalacionWithDetails) => {
    setViewingInstalacion(instalacion);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingInstalacion(null);
  };

  const handleDescargarPlanos = (planosUrl: string | null | undefined) => {
    if (planosUrl) {
      window.open(planosUrl, '_blank');
      toast.info("Iniciando descarga de planos...", {
        description: "Su navegador abrirá o descargará el archivo."
      });
    } else {
      toast.warning("No hay planos disponibles", {
        description: "No se encontró una URL de planos para esta instalación.",
      });
    }
  };

  // onSubmitEditForm is removed as it's now within EditInstalacionModal

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'en-curso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'programada': return 'Programada';
      case 'en-curso': return 'En Curso';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const handleIniciarInstalacion = async (instalacionId: string) => {
    try {
      await updateInstalacionMutation.mutateAsync({
        id: instalacionId,
        estado: 'en_progreso'
      });
      toast.success("Instalación iniciada", {
        description: "La instalación ha sido marcada como en progreso.",
      });
    } catch (error) {
      const err = error as Error;
      toast.error("Error al iniciar instalación", {
        description: err.message || "No se pudo iniciar la instalación.",
      });
    }
  };

  const handleCompletarInstalacion = async (instalacionId: string) => {
    try {
      await updateInstalacionMutation.mutateAsync({
        id: instalacionId,
        estado: 'completada'
      });
      toast.success("Instalación completada", {
        description: "La instalación ha sido marcada como completada.",
      });
    } catch (error) {
      const err = error as Error;
      toast.error("Error al completar instalación", {
        description: err.message || "No se pudo completar la instalación.",
      });
    }
  };

  if (isLoading) {
    // Skeleton for the main list
    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-6 w-24 ml-auto" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError && instalacionError) {
     return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al Cargar Instalaciones</AlertTitle>
          <AlertDescription>
            No se pudieron cargar las instalaciones. Intente de nuevo más tarde.
            <p className="mt-2 text-xs">Detalle: {instalacionError.message}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Instalaciones</h1>
        <p className="text-gray-600 mt-2">Programe y supervise las instalaciones</p>
      </div>

      {/* Selector de Fecha */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <label htmlFor="fecha" className="font-medium text-gray-700">
              Seleccionar fecha:
            </label>
            <input
              type="date"
              id="fecha"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Badge variant="outline" className="ml-auto">
              {instalaciones.length} instalaciones programadas
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Timeline de Instalaciones */}
      <div className="space-y-4">
        {instalaciones.map((instalacion) => (
          <Card key={instalacion.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Información Principal */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{instalacion.codigo}</h3>
                      <Badge className={getStatusColor(instalacion.estado)}>
                        {getStatusText(instalacion.estado)}
                      </Badge>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">
                        {instalacion.hora_inicio} - {instalacion.hora_fin}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-medium">{instalacion.pedidos?.clientes?.nombre || 'Cliente no disponible'}</span>
                        <span className="ml-2 text-sm text-gray-500">({instalacion.pedidos?.clientes?.telefono})</span>
                      </div>
                      
                      <div className="flex items-start text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{instalacion.pedidos?.clientes?.direccion}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Wrench className="w-4 h-4 mr-2" />
                        <span className="text-sm">Instalador: {instalacion.instaladores?.nombre || 'Sin asignar'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Tipo:</span>
                        <span className="ml-2">{instalacion.pedidos?.tipo_ventana}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Pedido:</span>
                        <span className="ml-2">{instalacion.pedidos?.numero_orden}</span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Medidas:</span>
                        <span className="ml-2">{instalacion.pedidos?.medidas || 'No especificadas'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Herramientas */}
                  {instalacion.herramientas_requeridas && instalacion.herramientas_requeridas.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Herramientas requeridas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {instalacion.herramientas_requeridas.map((herramienta, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {herramienta}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comentarios */}
                  {instalacion.comentarios && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Comentarios:</strong> {instalacion.comentarios}
                      </p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDescargarPlanos(instalacion.planos_url)}
                    disabled={!instalacion.planos_url}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Planos
                  </Button>
                  
                  {instalacion.estado === 'programada' && (
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleIniciarInstalacion(instalacion.id)}
                      disabled={updateInstalacionMutation.isPending && updateInstalacionMutation.variables?.id === instalacion.id}
                    >
                      {updateInstalacionMutation.isPending && updateInstalacionMutation.variables?.id === instalacion.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Iniciar Instalación
                    </Button>
                  )}
                  
                  {instalacion.estado === 'en_progreso' && ( // Assuming 'en_progreso' is the active state
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCompletarInstalacion(instalacion.id)}
                      disabled={updateInstalacionMutation.isPending && updateInstalacionMutation.variables?.id === instalacion.id}
                    >
                      {updateInstalacionMutation.isPending && updateInstalacionMutation.variables?.id === instalacion.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completar
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEditClick(instalacion)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleViewDetailsClick(instalacion)}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {instalaciones.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay instalaciones programadas
            </h3>
            <p className="text-gray-600 mb-4">
              Para la fecha seleccionada: {new Date(selectedDate).toLocaleDateString()}
            </p>
            <Button>
              Programar Nueva Instalación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Instalacion Modal - Now uses the extracted component */}
      {isEditModalOpen && editingInstalacion && (
        <EditInstalacionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          instalacionToEdit={editingInstalacion}
          onInstalacionUpdated={() => {
            // The hook useUpdateInstalacion inside EditInstalacionModal already invalidates ['instalaciones']
            // If direct refetch is needed here for some reason (e.g. different query key used by parent), use:
            // refetchInstalaciones();
            // For now, relying on the hook's invalidation.
          }}
        />
      )}

      {/* View Instalacion Details Modal */}
      {viewingInstalacion && (
        <Dialog open={isViewModalOpen} onOpenChange={(open) => { if (!open) handleCloseViewModal(); }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalles de Instalación: {viewingInstalacion.codigo}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <p><span className="font-semibold text-gray-600">Estado:</span></p>
                <Badge className={getStatusColor(viewingInstalacion.estado)}>
                  {getStatusText(viewingInstalacion.estado)}
                </Badge>

                <p><span className="font-semibold text-gray-600">Fecha:</span></p>
                <p>{viewingInstalacion.fecha ? new Date(viewingInstalacion.fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>

                <p><span className="font-semibold text-gray-600">Hora Inicio:</span></p>
                <p>{viewingInstalacion.hora_inicio || 'N/A'}</p>

                <p><span className="font-semibold text-gray-600">Hora Fin:</span></p>
                <p>{viewingInstalacion.hora_fin || 'N/A'}</p>

                <p className="col-span-2 mt-2 font-semibold text-gray-700 border-t pt-2">Cliente y Pedido:</p>
                <p><span className="font-semibold text-gray-600">Cliente:</span></p>
                <p>{viewingInstalacion.pedidos?.clientes?.nombre || 'N/A'}</p>

                <p><span className="font-semibold text-gray-600">Dirección:</span></p>
                <p>{viewingInstalacion.pedidos?.clientes?.direccion || 'N/A'}</p>

                <p><span className="font-semibold text-gray-600">Teléfono:</span></p>
                <p>{viewingInstalacion.pedidos?.clientes?.telefono || 'N/A'}</p>

                <p><span className="font-semibold text-gray-600">Tipo Ventana:</span></p>
                <p>{viewingInstalacion.pedidos?.tipo_ventana || 'N/A'}</p>

                <p><span className="font-semibold text-gray-600">Medidas:</span></p>
                <p>{viewingInstalacion.pedidos?.medidas || 'N/A'}</p>

                <p className="col-span-2 mt-2 font-semibold text-gray-700 border-t pt-2">Equipo y Tareas:</p>
                <p><span className="font-semibold text-gray-600">Instalador:</span></p>
                <p>{viewingInstalacion.instaladores?.nombre || 'Sin asignar'}</p>

                <p><span className="font-semibold text-gray-600">Herramientas:</span></p>
                <p>{viewingInstalacion.herramientas_requeridas?.join(', ') || 'Ninguna especificada'}</p>

                <p className="col-span-2 mt-2 font-semibold text-gray-700 border-t pt-2">Documentación y Comentarios:</p>
                <p><span className="font-semibold text-gray-600">Planos URL:</span></p>
                <p>
                  {viewingInstalacion.planos_url ? (
                    <a href={viewingInstalacion.planos_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Ver Planos
                    </a>
                  ) : 'No disponible'}
                </p>

                <p className="col-span-2"><span className="font-semibold text-gray-600">Comentarios:</span></p>
                <p className="col-span-2 bg-gray-50 p-2 rounded text-gray-700 whitespace-pre-wrap">
                  {viewingInstalacion.comentarios || 'Sin comentarios.'}
                </p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Instalaciones;
