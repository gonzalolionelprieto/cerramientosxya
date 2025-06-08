
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Added Alert imports
import { Truck, MapPin, Clock, Wrench, User, Navigation, AlertCircle, Edit3 } from 'lucide-react';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useHerramientas } from '@/hooks/useHerramientas';
import { useInstalacionesLogistica, InstalacionLogisticaDetalles } from '@/hooks/useInstalacionesLogistica';
import { toast } from 'sonner';
import AsignarVehiculoModal from './AsignarVehiculoModal';
import EditInstalacionModal from './EditInstalacionModal'; // Import the EditInstalacionModal
import { useQueryClient } from '@tanstack/react-query';

const Logistica: React.FC = () => {
  const { data: vehiculos = [], isLoading: loadingVehiculos } = useVehiculos();
  const { data: herramientas = [], isLoading: loadingHerramientas } = useHerramientas();
  const { data: instalaciones = [], isLoading: loadingInstalaciones, isError: isErrorInstalaciones, error: errorInstalaciones } = useInstalacionesLogistica();
  const queryClient = useQueryClient();

  console.log('Logistica.tsx render cycle:', {
    loadingInstalaciones,
    isErrorInstalaciones,
    errorInstalaciones,
    instalacionesLength: instalaciones?.length
  });


  const [instalacionParaAsignarVehiculo, setInstalacionParaAsignarVehiculo] = useState<InstalacionLogisticaDetalles | null>(null);
  const [isAsignarVehiculoModalOpen, setIsAsignarVehiculoModalOpen] = useState(false);

  const [instalacionParaEditarLogistica, setInstalacionParaEditarLogistica] = useState<InstalacionLogisticaDetalles | null>(null);
  const [isEditModalLogisticaOpen, setIsEditModalLogisticaOpen] = useState(false);


  const handleOpenAsignarVehiculoModal = (instalacion: InstalacionLogisticaDetalles) => {
    setInstalacionParaAsignarVehiculo(instalacion);
    setIsAsignarVehiculoModalOpen(true);
  };

  const handleCloseAsignarVehiculoModal = () => {
    setInstalacionParaAsignarVehiculo(null);
    setIsAsignarVehiculoModalOpen(false);
  };

  const handleVehiculoAsignado = () => {
    queryClient.invalidateQueries({ queryKey: ['instalacionesLogistica'] });
  };

  const handleOpenEditModalLogistica = (instalacion: InstalacionLogisticaDetalles) => {
    setInstalacionParaEditarLogistica(instalacion);
    setIsEditModalLogisticaOpen(true);
  };

  const handleCloseEditModalLogistica = () => {
    setInstalacionParaEditarLogistica(null);
    setIsEditModalLogisticaOpen(false);
  };

  const handleInstalacionEditadaDesdeLogistica = () => {
    queryClient.invalidateQueries({ queryKey: ['instalacionesLogistica'] });
  };

  const handleVerRuta = (direccion: string | null | undefined) => {
    if (direccion) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccion)}`;
      window.open(url, '_blank');
    } else {
      toast.warning("Dirección del cliente no disponible.", {
        description: "No se puede mostrar la ruta sin una dirección.",
      });
    }
  };

  const getVehiculoStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'en-ruta': return 'bg-blue-100 text-blue-800';
      case 'mantenimiento': return 'bg-red-100 text-red-800';
      case 'fuera-servicio': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Combined loading for non-critical parts like side panels
  const generalInfoLoading = loadingVehiculos || loadingHerramientas;

  // Main content loading and error state for installations list
  if (loadingInstalaciones) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión Logística</h1>
          <p className="text-gray-600 mt-2">
            Control de vehículos, rutas e instalaciones programadas (a partir de hoy).
          </p>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Instalaciones Programadas</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isErrorInstalaciones) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al Cargar Instalaciones</AlertTitle>
          <AlertDescription>
            No se pudieron cargar las instalaciones programadas. Intente de nuevo más tarde.
            {errorInstalaciones && <p className="mt-2 text-xs">Detalle: {errorInstalaciones.message}</p>}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calcular métricas del día
  const instalacionesTotal = instalaciones.length;
  const vehiculosEnUso = vehiculos.filter(v => v.estado === 'en-ruta').length;

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión Logística</h1>
        <p className="text-gray-600 mt-2">
          Control de vehículos, rutas e instalaciones programadas (a partir de hoy).
        </p>
      </div>

      {/* Date selector removed, as useInstalacionesLogistica fetches from today onwards */}
      {/* <Card> ... </Card> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Vehículos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Estado de Vehículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehiculos.map((vehiculo) => (
                <div key={vehiculo.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{vehiculo.matricula}</span>
                    <Badge className={getVehiculoStatusColor(vehiculo.estado)}>
                      {vehiculo.estado}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{vehiculo.tipo} {vehiculo.modelo}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <User className="w-3 h-3 mr-1" />
                    <span>{vehiculo.instaladores?.nombre || 'Sin conductor'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{vehiculo.ubicacion_actual || 'Ubicación no disponible'}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Panel de Herramientas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Control de Herramientas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {herramientas.map((herramienta) => (
                <div key={herramienta.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm">{herramienta.nombre}</span>
                    {herramienta.cantidad_disponible === 0 && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Disponibles: {herramienta.cantidad_disponible}</span>
                    <span>Total: {herramienta.cantidad_total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ 
                        width: `${herramienta.cantidad_total > 0 ? 
                          ((herramienta.cantidad_total - herramienta.cantidad_disponible) / herramienta.cantidad_total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  {herramienta.categoria && (
                    <p className="text-xs text-gray-500 mt-1">{herramienta.categoria}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resumen del Día */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Resumen del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{instalacionesTotal}</p>
                  <p className="text-sm text-blue-800">Instalaciones</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{vehiculosEnUso}</p>
                  <p className="text-sm text-green-800">Vehículos en Uso</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Estados de vehículos:</h4>
                {vehiculos.map((vehiculo) => (
                  <div key={vehiculo.id} className="flex items-center justify-between text-sm">
                    <span>{vehiculo.matricula}</span>
                    <Badge variant="outline" className={getVehiculoStatusColor(vehiculo.estado)}>
                      {vehiculo.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instalaciones del Día */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Instalaciones Programadas</h2>
        
        {instalaciones.length === 0 && !loadingInstalaciones && ( // Ensure not to show "no data" during initial load
           <Card>
             <CardContent className="p-8 text-center">
               <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">
                 No hay instalaciones programadas que cumplan los criterios
               </h3>
               <p className="text-gray-600 mb-4">
                 (Estado: Programada, Fecha: Desde Hoy)
               </p>
             </CardContent>
           </Card>
        )}

        {instalaciones.map((instalacion) => (
          <Card key={instalacion.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{instalacion.codigo}</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        {instalacion.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>👤 {instalacion.instaladores?.nombre || 'Sin asignar'}</span>
                      <span>🕐 {instalacion.hora_inicio} - {instalacion.hora_fin}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Información del Cliente:</h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Cliente:</strong> {instalacion.pedidos?.clientes?.nombre}
                        </p>
                        <p className="text-sm">
                          <strong>Teléfono:</strong> {instalacion.pedidos?.clientes?.telefono}
                        </p>
                        <p className="text-sm">
                          <strong>Dirección:</strong> {instalacion.pedidos?.clientes?.direccion}
                        </p>
                        <p className="text-sm">
                          <strong>Tipo:</strong> {instalacion.pedidos?.tipo_ventana}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Herramientas requeridas:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {instalacion.herramientas_requeridas?.map((herramienta, index) => (
                          <Badge key={index} variant="outline" className="text-xs justify-center">
                            {herramienta}
                          </Badge>
                        )) || <p className="text-sm text-gray-500">No especificadas</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:w-40">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleVerRuta(instalacion.pedidos?.clientes?.direccion)}
                    disabled={!instalacion.pedidos?.clientes?.direccion}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Ver Ruta
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOpenAsignarVehiculoModal(instalacion)}
                    disabled={!!instalacion.vehiculo_id || !!instalacion.vehiculos} // Disable if already assigned
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    {instalacion.vehiculo_id || instalacion.vehiculos ? 'Vehículo Asignado' : 'Asignar Vehículo'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOpenEditModalLogistica(instalacion)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* The redundant empty state block that was here has been removed.
          The primary empty state check is now handled before the map operation. */}
    </div>
  );
};

export default Logistica;
