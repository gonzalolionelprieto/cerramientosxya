import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Phone, Mail, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { useProveedores, useCreateProveedor, useUpdateProveedor } from '@/hooks/useProveedores';
import { usePedidosProveedor, useCreatePedidoProveedor, useUpdatePedidoProveedor } from '@/hooks/usePedidosProveedor';
import { usePedidos } from '@/hooks/usePedidos';
import { toast } from '@/hooks/use-toast';

const ProveedoresManager: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'proveedores' | 'pedidos'>('proveedores');
  const [isPedidoDialogOpen, setIsPedidoDialogOpen] = useState(false);
  
  const { data: proveedores = [], isLoading: loadingProveedores } = useProveedores();
  const { data: pedidosProveedor = [], isLoading: loadingPedidos } = usePedidosProveedor();
  const { data: pedidosCliente = [] } = usePedidos();
  const createProveedor = useCreateProveedor();
  const updateProveedor = useUpdateProveedor();
  const createPedidoProveedor = useCreatePedidoProveedor();
  const updatePedidoProveedor = useUpdatePedidoProveedor();

  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    especialidad: '',
    activo: true,
  });

  const [pedidoForm, setPedidoForm] = useState({
    proveedor_id: '',
    pedido_cliente_id: '',
    descripcion: '',
    cantidad: 1,
    precio: 0,
    fecha_entrega_estimada: '',
    numero_pedido: '',
    estado: 'solicitado' as const,
    fecha_entrega_real: null,
    notas: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProveedor.mutateAsync(formData);
      toast({
        title: "Proveedor creado",
        description: "El proveedor ha sido registrado exitosamente",
      });
      setFormData({
        nombre: '',
        contacto: '',
        telefono: '',
        email: '',
        direccion: '',
        especialidad: '',
        activo: true,
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el proveedor",
        variant: "destructive",
      });
    }
  };

  const handlePedidoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generate automatic numero_pedido if not provided
      const numeroBase = `PED-${Date.now().toString().slice(-6)}`;
      const pedidoData = {
        ...pedidoForm,
        numero_pedido: pedidoForm.numero_pedido || numeroBase,
        precio: pedidoForm.precio || null,
        cantidad: pedidoForm.cantidad || null,
        fecha_entrega_estimada: pedidoForm.fecha_entrega_estimada || null,
        pedido_cliente_id: pedidoForm.pedido_cliente_id || null,
      };
      
      await createPedidoProveedor.mutateAsync(pedidoData);
      toast({
        title: "Pedido enviado",
        description: "El pedido al proveedor ha sido enviado exitosamente",
      });
      setPedidoForm({
        proveedor_id: '',
        pedido_cliente_id: '',
        descripcion: '',
        cantidad: 1,
        precio: 0,
        fecha_entrega_estimada: '',
        numero_pedido: '',
        estado: 'solicitado',
        fecha_entrega_real: null,
        notas: '',
      });
      setIsPedidoDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el pedido",
        variant: "destructive",
      });
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'solicitado': return 'bg-yellow-100 text-yellow-800';
      case 'confirmado': return 'bg-blue-100 text-blue-800';
      case 'en-produccion': return 'bg-purple-100 text-purple-800';
      case 'listo': return 'bg-green-100 text-green-800';
      case 'entregado': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingProveedores || loadingPedidos) {
    return (
      <div className="p-6">
        <div className="text-center">Cargando información de proveedores...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Proveedores</h1>
        <p className="text-gray-600 mt-2">Administra proveedores y pedidos a fabricantes</p>
      </div>

      {/* Navegación por pestañas */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setSelectedTab('proveedores')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'proveedores'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Proveedores ({proveedores.length})
        </button>
        <button
          onClick={() => setSelectedTab('pedidos')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'pedidos'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Pedidos a Proveedores ({pedidosProveedor.length})
        </button>
      </div>

      {selectedTab === 'proveedores' ? (
        <div className="space-y-6">
          {/* Header con botón de crear */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Listado de Proveedores</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Proveedor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Proveedor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre de la empresa *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contacto">Persona de contacto</Label>
                    <Input
                      id="contacto"
                      value={formData.contacto}
                      onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Textarea
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <Input
                      id="especialidad"
                      value={formData.especialidad}
                      onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                      placeholder="Ej: Vidrios, Aluminio, Herrajes"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createProveedor.isPending}>
                    {createProveedor.isPending ? 'Creando...' : 'Crear Proveedor'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de proveedores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proveedores.map((proveedor) => (
              <Card key={proveedor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    {proveedor.nombre}
                  </CardTitle>
                  <Badge className={proveedor.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {proveedor.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  {proveedor.contacto && (
                    <p className="text-sm text-gray-600">
                      <strong>Contacto:</strong> {proveedor.contacto}
                    </p>
                  )}
                  {proveedor.telefono && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-3 h-3 mr-1" />
                      {proveedor.telefono}
                    </div>
                  )}
                  {proveedor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-3 h-3 mr-1" />
                      {proveedor.email}
                    </div>
                  )}
                  {proveedor.direccion && (
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1 mt-0.5" />
                      {proveedor.direccion}
                    </div>
                  )}
                  {proveedor.especialidad && (
                    <p className="text-sm">
                      <strong>Especialidad:</strong> {proveedor.especialidad}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header con botón de crear pedido */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pedidos a Proveedores</h2>
            <Dialog open={isPedidoDialogOpen} onOpenChange={setIsPedidoDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Package className="w-4 h-4 mr-2" />
                  Nuevo Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Crear Pedido a Proveedor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePedidoSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="proveedor">Proveedor *</Label>
                    <Select
                      value={pedidoForm.proveedor_id}
                      onValueChange={(value) => setPedidoForm({ ...pedidoForm, proveedor_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {proveedores.filter(p => p.activo).map((proveedor) => (
                          <SelectItem key={proveedor.id} value={proveedor.id}>
                            {proveedor.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pedido_cliente">Pedido de Cliente (opcional)</Label>
                    <Select
                      value={pedidoForm.pedido_cliente_id}
                      onValueChange={(value) => setPedidoForm({ ...pedidoForm, pedido_cliente_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar pedido" />
                      </SelectTrigger>
                      <SelectContent>
                        {pedidosCliente.map((pedido) => (
                          <SelectItem key={pedido.id} value={pedido.id}>
                            {pedido.numero_orden} - {pedido.clientes?.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <Textarea
                      id="descripcion"
                      value={pedidoForm.descripcion}
                      onChange={(e) => setPedidoForm({ ...pedidoForm, descripcion: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      value={pedidoForm.cantidad}
                      onChange={(e) => setPedidoForm({ ...pedidoForm, cantidad: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="precio">Precio estimado (€)</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={pedidoForm.precio}
                      onChange={(e) => setPedidoForm({ ...pedidoForm, precio: parseFloat(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha_entrega">Fecha entrega estimada</Label>
                    <Input
                      id="fecha_entrega"
                      type="date"
                      value={pedidoForm.fecha_entrega_estimada}
                      onChange={(e) => setPedidoForm({ ...pedidoForm, fecha_entrega_estimada: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createPedidoProveedor.isPending}>
                    {createPedidoProveedor.isPending ? 'Enviando...' : 'Enviar Pedido'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de pedidos */}
          <div className="space-y-4">
            {pedidosProveedor.map((pedido) => (
              <Card key={pedido.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{pedido.numero_pedido}</h3>
                        <Badge className={getEstadoColor(pedido.estado)}>
                          {pedido.estado}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Proveedor:</strong> {pedido.proveedores?.nombre}
                          </p>
                          <p className="text-sm">
                            <strong>Descripción:</strong> {pedido.descripcion}
                          </p>
                          <p className="text-sm">
                            <strong>Cantidad:</strong> {pedido.cantidad}
                          </p>
                          {pedido.precio && (
                            <p className="text-sm">
                              <strong>Precio:</strong> €{pedido.precio}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm">
                            <strong>Fecha pedido:</strong> {new Date(pedido.fecha_pedido).toLocaleDateString()}
                          </p>
                          {pedido.fecha_entrega_estimada && (
                            <p className="text-sm">
                              <strong>Entrega estimada:</strong> {new Date(pedido.fecha_entrega_estimada).toLocaleDateString()}
                            </p>
                          )}
                          {pedido.fecha_entrega_real && (
                            <p className="text-sm">
                              <strong>Entrega real:</strong> {new Date(pedido.fecha_entrega_real).toLocaleDateString()}
                            </p>
                          )}
                          {pedido.pedidos && (
                            <p className="text-sm">
                              <strong>Pedido cliente:</strong> {pedido.pedidos.numero_orden}
                            </p>
                          )}
                        </div>
                      </div>

                      {pedido.notas && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">
                            <strong>Notas:</strong> {pedido.notas}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 lg:w-40">
                      {pedido.estado === 'solicitado' && (
                        <Button size="sm" variant="outline" className="w-full">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirmar
                        </Button>
                      )}
                      {pedido.estado === 'listo' && (
                        <Button size="sm" className="w-full">
                          Marcar Entregado
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="w-full">
                        Editar
                      </Button>
                      {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
                        <Button size="sm" variant="outline" className="w-full text-red-600">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pedidosProveedor.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay pedidos a proveedores
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando un pedido a uno de tus proveedores
                </p>
                <Button onClick={() => setIsPedidoDialogOpen(true)}>
                  Crear Primer Pedido
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProveedoresManager;
