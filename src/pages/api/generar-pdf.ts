// src/pages/api/generar-pdf.ts
import type { Request, Response } from 'express';
import { fillPdfTemplate } from '@/lib/pdf/fillPdfTemplate';
import { type TipoSistema } from '@/hooks/useTipoSistemaConfig';
import { CONFIGS } from '@/hooks/useTipoSistemaConfig'; // Asegurate que sea exportado

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { tipo_sistema_presupuesto, ...campos } = req.body as {
      tipo_sistema_presupuesto: TipoSistema;
      [key: string]: string | number;
    };

    const config = CONFIGS[tipo_sistema_presupuesto];
    if (!config) {
      return res.status(400).json({ error: 'Sistema no soportado' });
    }

    const pdfBuffer = await fillPdfTemplate({
      templateFileName: config.archivoPlantilla,
      campos,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=presupuesto.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error generando PDF' });
  }
}
