import * as z from "zod";

export const presupuestoFormSchema = z.object({
  tipo_sistema_presupuesto: z.enum(['techo', 'baranda_postes', 'baranda_click', 'cerramiento']),
  cliente_id: z.string().min(1),
  tiposistema: z.string().min(1),
  descripcion: z.string().nullable(),
  medidas_alto: z.number().nullable(),
  medidas_ancho: z.number().nullable(),
  medidas_prof: z.number().nullable(),
  opciones_adicionales: z
    .array(
      z.object({
        nombre: z.string().min(1),
        precio: z.number().nullable()
      })
    )
    .optional(),
  accesorios_incluidos: z.string().nullable(),
  trabajos_incluidos: z.string().nullable(),
  forma_pago: z.string().nullable(),
  tiempo_estimado: z.string().nullable(),
  validez_presupuesto: z.string().nullable(),
  incluye_riesgo_anclaje: z.boolean().optional(),
  aclaraciones: z.string().nullable(),
  garantia: z.string().nullable(),
  estado: z.string().optional(),
});
