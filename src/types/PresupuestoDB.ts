export interface PresupuestoDB {
  cliente_id: string;
  tipo_producto: string;
  sistema: string;
  medidas_alto?: number;
  medidas_ancho?: number;
  cantidad_paneles?: number;
  accesorios?: any; // JSON
  trabajos_incluidos?: any;
  aclaraciones?: string;
  tiempo_estimado?: string;
  garantia_meses?: number;
  forma_pago?: string;
  costo_total?: number;
  costo_total_iv?: number;
  estado?: string;
  fecha_creacion?: string;
}
