import * as z from "zod";

export const presupuestoFormSchema = z.object({
  cliente_nombre: z.string().min(1, "El nombre del cliente es requerido"),
  domicilio: z.string().min(1, "El domicilio es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  tipo_sistema_presupuesto: z.enum(["techo", "baranda_postes", "baranda_click", "cerramiento"]),
  cantidad_panos: z.number().min(1, "Debe haber al menos un paño"),
  medidas: z.array(
    z.object({
      ancho: z.number().min(1, "El ancho debe ser mayor a 0"),
      alto: z.number().min(1, "El alto debe ser mayor a 0")
    })
  ).min(1, "Debe haber al menos un paño"),
  total: z.number().min(1, "El total es requerido"),
});
