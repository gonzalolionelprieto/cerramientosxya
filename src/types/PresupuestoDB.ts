export interface PresupuestoDB {
  cliente_id: string;
  cliente_nombre: string;
  domicilio: string;
  telefono: string;
  tipo_sistema_presupuesto: string;
  cantidad_panos: number;
  medidas: any; // o el tipo correcto de medidas
  total: number;
  estado?: string;           // ⬅ ahora es opcional
  fecha_creacion?: string;   // ⬅ ahora es opcional
}
