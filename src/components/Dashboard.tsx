
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Import Alert
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import Table
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Calendar, Package, Check, Users, AlertTriangle, Truck, ExternalLink } from 'lucide-react';
import {
  usePedidosPendientesCount,
  useInstalacionesHoyCount,
  useTrabajosCompletadosCount,
  useInstaladoresActivosCount,
} from '@/hooks/useDashboardCounts';
import { usePedidosRecientes, type PedidoReciente } from '@/hooks/usePedidosRecientes';
import { useInstalaciones, type InstalacionWithDetails } from '@/hooks/useInstalaciones';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom'; // For linking to order details

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateYYYYMMDD = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Define an interface for stat items to retain structure
interface StatItem {
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  data?: { count: number | null }; // Updated: data from hook is { count: ... }
  isLoading: boolean;
  isError: boolean;
}

const Dashboard: React.FC = () => {
  // Fetch data using hooks
  const { data: pedidosPendientesCount, isLoading: isLoadingPedidosPendientes, isError: isErrorPedidosPendientes } = usePedidosPendientesCount();
  const { data: instalacionesHoyCount, isLoading: isLoadingInstalacionesHoy, isError: isErrorInstalacionesHoy } = useInstalacionesHoyCount();
  const { data: trabajosCompletadosCount, isLoading: isLoadingTrabajosCompletados, isError: isErrorTrabajosCompletados } = useTrabajosCompletadosCount();
  const { data: instaladoresActivosCount, isLoading: isLoadingInstaladoresActivos, isError: isErrorInstaladoresActivos } = useInstaladoresActivosCount();

  const { data: pedidosRecientes, isLoading: isLoadingPedidosRecientes, isError: isErrorPedidosRecientes } = usePedidosRecientes();
  const today = getTodayDateYYYYMMDD();
  const { data: instalacionesDelDia, isLoading: isLoadingInstalacionesDelDia, isError: isErrorInstalacionesDelDia } = useInstalaciones(today);

  // Structure for summary cards, now including fetched data
  const stats: StatItem[] = [
    { title: 'Pedidos Pendientes', data: { count: pedidosPendientesCount }, isLoading: isLoadingPedidosPendientes, isError: isErrorPedidosPendientes, icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Instalaciones Hoy', data: { count: instalacionesHoyCount }, isLoading: isLoadingInstalacionesHoy, isError: isErrorInstalacionesHoy, icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Trabajos Completados', data: { count: trabajosCompletadosCount }, isLoading: isLoadingTrabajosCompletados, isError: isErrorTrabajosCompletados, icon: Check, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Instaladores Activos', data: { count: instaladoresActivosCount }, isLoading: isLoadingInstaladoresActivos, isError: isErrorInstaladoresActivos, icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  const getStatusBadgeVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
      case 'nuevo':
        return 'default'; // Blueish often
      case 'en_produccion':
      case 'en produccion':
      case 'en-proceso':
        return 'secondary'; // Greyish or yellowish
      case 'finalizado':
      case 'instalado':
        return 'outline'; // Often green like, or use a custom success variant if available
      case 'retrasado':
        return 'destructive'; // Red
      default:
        return 'outline';
    }
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A';
    try {
      // Assuming timeString is like "HH:mm:ss" or "HH:mm"
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch (e) {
      return timeString; // fallback
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
        <Badge variant="outline" className="text-sm hidden sm:block">
          Hoy: {format(new Date(), 'PPP', { locale: es })}
        </Badge>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          let displayValue: React.ReactNode;
          if (stat.isLoading) {
            displayValue = <Skeleton className="h-7 w-12 mt-1" />;
          } else if (stat.isError || typeof stat.data?.count !== 'number') {
            displayValue = <span className="text-red-500">-</span>;
          } else {
            displayValue = stat.data.count;
          }
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200 bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 sm:mt-2">{displayValue}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pedidos Recientes - Columna 1 */}
        <Card className="lg:col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-gray-700">
              <Package className="w-5 h-5 mr-2 text-primary" />
              Pedidos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPedidosRecientes ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : isErrorPedidosRecientes ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>No se pudieron cargar los pedidos.</AlertDescription>
              </Alert>
            ) : pedidosRecientes && pedidosRecientes.length > 0 ? (
              <div className="space-y-3">
                {pedidosRecientes.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{pedido.clientes?.nombre || 'Cliente Desconocido'}</p>
                      <p className="text-xs text-gray-500">{pedido.numero_orden} - {format(parseISO(pedido.fecha_pedido), 'dd MMM yyyy', { locale: es })}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(pedido.estado)} className="text-xs capitalize">
                      {pedido.estado?.replace(/_/g, ' ') || 'N/A'}
                    </Badge>
                  </div>
                ))}
                <Link to="/pedidos" className="text-sm text-primary hover:underline mt-2 block text-center">
                  Ver todos los pedidos <ExternalLink className="inline w-3 h-3 ml-1" />
                </Link>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4">No hay pedidos recientes.</div>

            )}
          </CardContent>
        </Card>

        {/* Instalaciones de Hoy - Columna 2 */}
        <Card className="lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-gray-700">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Instalaciones de Hoy ({instalacionesDelDia?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingInstalacionesDelDia ? (
              <Table>
                <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Hora</TableHead><TableHead>Instalador</TableHead></TableRow></TableHeader>
                <TableBody>{[...Array(3)].map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-5 w-full" /></TableCell><TableCell><Skeleton className="h-5 w-full" /></TableCell><TableCell><Skeleton className="h-5 w-full" /></TableCell></TableRow>))}</TableBody>
              </Table>
            ) : isErrorInstalacionesDelDia ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>No se pudieron cargar las instalaciones.</AlertDescription>
              </Alert>
            ) : instalacionesDelDia && instalacionesDelDia.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Cliente</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Dirección</TableHead>
                    <TableHead className="text-xs sm:text-sm">Hora</TableHead>
                    <TableHead className="text-xs sm:text-sm">Instalador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instalacionesDelDia.map((instalacion) => (
                    <TableRow key={instalacion.id}>
                      <TableCell className="font-medium text-gray-800 text-xs sm:text-sm">{instalacion.pedidos?.clientes?.nombre || 'N/A'}</TableCell>
                      <TableCell className="text-xs text-gray-600 hidden md:table-cell">{instalacion.pedidos?.clientes?.direccion || 'N/A'}</TableCell>
                      <TableCell className="text-xs text-gray-600">{formatTime(instalacion.hora_inicio)}</TableCell>
                      <TableCell className="text-xs text-gray-600">{instalacion.instaladores?.nombre || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No hay instalaciones programadas para hoy.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Notificaciones - Columna 1 de una nueva fila, o ajustar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center text-lg text-gray-700">
              <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
              Alertas y Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert variant="destructive" className="p-3">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="text-sm font-semibold">Retraso Materiales</AlertTitle>
                <AlertDescription className="text-xs">
                  3 pedidos con retraso en entrega de vidrios.
                </AlertDescription>
              </Alert>
              <Alert className="p-3">
                <Calendar className="h-4 w-4" />
                <AlertTitle className="text-sm font-semibold">Recordatorio Instalación</AlertTitle>
                <AlertDescription className="text-xs">
                  Instalación para "Cliente Ejemplo" mañana 08:00.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
        {/* Aquí se podrían añadir más cards si el layout lo requiere */}
      </div>
    </div>
  );
};

export default Dashboard;
