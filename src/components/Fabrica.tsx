import React, { useState, useMemo } from 'react';
import { useProductosEnFabricacion, useMarkAsFinalizado } from '@/hooks/useProductosEnFabricacion'; // Import useMarkAsFinalizado
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Import Button
import { toast } from 'sonner'; // Import toast
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Import Select components
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'; // Import Dialog components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // For error state
import { Badge } from '@/components/ui/badge'; // Import Badge
import { ServerCrash } from 'lucide-react'; // Icon for error state
import { isBefore, isToday, addDays, parseISO, format as formatDateFns } from 'date-fns';
import { es } from 'date-fns/locale';

// Mocked user role as per subtask instructions
const currentUserRole = 'admin'; // or 'fabrica'
// const currentUserRole = 'viewer'; // Example for testing disabled button

const Fabrica: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedProductForModal, setSelectedProductForModal] = useState<any | null>(null); // Using 'any' for now, should be ProductoEnFabricacion
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: productos, isLoading, isError, error: queryError } = useProductosEnFabricacion({
    searchTerm,
    filterStatus: selectedStatus,
  });

  const markAsFinalizadoMutation = useMarkAsFinalizado();

  const handleMarkAsFinalizado = async (productId: string) => {
    try {
      await markAsFinalizadoMutation.mutateAsync(productId);
      toast.success('Producto marcado como finalizado exitosamente.');
    } catch (err) {
      toast.error('Error al marcar como finalizado.', {
        description: (err as Error)?.message || 'Ocurrió un error desconocido.',
      });
    }
  };

  const canManageProducts = currentUserRole === 'admin' || currentUserRole === 'fabrica';

  // Memoize the calculation of unique statuses
  const uniqueStatuses = useMemo(() => {
    if (!productos) return ['Todos'];
    const statuses = new Set(productos.map(p => p.estado).filter(Boolean) as string[]);
    return ['Todos', ...Array.from(statuses)];
  }, [productos]);

  // Calculate summaries
  const summaries = useMemo(() => {
    if (!productos) {
      return { enProduccion: 0, finalizado: 0, totalEnVista: 0 };
    }
    const enProduccion = productos.filter(p => p.estado?.toLowerCase() === 'en_produccion' || p.estado?.toLowerCase() === 'en produccion').length;
    const finalizado = productos.filter(p => p.estado?.toLowerCase() === 'finalizado').length;
    return {
      enProduccion,
      finalizado,
      totalEnVista: productos.length,
    };
  }, [productos]);

  const getStatusBadge = (status: string | null) => {
    if (!status) {
      return <Badge variant="outline">Desconocido</Badge>;
    }

    switch (status.toLowerCase()) {
      case 'en_produccion':
      case 'en produccion':
        return <Badge variant="default">En Producción</Badge>;
      case 'finalizado':
        return <Badge variant="secondary">Finalizado</Badge>; // Using secondary as a placeholder for green
      case 'retrasado':
        return <Badge variant="destructive">Retrasado</Badge>;
      case 'pendiente':
        return <Badge variant="outline">Pendiente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Simplified date formatter for the modal (no warning logic needed here)
  const formatModalDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return formatDateFns(date, 'PPP p', { locale: es }); // e.g., "1 de enero de 2024, 14:30"
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const handleRowClick = (producto: any) => { // Should be ProductoEnFabricacion
    setSelectedProductForModal(producto);
    setIsModalOpen(true);
  };

  const getFormattedDateWithWarning = (dateString: string | null, status: string | null) => {
    if (!dateString) return { text: 'N/A', warning: false };
    try {
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) {
        return { text: 'Fecha inválida', warning: false };
      }

      const formattedDate = formatDateFns(date, 'PPP', { locale: es });

      let needsWarning = false;
      if (status !== 'finalizado') {
        const today = new Date();
        const threeDaysFromNow = addDays(today, 3);
        if (isToday(date) || (isBefore(date, threeDaysFromNow) && !isBefore(date, today))) {
           needsWarning = true;
        }
        if (isBefore(date, today) && !isToday(date)) {
            needsWarning = true;
        }
      }

      return { text: formattedDate, warning: needsWarning };
    } catch (e) {
      console.error("Error processing date:", e);
      return { text: 'Fecha inválida', warning: false };
    }
  };

  // Early return for loading and error states to simplify main return structure
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productos en Fabricación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Productos en Fabricación</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ServerCrash className="h-4 w-4" />
            <AlertTitle>Error al Cargar Datos</AlertTitle>
            <AlertDescription>
              No se pudieron cargar los productos en fabricación. Inténtalo de nuevo más tarde.
              {error && <p className="mt-2 text-xs">Detalle: {error.message}</p>}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show message if no products match filters, but not if still loading or error
  const showNoResultsMessage = !isLoading && !isError && (!productos || productos.length === 0);

  // Define labels for product details in modal
  const productDetailLabels: Record<string, string> = {
    id: "ID del Producto",
    nombre_producto: "Nombre del Producto",
    estado: "Estado",
    cantidad: "Cantidad",
    fecha_estimada_finalizacion: "Fecha Estimada de Finalización",
    fecha_real_finalizacion: "Fecha Real de Finalización",
    created_at: "Fecha de Creación",
    updated_at: "Última Actualización",
  };

  return (
    <> {/* Use Fragment to wrap page content and modal */}
    <Card>
      <CardHeader>
        <CardTitle>Productos en Fabricación</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Indicators */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total en Producción</CardTitle>
              {/* Placeholder icon, replace with actual icon if desired */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H9.5a2 2 0 0 1-2-2V9.5A2.5 2.5 0 0 1 10 7h3.5a2 2 0 0 1 2 2v1"></path></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-1/2" /> : summaries.enProduccion}</div>
              {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Finalizados</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-1/2" /> : summaries.finalizado}</div>
              {/* <p className="text-xs text-muted-foreground">+180.1% from last month</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total en Vista</CardTitle>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-1/2" /> : summaries.totalEnVista}</div>
              {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto sm:flex-grow"
          />
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === 'Todos' ? 'Todos los Estados' : getStatusBadge(status) || status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Handle loading, error, and no results states specifically for the table area */}
        {isLoading && (
           <div className="space-y-4">
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
           </div>
        )}
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <ServerCrash className="h-4 w-4" />
            <AlertTitle>Error al Cargar Datos</AlertTitle>
            <AlertDescription>
              No se pudieron cargar los productos. Inténtalo de nuevo más tarde.
              {queryError && <p className="mt-2 text-xs">Detalle: {queryError.message}</p>}
            </AlertDescription>
          </Alert>
        )}
        {showNoResultsMessage && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">No se encontraron productos que coincidan con la búsqueda o filtro.</p>
          </div>
        )}

        {!isLoading && !isError && productos && productos.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre del Producto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Fecha Estimada de Finalización</TableHead>
                {canManageProducts && <TableHead>Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((producto) => {
                const { text: formattedDate, warning: needsWarning } = getFormattedDateWithWarning(
                  producto.fecha_estimada_finalizacion,
                  producto.estado
                );
                const isFinalizado = producto.estado === 'finalizado';
                return (
                  <TableRow key={producto.id} onClick={() => handleRowClick(producto)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>{producto.nombre_producto}</TableCell>
                    <TableCell>{getStatusBadge(producto.estado)}</TableCell>
                    <TableCell className="text-right">{producto.cantidad}</TableCell>
                    <TableCell className={needsWarning ? 'text-yellow-600 font-semibold' : ''}>
                      {formattedDate}
                    </TableCell>
                    {canManageProducts && (
                      <TableCell>
                        {!isFinalizado && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsFinalizado(producto.id)}
                            disabled={markAsFinalizadoMutation.isPending && markAsFinalizadoMutation.variables === producto.id}
                          >
                            {markAsFinalizadoMutation.isPending && markAsFinalizadoMutation.variables === producto.id
                              ? 'Marcando...'
                              : 'Marcar como Finalizado'}
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>

    {/* Product Details Modal */}
    {selectedProductForModal && (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.entries(selectedProductForModal).map(([key, value]) => {
              const label = productDetailLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              let displayValue: React.ReactNode = String(value ?? 'N/A');

              if (key === 'estado' && typeof value === 'string') {
                displayValue = getStatusBadge(value);
              } else if (key.includes('fecha') || key.endsWith('_at')) {
                displayValue = formatModalDate(value as string | null);
              }

              // Skip showing undefined or null values if desired, or just show N/A as handled by formatters
              if (value === null || value === undefined) displayValue = <span className="text-muted-foreground">N/A</span>;

              return (
                <div key={key} className="grid grid-cols-2 items-center gap-x-4">
                  <span className="font-semibold text-sm text-muted-foreground">{label}:</span>
                  <span className="text-sm">{displayValue}</span>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
};

export default Fabrica;
