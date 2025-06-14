import { TipoSistema } from "@/hooks/useTipoSistemaConfig";

interface DownloadPdfOptions {
  tipo_sistema_presupuesto: TipoSistema;
  campos: Record<string, string | number>;
}

export default async function downloadPdfPresupuesto({ tipo_sistema_presupuesto, campos }: DownloadPdfOptions) {
  try {
    const response = await fetch("/api/generar-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo_sistema_presupuesto, ...campos }),
    });

    if (!response.ok) {
      throw new Error("Error generando PDF");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "presupuesto.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Fallo al descargar el PDF", error);
    throw error;
  }
}
// Este código permite descargar un PDF generado por la API del servidor
// con los datos del presupuesto. Utiliza la API Fetch para enviar los datos