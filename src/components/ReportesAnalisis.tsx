
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, DollarSign, Clock, Users, Package, Truck, 
  Calendar, Download, Filter, BarChart3 
} from 'lucide-react';
import { usePedidos } from '@/hooks/usePedidos';
import { useInstalaciones } from '@/hooks/useInstalaciones';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useInstaladores } from '@/hooks/useInstaladores';

const ReportesAnalisis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [selectedChart, setSelectedChart] = useState('ventas');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: pedidos = [] } = usePedidos();
  const { data: instalaciones = [] } = useInstalaciones();
  const { data: vehiculos = [] } = useVehiculos();
  const { data: instaladores = [] } = useInstaladores();

  // Cálculos para métricas
  const totalVentas = pedidos.reduce((sum, pedido) => sum + (pedido.precio || 0), 0);
  const pedidosCompletados = pedidos.filter(p => p.estado === 'completado').length;
  const instalacionesCompletadas = instalaciones.filter(i => i.estado === 'completada').length;
  const vehiculosActivos = vehiculos.filter(v => v.estado === 'disponible' || v.estado === 'en-ruta').length;

  // Datos para gráficos
  const ventasPorMes = [
    { mes: 'Ene', ventas: 4500, pedidos: 12 },
    { mes: 'Feb', ventas: 5200, pedidos: 15 },
    { mes: 'Mar', ventas: 4800, pedidos: 13 },
    { mes: 'Abr', ventas: 6100, pedidos: 18 },
    { mes: 'May', ventas: 5900, pedidos: 16 },
    { mes: 'Jun', ventas: 7200, pedidos: 22 },
  ];

  const instalacionesPorInstalador = instaladores.map(instalador => ({
    nombre: instalador.nombre,
    completadas: instalaciones.filter(i => i.instalador_id === instalador.id && i.estado === 'completada').length,
    pendientes: instalaciones.filter(i => i.instalador_id === instalador.id && i.estado !== 'completada').length,
  }));

  const distribucionPedidos = [
    { name: 'Completados', value: pedidosCompletados, color: '#10B981' },
    { name: 'En proceso', value: pedidos.filter(p => p.estado === 'en-proceso').length, color: '#F59E0B' },
    { name: 'Nuevos', value: pedidos.filter(p => p.estado === 'nuevo').length, color: '#3B82F6' },
    { name: 'Cancelados', value: pedidos.filter(p => p.estado === 'cancelado').length, color: '#EF4444' },
  ];

  const tiempoPromedioInstalacion = instalaciones
    .filter(i => i.hora_inicio && i.hora_fin)
    .reduce((acc, instalacion) => {
      const inicio = new Date(`2024-01-01 ${instalacion.hora_inicio}`);
      const fin = new Date(`2024-01-01 ${instalacion.hora_fin}`);
      return acc + (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
    }, 0) / instalaciones.filter(i => i.hora_inicio && i.hora_fin).length || 0;

  const renderChart = () => {
    switch (selectedChart) {
      case 'ventas':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ventasPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'instalaciones':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={instalacionesPorInstalador}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completadas" fill="#10B981" />
              <Bar dataKey="pendientes" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'distribucion':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionPedidos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distribucionPedidos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
        <p className="text-gray-600 mt-2">Análisis de rendimiento y métricas del negocio</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros de Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mes</SelectItem>
                  <SelectItem value="trimestre">Este trimestre</SelectItem>
                  <SelectItem value="año">Este año</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedPeriod === 'personalizado' && (
              <>
                <div>
                  <Label>Desde</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Hasta</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <div className="flex items-end">
              <Button className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
                <p className="text-2xl font-bold">€{totalVentas.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% vs mes anterior
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pedidos Completados</p>
                <p className="text-2xl font-bold">{pedidosCompletados}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Package className="w-3 h-3 mr-1" />
                  {pedidos.length} total
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Instalaciones</p>
                <p className="text-2xl font-bold">{instalacionesCompletadas}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {tiempoPromedioInstalacion.toFixed(1)}h promedio
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vehículos Activos</p>
                <p className="text-2xl font-bold">{vehiculosActivos}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Truck className="w-3 h-3 mr-1" />
                  {vehiculos.length} total
                </p>
              </div>
              <Truck className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Análisis Visual
              </span>
              <Select value={selectedChart} onValueChange={setSelectedChart}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ventas">Ventas por Mes</SelectItem>
                  <SelectItem value="instalaciones">Instalaciones por Técnico</SelectItem>
                  <SelectItem value="distribucion">Distribución de Pedidos</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderChart()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Instalaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instalaciones
                .filter(i => i.estado === 'programada')
                .slice(0, 5)
                .map((instalacion) => (
                  <div key={instalacion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{instalacion.codigo}</p>
                      <p className="text-sm text-gray-600">
                        {instalacion.fecha} • {instalacion.hora_inicio}
                      </p>
                      <p className="text-sm text-gray-500">
                        {instalacion.instaladores?.nombre}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {instalacion.estado}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento de Instaladores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Instalador</th>
                  <th className="text-left p-2">Instalaciones Completadas</th>
                  <th className="text-left p-2">Instalaciones Pendientes</th>
                  <th className="text-left p-2">Tiempo Promedio</th>
                  <th className="text-left p-2">Calificación</th>
                </tr>
              </thead>
              <tbody>
                {instalacionesPorInstalador.map((instalador, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{instalador.nombre}</td>
                    <td className="p-2">{instalador.completadas}</td>
                    <td className="p-2">{instalador.pendientes}</td>
                    <td className="p-2">2.5h</td>
                    <td className="p-2">
                      <Badge className="bg-green-100 text-green-800">Excelente</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportesAnalisis;
