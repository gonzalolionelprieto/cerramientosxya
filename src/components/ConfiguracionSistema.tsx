
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, Bell, Shield, Database, Mail, Smartphone, 
  Clock, MapPin, DollarSign, FileText, Users, Save 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ConfiguracionSistema: React.FC = () => {
  const [configuracion, setConfiguracion] = useState({
    // Configuración general
    nombreEmpresa: 'Cerramientos XyA',
    direccionEmpresa: 'Calle Principal 123, Madrid',
    telefonoEmpresa: '+34 900 123 456',
    emailEmpresa: 'info@cerramientosxya.com',
    sitioWeb: 'www.cerramientosxya.com',
    
    // Configuración de notificaciones
    notificacionesPush: true,
    notificacionesEmail: true,
    notificacionesSMS: false,
    recordatoriosInstalacion: true,
    alertasInventario: true,
    
    // Configuración de horarios
    horarioApertura: '08:00',
    horarioCierre: '18:00',
    diasLaborales: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
    
    // Configuración de precios y moneda
    moneda: 'EUR',
    iva: 21,
    descuentoMaximo: 15,
    
    // Configuración de logística
    tiempoInstalacionPromedio: 120, // minutos
    radioCobertura: 50, // km
    capacidadMaximaVehiculo: 10,
    
    // Configuración de seguridad
    autenticacionDosFactor: false,
    tiempoSesion: 480, // minutos
    copiasSeguridadAutomaticas: true,
    
    // Configuración de reportes
    frecuenciaReportes: 'semanal',
    formatoReportes: 'PDF',
    destinatarioReportes: 'gerencia@cerramientosxya.com',
  });

  const handleSave = async () => {
    try {
      // Aquí guardarías la configuración en la base de datos
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      });
    }
  };

  const updateConfig = (key: string, value: any) => {
    setConfiguracion(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-2">Personaliza el comportamiento y apariencia del sistema</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Horarios
          </TabsTrigger>
          <TabsTrigger value="logistica" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Logística
          </TabsTrigger>
          <TabsTrigger value="seguridad" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="reportes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombreEmpresa">Nombre de la empresa</Label>
                  <Input
                    id="nombreEmpresa"
                    value={configuracion.nombreEmpresa}
                    onChange={(e) => updateConfig('nombreEmpresa', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="telefonoEmpresa">Teléfono</Label>
                  <Input
                    id="telefonoEmpresa"
                    value={configuracion.telefonoEmpresa}
                    onChange={(e) => updateConfig('telefonoEmpresa', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="direccionEmpresa">Dirección</Label>
                <Textarea
                  id="direccionEmpresa"
                  value={configuracion.direccionEmpresa}
                  onChange={(e) => updateConfig('direccionEmpresa', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailEmpresa">Email</Label>
                  <Input
                    id="emailEmpresa"
                    type="email"
                    value={configuracion.emailEmpresa}
                    onChange={(e) => updateConfig('emailEmpresa', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sitioWeb">Sitio web</Label>
                  <Input
                    id="sitioWeb"
                    value={configuracion.sitioWeb}
                    onChange={(e) => updateConfig('sitioWeb', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Configuración Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="moneda">Moneda</Label>
                  <Select value={configuracion.moneda} onValueChange={(value) => updateConfig('moneda', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="GBP">Libra (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="iva">IVA (%)</Label>
                  <Input
                    id="iva"
                    type="number"
                    value={configuracion.iva}
                    onChange={(e) => updateConfig('iva', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="descuentoMaximo">Descuento máximo (%)</Label>
                  <Input
                    id="descuentoMaximo"
                    type="number"
                    value={configuracion.descuentoMaximo}
                    onChange={(e) => updateConfig('descuentoMaximo', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Preferencias de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Canales de notificación</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4" />
                      <Label htmlFor="push">Notificaciones push</Label>
                    </div>
                    <Switch
                      id="push"
                      checked={configuracion.notificacionesPush}
                      onCheckedChange={(checked) => updateConfig('notificacionesPush', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <Label htmlFor="email">Notificaciones por email</Label>
                    </div>
                    <Switch
                      id="email"
                      checked={configuracion.notificacionesEmail}
                      onCheckedChange={(checked) => updateConfig('notificacionesEmail', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4" />
                      <Label htmlFor="sms">Notificaciones SMS</Label>
                    </div>
                    <Switch
                      id="sms"
                      checked={configuracion.notificacionesSMS}
                      onCheckedChange={(checked) => updateConfig('notificacionesSMS', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Tipos de alertas</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recordatorios">Recordatorios de instalación</Label>
                    <Switch
                      id="recordatorios"
                      checked={configuracion.recordatoriosInstalacion}
                      onCheckedChange={(checked) => updateConfig('recordatoriosInstalacion', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inventario">Alertas de inventario bajo</Label>
                    <Switch
                      id="inventario"
                      checked={configuracion.alertasInventario}
                      onCheckedChange={(checked) => updateConfig('alertasInventario', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Configuración de Horarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apertura">Hora de apertura</Label>
                  <Input
                    id="apertura"
                    type="time"
                    value={configuracion.horarioApertura}
                    onChange={(e) => updateConfig('horarioApertura', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cierre">Hora de cierre</Label>
                  <Input
                    id="cierre"
                    type="time"
                    value={configuracion.horarioCierre}
                    onChange={(e) => updateConfig('horarioCierre', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label>Días laborales</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map((dia) => (
                    <Badge
                      key={dia}
                      variant={configuracion.diasLaborales.includes(dia) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const nuevos = configuracion.diasLaborales.includes(dia)
                          ? configuracion.diasLaborales.filter(d => d !== dia)
                          : [...configuracion.diasLaborales, dia];
                        updateConfig('diasLaborales', nuevos);
                      }}
                    >
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logistica" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Configuración Logística
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tiempoInstalacion">Tiempo promedio instalación (min)</Label>
                  <Input
                    id="tiempoInstalacion"
                    type="number"
                    value={configuracion.tiempoInstalacionPromedio}
                    onChange={(e) => updateConfig('tiempoInstalacionPromedio', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="radioCobertura">Radio de cobertura (km)</Label>
                  <Input
                    id="radioCobertura"
                    type="number"
                    value={configuracion.radioCobertura}
                    onChange={(e) => updateConfig('radioCobertura', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="capacidadVehiculo">Capacidad máxima por vehículo</Label>
                  <Input
                    id="capacidadVehiculo"
                    type="number"
                    value={configuracion.capacidadMaximaVehiculo}
                    onChange={(e) => updateConfig('capacidadMaximaVehiculo', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Configuración de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa">Autenticación de dos factores</Label>
                    <p className="text-sm text-gray-500">Añade una capa extra de seguridad</p>
                  </div>
                  <Switch
                    id="2fa"
                    checked={configuracion.autenticacionDosFactor}
                    onCheckedChange={(checked) => updateConfig('autenticacionDosFactor', checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tiempoSesion">Tiempo de sesión (minutos)</Label>
                  <Input
                    id="tiempoSesion"
                    type="number"
                    value={configuracion.tiempoSesion}
                    onChange={(e) => updateConfig('tiempoSesion', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="backups">Copias de seguridad automáticas</Label>
                    <p className="text-sm text-gray-500">Realiza backups diarios automáticamente</p>
                  </div>
                  <Switch
                    id="backups"
                    checked={configuracion.copiasSeguridadAutomaticas}
                    onCheckedChange={(checked) => updateConfig('copiasSeguridadAutomaticas', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Configuración de Reportes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frecuencia">Frecuencia de reportes</Label>
                  <Select value={configuracion.frecuenciaReportes} onValueChange={(value) => updateConfig('frecuenciaReportes', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diario</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="formato">Formato de reportes</Label>
                  <Select value={configuracion.formatoReportes} onValueChange={(value) => updateConfig('formatoReportes', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="destinatario">Email destinatario de reportes</Label>
                <Input
                  id="destinatario"
                  type="email"
                  value={configuracion.destinatarioReportes}
                  onChange={(e) => updateConfig('destinatarioReportes', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botón de guardar flotante */}
      <div className="fixed bottom-6 right-6">
        <Button onClick={handleSave} size="lg" className="shadow-lg">
          <Save className="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
};

export default ConfiguracionSistema;
