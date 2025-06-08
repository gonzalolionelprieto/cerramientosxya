
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Search, Filter, Calendar, User, MapPin } from 'lucide-react';
import { usePedidos, useUpdatePedido } from '@/hooks/usePedidos';
import { toast } from '@/hooks/use-toast';

const PedidosList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const { data: pedidos = [], isLoading } = usePedidos();
  const updatePedido = useUpdatePedido();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nuevo': return 'bg-blue-100 text-blue-800';
      case 'en-proceso': return 'bg-yellow-100 text-yellow-800';
      case 'fabricacion': return 'bg-orange-100 text-orange-800';
      case 'listo': return 'bg-purple-100 text-purple-800';
      case 'instalado': return 'bg-green-100 text-green-800';
      case 'completado': return 'bg-emerald-100 text-emerald-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'nuevo': return 'Nuevo';
      case 'en-proceso': return 'En Proceso';
      case 'fabricacion': return 'Fabricación';
      case 'listo': return 'Listo';
      case 'instalado': return 'Instalado';
      case 'completado': return 'Completado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const handleIniciarProceso = async (pedidoId: string) => {
    try {
      await updatePedido.mutateAsync({
        id: pedidoId,
        estado: 'en-proceso'
      });
      toast({
        title: "Proceso iniciado",
        description: "El pedido ha sido marcado como en proceso",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar el proceso",
        variant: "destructive",
      });
    }
  };

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.clientes?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pedido.numero_orden.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || pedido.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p className="text-gray-600 mt-2">Administre todos los pedidos de cerramientos</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente o número de pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="en-proceso">En Proceso</SelectItem>
                  <SelectItem value="fabricacion">Fabricación</SelectItem>
                  <SelectItem value="listo">Listo</SelectItem>
                  <SelectItem value="instalado">Instalado</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredPedidos.map((pedido) => (
          <Card key={pedido.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{pedido.numero_orden}</h3>
                    <Badge className={getStatusColor(pedido.estado)}>
                      {getStatusText(pedido.estado)}
                    </Badge>
                    {pedido.urgente && (
                      <Badge variant="destructive">URGENTE</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-medium">{pedido.clientes?.nombre || 'Cliente no disponible'}</span>
                        <span className="ml-2 text-sm">({pedido.clientes?.telefono})</span>
                      </div>
                      
                      <div className="flex items-start text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{pedido.clientes?.direccion}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Package className="w-4 h-4 mr-2" />
                        <span className="text-sm">{pedido.tipo_ventana}</span>
                        {pedido.medidas && (
                          <span className="ml-2 text-sm">({pedido.medidas})</span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Pedido: {new Date(pedido.fecha_pedido).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {pedido.fecha_entrega_estimada && (
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            Entrega: {new Date(pedido.fecha_entrega_estimada).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {pedido.precio && (
                        <div className="text-sm font-medium text-green-600">
                          Precio: {pedido.precio}€
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {pedido.comentarios && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Comentarios:</strong> {pedido.comentarios}
                      </p>
                    </div>
                  )}

                  {pedido.descripcion && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Descripción:</strong> {pedido.descripcion}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 lg:ml-4">
                  <Button size="sm" variant="outline">
                    Ver Detalles
                  </Button>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  {pedido.estado === 'nuevo' && (
                    <Button 
                      size="sm"
                      onClick={() => handleIniciarProceso(pedido.id)}
                      disabled={updatePedido.isPending}
                    >
                      Iniciar Proceso
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron pedidos</h3>
            <p className="text-gray-600">Intente ajustar los filtros de búsqueda</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PedidosList;
