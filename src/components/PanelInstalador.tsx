
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin, Clock, Wrench, Download, CheckCircle, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useInstalaciones, useUpdateInstalacion } from '@/hooks/useInstalaciones';

const PanelInstalador: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [instaladorActual, setInstaladorActual] = useState('');
  const [instaladorId, setInstaladorId] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const { data: instalacionesHoy = [] } = useInstalaciones(today);
  const updateInstalacion = useUpdateInstalacion();

  // Filtrar instalaciones del instalador actual
  const misInstalaciones = instalacionesHoy.filter(
    instalacion => instalacion.instaladores?.usuario === usuario
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Buscar el instalador en las instalaciones existentes
    const instaladorEncontrado = instalacionesHoy.find(
      inst => inst.instaladores?.usuario === usuario
    );

    if (instaladorEncontrado && password === '123456') {
      setIsLoggedIn(true);
      setInstaladorActual(instaladorEncontrado.instaladores?.nombre || '');
      setInstaladorId(instaladorEncontrado.instaladores?.id || '');
      toast({
        title: "Acceso concedido",
        description: `Bienvenido ${instaladorEncontrado.instaladores?.nombre}`,
      });
    } else {
      toast({
        title: "Error de acceso",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      });
    }
  };

  const marcarIniciado = async (instalacionId: string) => {
    try {
      await updateInstalacion.mutateAsync({
        id: instalacionId,
        estado: 'en-curso'
      });
      toast({
        title: "Instalación iniciada",
        description: `Se ha marcado la instalación como iniciada`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar la instalación",
        variant: "destructive",
      });
    }
  };

  const marcarCompletado = async (instalacionId: string) => {
    try {
      await updateInstalacion.mutateAsync({
        id: instalacionId,
        estado: 'completada'
      });
      toast({
        title: "Instalación completada",
        description: `Se ha marcado la instalación como completada`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la instalación",
        variant: "destructive",
      });
    }
  };

  const descargarPlano = (instalacionId: string) => {
    toast({
      title: "Descargando plano",
      description: `Iniciando descarga del plano para ${instalacionId}`,
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Panel del Instalador</CardTitle>
            <p className="text-gray-600">Acceda con sus credenciales</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Acceder
              </Button>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>Usuarios disponibles: pedro.ruiz, miguel.sanz, david.gil</p>
                <p>Contraseña: 123456</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel del Instalador</h1>
          <p className="text-gray-600 mt-2">Bienvenido, {instaladorActual}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLoggedIn(false)}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Resumen del día */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{misInstalaciones.length}</p>
              <p className="text-sm text-blue-800">Instalaciones Asignadas</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {misInstalaciones.filter(i => i.estado === 'programada').length}
              </p>
              <p className="text-sm text-yellow-800">Pendientes</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {misInstalaciones.filter(i => i.estado === 'completada').length}
              </p>
              <p className="text-sm text-green-800">Completadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de instalaciones */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Mis Instalaciones de Hoy</h2>
        
        {misInstalaciones.map((instalacion) => (
          <Card key={instalacion.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{instalacion.codigo}</h3>
                      <Badge variant="outline">{instalacion.pedidos?.numero_orden}</Badge>
                      <Badge className={
                        instalacion.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                        instalacion.estado === 'en-curso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {instalacion.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center text-primary-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="font-medium">{instalacion.hora_inicio} - {instalacion.hora_fin}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <User className="w-4 h-4 mr-2" />
                        <span className="font-medium">{instalacion.pedidos?.clientes?.nombre}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm">{instalacion.pedidos?.clientes?.telefono}</span>
                      </div>
                      
                      <div className="flex items-start text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{instalacion.pedidos?.clientes?.direccion}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Tipo:</span>
                        <span className="ml-2">{instalacion.pedidos?.tipo_ventana}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Medidas:</span>
                        <span className="ml-2">{instalacion.pedidos?.medidas || 'No especificadas'}</span>
                      </div>

                      {instalacion.pedidos?.color && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Color:</span>
                          <span className="ml-2">{instalacion.pedidos.color}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Descripción del trabajo */}
                  {(instalacion.pedidos?.descripcion || instalacion.comentarios) && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700 mb-2">Descripción del trabajo:</h4>
                      {instalacion.pedidos?.descripcion && (
                        <p className="text-sm text-gray-700 mb-2">{instalacion.pedidos.descripcion}</p>
                      )}
                      {instalacion.comentarios && (
                        <p className="text-sm text-orange-700">
                          <strong>⚠️ Nota importante:</strong> {instalacion.comentarios}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Herramientas sugeridas */}
                  {instalacion.herramientas_requeridas && instalacion.herramientas_requeridas.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <Wrench className="w-4 h-4 mr-2" />
                        Herramientas requeridas:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {instalacion.herramientas_requeridas.map((herramienta, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {herramienta}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => descargarPlano(instalacion.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Plano
                  </Button>
                  
                  {instalacion.estado === 'programada' && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => marcarIniciado(instalacion.id)}
                      disabled={updateInstalacion.isPending}
                    >
                      Iniciar Trabajo
                    </Button>
                  )}
                  
                  {instalacion.estado === 'en-curso' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => marcarCompletado(instalacion.id)}
                      disabled={updateInstalacion.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar Completado
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {misInstalaciones.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay instalaciones programadas
            </h3>
            <p className="text-gray-600">
              No tienes instalaciones asignadas para hoy
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PanelInstalador;
