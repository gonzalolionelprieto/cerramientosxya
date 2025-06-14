// 2. Revisa tu schema - puede que sea muy estricto:

import * as z from "zod";

export const presupuestoFormSchema = z.object({
  // ✅ Hacer campos opcionales temporalmente para debug
  tipo_sistema_presupuesto: z.enum(
    ["techo", "baranda_postes", "baranda_click", "cerramiento"],
    { errorMap: () => ({ message: "Tipo de sistema es requerido" }) }
  ),
  cliente_id: z.string().min(1, "Cliente es requerido"), // ✅ Mensaje de error
  tiposistema: z.string().min(1, "Tipo de sistema es requerido").optional(), // ✅ Temporal
  descripcion: z.string().nullable().optional(),

  medidas_alto: z.preprocess(
    (val) => val === '' ? null : Number(val),
    z.number().nullable().optional()
  ),
  medidas_ancho: z.preprocess(
    (val) => val === '' ? null : Number(val),
    z.number().nullable().optional()
  ),
  medidas_prof: z.preprocess(
    (val) => val === '' ? null : Number(val),
    z.number().nullable().optional()
  ),

  opciones_adicionales: z
    .array(
      z.object({
        nombre: z.string().min(1),
        precio: z.preprocess((val) => val === '' ? undefined : Number(val), z.number().nullable())
      })
    )
    .optional(),

  accesorios_incluidos: z.string().nullable().optional(),
  trabajos_incluidos: z.string().nullable().optional(),
  forma_pago: z.string().nullable().optional(),
  tiempo_estimado: z.string().nullable().optional(),
  validez_presupuesto: z.string().nullable().optional(),
  incluye_riesgo_anclaje: z.boolean().optional(),
  aclaraciones: z.string().nullable().optional(),
  garantia: z.string().nullable().optional(),
  estado: z.string().optional(),
});