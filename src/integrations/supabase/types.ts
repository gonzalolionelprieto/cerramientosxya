export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          ciudad: string | null
          codigo_postal: string | null
          created_at: string
          direccion: string | null
          email: string | null
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          ciudad?: string | null
          codigo_postal?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          ciudad?: string | null
          codigo_postal?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          tipoSistema: string
          descripcion: string | null
          medidas_alto: number | null
          medidas_ancho: number | null
          medidas_profundidad: number | null
          opciones: Json | null
          imagen_url: string | null
          esPlantilla: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          tipoSistema: string
          descripcion?: string | null
          medidas_alto?: number | null
          medidas_ancho?: number | null
          medidas_profundidad?: number | null
          opciones?: Json | null
          imagen_url?: string | null
          esPlantilla?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          tipoSistema?: string
          descripcion?: string | null
          medidas_alto?: number | null
          medidas_ancho?: number | null
          medidas_profundidad?: number | null
          opciones?: Json | null
          imagen_url?: string | null
          esPlantilla?: boolean
        }
        Relationships: []
      }
      productos_en_fabricacion: { // New table definition
        Row: {
          id: string
          nombre_producto: string
          estado: string
          cantidad: number
          fecha_estimada_finalizacion: string | null
          fecha_real_finalizacion: string | null // Added field
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre_producto: string
          estado: string
          cantidad: number
          fecha_estimada_finalizacion?: string | null
          fecha_real_finalizacion?: string | null // Added field
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre_producto?: string
          estado?: string
          cantidad?: number
          fecha_estimada_finalizacion?: string | null
          fecha_real_finalizacion?: string | null // Added field
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      presupuestos: { // New table for quotes
        Row: {
          id: string
          created_at: string
          updated_at: string
          cliente_id: string
          producto_plantilla_id: string | null
          medidas_alto: number | null
          medidas_ancho: number | null
          medidas_profundidad: number | null
          materiales: string | null
          opciones_adicionales: Json | null
          precio_total: number
          imagen_url: string | null
          estado: string
          // New fields for Presupuesto details
          tipo_sistema_presupuesto: string | null
          composicion: string | null
          accesorios_incluidos: string | null
          trabajos_incluidos: string | null
          forma_pago: string | null
          tiempo_estimado: string | null
          validez_presupuesto: string | null
          aclaraciones: string | null
          incluye_riesgo_anclaje: boolean // Not null, defaults to false in DB
          garantia: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          cliente_id: string // Required
          producto_plantilla_id?: string | null
          medidas_alto?: number | null
          medidas_ancho?: number | null
          medidas_profundidad?: number | null
          materiales?: string | null
          opciones_adicionales?: Json | null
          precio_total: number // Required
          imagen_url?: string | null
          estado?: string // Defaults in DB to 'pendiente'
          // New fields for Presupuesto details
          tipo_sistema_presupuesto?: string | null
          composicion?: string | null
          accesorios_incluidos?: string | null
          trabajos_incluidos?: string | null
          forma_pago?: string | null
          tiempo_estimado?: string | null
          validez_presupuesto?: string | null
          aclaraciones?: string | null
          incluye_riesgo_anclaje?: boolean // Defaults in DB
          garantia?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          cliente_id?: string
          producto_plantilla_id?: string | null
          medidas_alto?: number | null
          medidas_ancho?: number | null
          medidas_profundidad?: number | null
          materiales?: string | null
          opciones_adicionales?: Json | null
          precio_total?: number
          imagen_url?: string | null
          estado?: string
          // New fields for Presupuesto details
          tipo_sistema_presupuesto?: string | null
          composicion?: string | null
          accesorios_incluidos?: string | null
          trabajos_incluidos?: string | null
          forma_pago?: string | null
          tiempo_estimado?: string | null
          validez_presupuesto?: string | null
          aclaraciones?: string | null
          incluye_riesgo_anclaje?: boolean
          garantia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presupuestos_cliente_id_fkey" // Assuming this will be the FK name
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuestos_producto_plantilla_id_fkey" // Assuming this will be the FK name
            columns: ["producto_plantilla_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      herramientas: {
        Row: {
          cantidad_disponible: number
          cantidad_total: number
          categoria: string | null
          created_at: string
          estado: string
          id: string
          nombre: string
          ubicacion: string | null
          updated_at: string
        }
        Insert: {
          cantidad_disponible?: number
          cantidad_total?: number
          categoria?: string | null
          created_at?: string
          estado?: string
          id?: string
          nombre: string
          ubicacion?: string | null
          updated_at?: string
        }
        Update: {
          cantidad_disponible?: number
          cantidad_total?: number
          categoria?: string | null
          created_at?: string
          estado?: string
          id?: string
          nombre?: string
          ubicacion?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      instalaciones: {
        Row: {
          codigo: string
          comentarios: string | null
          created_at: string
          estado: string
          fecha: string
          firma_cliente: string | null
          herramientas_requeridas: string[] | null
          hora_fin: string | null
          hora_inicio: string | null
          id: string
          instalador_id: string | null
          pedido_id: string | null
          planos_url: string | null // Added field
          updated_at: string
        }
        Insert: {
          codigo: string
          comentarios?: string | null
          created_at?: string
          estado?: string
          fecha: string
          firma_cliente?: string | null
          herramientas_requeridas?: string[] | null
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          instalador_id?: string | null
          pedido_id?: string | null
          planos_url?: string | null // Added field
          updated_at?: string
        }
        Update: {
          codigo?: string
          comentarios?: string | null
          created_at?: string
          estado?: string
          fecha?: string
          firma_cliente?: string | null
          herramientas_requeridas?: string[] | null
          hora_fin?: string | null
          hora_inicio?: string | null
          id?: string
          instalador_id?: string | null
          pedido_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instalaciones_instalador_id_fkey"
            columns: ["instalador_id"]
            isOneToOne: false
            referencedRelation: "instaladores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instalaciones_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      instaladores: {
        Row: {
          activo: boolean | null
          created_at: string
          email: string | null
          especialidad: string | null
          id: string
          nombre: string
          password_hash: string | null
          telefono: string | null
          updated_at: string
          usuario: string | null
        }
        Insert: {
          activo?: boolean | null
          created_at?: string
          email?: string | null
          especialidad?: string | null
          id?: string
          nombre: string
          password_hash?: string | null
          telefono?: string | null
          updated_at?: string
          usuario?: string | null
        }
        Update: {
          activo?: boolean | null
          created_at?: string
          email?: string | null
          especialidad?: string | null
          id?: string
          nombre?: string
          password_hash?: string | null
          telefono?: string | null
          updated_at?: string
          usuario?: string | null
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          cliente_id: string | null
          color: string | null
          comentarios: string | null
          created_at: string
          descripcion: string | null
          estado: string
          fecha_entrega_estimada: string | null
          fecha_pedido: string
          id: string
          medidas: string | null
          numero_orden: string
          precio: number | null
          tipo_ventana: string
          updated_at: string
          urgente: boolean | null
        }
        Insert: {
          cliente_id?: string | null
          color?: string | null
          comentarios?: string | null
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_entrega_estimada?: string | null
          fecha_pedido?: string
          id?: string
          medidas?: string | null
          numero_orden: string
          precio?: number | null
          tipo_ventana: string
          updated_at?: string
          urgente?: boolean | null
        }
        Update: {
          cliente_id?: string | null
          color?: string | null
          comentarios?: string | null
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_entrega_estimada?: string | null
          fecha_pedido?: string
          id?: string
          medidas?: string | null
          numero_orden?: string
          precio?: number | null
          tipo_ventana?: string
          updated_at?: string
          urgente?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_proveedor: {
        Row: {
          cantidad: number | null
          created_at: string
          descripcion: string | null
          estado: string
          fecha_entrega_estimada: string | null
          fecha_entrega_real: string | null
          fecha_pedido: string
          id: string
          notas: string | null
          numero_pedido: string
          pedido_cliente_id: string | null
          precio: number | null
          proveedor_id: string | null
          updated_at: string
        }
        Insert: {
          cantidad?: number | null
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_entrega_estimada?: string | null
          fecha_entrega_real?: string | null
          fecha_pedido?: string
          id?: string
          notas?: string | null
          numero_pedido: string
          pedido_cliente_id?: string | null
          precio?: number | null
          proveedor_id?: string | null
          updated_at?: string
        }
        Update: {
          cantidad?: number | null
          created_at?: string
          descripcion?: string | null
          estado?: string
          fecha_entrega_estimada?: string | null
          fecha_entrega_real?: string | null
          fecha_pedido?: string
          id?: string
          notas?: string | null
          numero_pedido?: string
          pedido_cliente_id?: string | null
          precio?: number | null
          proveedor_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_proveedor_pedido_cliente_id_fkey"
            columns: ["pedido_cliente_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_proveedor_proveedor_id_fkey"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "proveedores"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedores: {
        Row: {
          activo: boolean | null
          contacto: string | null
          created_at: string
          direccion: string | null
          email: string | null
          especialidad: string | null
          id: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean | null
          contacto?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          especialidad?: string | null
          id?: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean | null
          contacto?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          especialidad?: string | null
          id?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ruta_herramientas: {
        Row: {
          cantidad: number
          created_at: string
          herramienta_id: string | null
          id: string
          ruta_id: string | null
        }
        Insert: {
          cantidad?: number
          created_at?: string
          herramienta_id?: string | null
          id?: string
          ruta_id?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string
          herramienta_id?: string | null
          id?: string
          ruta_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ruta_herramientas_herramienta_id_fkey"
            columns: ["herramienta_id"]
            isOneToOne: false
            referencedRelation: "herramientas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ruta_herramientas_ruta_id_fkey"
            columns: ["ruta_id"]
            isOneToOne: false
            referencedRelation: "rutas"
            referencedColumns: ["id"]
          },
        ]
      }
      rutas: {
        Row: {
          codigo: string
          conductor_id: string | null
          created_at: string
          distancia_total_km: number | null
          estado: string
          fecha: string
          id: string
          tiempo_estimado_minutos: number | null
          updated_at: string
          vehiculo_id: string | null
        }
        Insert: {
          codigo: string
          conductor_id?: string | null
          created_at?: string
          distancia_total_km?: number | null
          estado?: string
          fecha: string
          id?: string
          tiempo_estimado_minutos?: number | null
          updated_at?: string
          vehiculo_id?: string | null
        }
        Update: {
          codigo?: string
          conductor_id?: string | null
          created_at?: string
          distancia_total_km?: number | null
          estado?: string
          fecha?: string
          id?: string
          tiempo_estimado_minutos?: number | null
          updated_at?: string
          vehiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rutas_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "instaladores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rutas_vehiculo_id_fkey"
            columns: ["vehiculo_id"]
            isOneToOne: false
            referencedRelation: "vehiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      vehiculos: {
        Row: {
          conductor_asignado: string | null
          created_at: string
          estado: string
          id: string
          kilometraje: number | null
          matricula: string
          modelo: string | null
          tipo: string
          ubicacion_actual: string | null
          updated_at: string
        }
        Insert: {
          conductor_asignado?: string | null
          created_at?: string
          estado?: string
          id?: string
          kilometraje?: number | null
          matricula: string
          modelo?: string | null
          tipo: string
          ubicacion_actual?: string | null
          updated_at?: string
        }
        Update: {
          conductor_asignado?: string | null
          created_at?: string
          estado?: string
          id?: string
          kilometraje?: number | null
          matricula?: string
          modelo?: string | null
          tipo?: string
          ubicacion_actual?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehiculos_conductor_asignado_fkey"
            columns: ["conductor_asignado"]
            isOneToOne: false
            referencedRelation: "instaladores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generar_codigo_instalacion: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generar_numero_orden: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
