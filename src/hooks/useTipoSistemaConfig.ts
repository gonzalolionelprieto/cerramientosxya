import { useMemo } from "react";

export type TipoSistema =
  | "techo"
  | "baranda_postes"
  | "baranda_click"
  | "cerramiento"
  | "baranda_escalera"
  | "baranda_balcon";

interface TipoSistemaConfig {
  nombreParaPDF: string;
  camposAdicionales: string[];
  archivoPlantilla: string;
  camposEnPDF: {
    [key: string]: string;
  };
}

export const CONFIGS: Record<TipoSistema, TipoSistemaConfig> = {
  techo: {
    nombreParaPDF: "Techo Vidriado",
    archivoPlantilla: "Techo.pdf",
    camposAdicionales: ["pendiente_techo", "tipo_vidrio", "tipo_perfil"],
    camposEnPDF: {
      medidas_ancho: "ancho",
      medidas_alto: "largo",
      pendiente_techo: "pendiente",
      tipo_vidrio: "vidrio",
      tipo_perfil: "perfil",
    },
  },
  baranda_postes: {
    nombreParaPDF: "Baranda con Postes",
    archivoPlantilla: "Baranda Sistema Postes.pdf",
    camposAdicionales: ["altura_baranda", "ubicacion"],
    camposEnPDF: {
      medidas_ancho: "largo_baranda",
      altura_baranda: "altura",
      ubicacion: "ubicacion",
    },
  },
  baranda_click: {
    nombreParaPDF: "Baranda Sistema Click",
    archivoPlantilla: "Baranda Sistema Click.pdf",
    camposAdicionales: ["altura_baranda", "color_perfil"],
    camposEnPDF: {
      medidas_ancho: "longitud",
      altura_baranda: "altura",
      color_perfil: "color",
    },
  },
  cerramiento: {
    nombreParaPDF: "Cerramiento Vidriado",
    archivoPlantilla: "Cerramiento.pdf",
    camposAdicionales: ["cantidad_paneles", "color_vidrio"],
    camposEnPDF: {
      medidas_ancho: "ancho",
      medidas_alto: "alto",
      cantidad_paneles: "paneles",
      color_vidrio: "color_vidrio",
    },
  },
  baranda_escalera: {
    nombreParaPDF: "Baranda Escalera",
    archivoPlantilla: "Baranda Escalera.pdf",
    camposAdicionales: ["altura_baranda", "inclinacion"],
    camposEnPDF: {
      medidas_ancho: "longitud",
      altura_baranda: "altura",
      inclinacion: "inclinacion",
    },
  },
  baranda_balcon: {
    nombreParaPDF: "Baranda Balcón",
    archivoPlantilla: "Baranda Balcon.pdf",
    camposAdicionales: ["altura_baranda", "tipo_vidrio"],
    camposEnPDF: {
      medidas_ancho: "longitud",
      altura_baranda: "altura",
      tipo_vidrio: "vidrio",
    },
  },
};

export function useTipoSistemaConfig(
  tipo: TipoSistema | undefined
): TipoSistemaConfig | null {
  return useMemo(() => {
    if (!tipo) return null;
    return CONFIGS[tipo];
  }, [tipo]);
}
