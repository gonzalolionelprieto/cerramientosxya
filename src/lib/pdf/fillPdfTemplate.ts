import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

interface FillPdfOptions {
  templateFileName: string; // nombre del PDF de plantilla (por ejemplo, "Techo.pdf")
  campos: Record<string, string | number>; // datos a rellenar
}

export async function fillPdfTemplate({ templateFileName, campos }: FillPdfOptions): Promise<Uint8Array> {
  const filePath = path.resolve(process.cwd(), 'public', 'pdfs', templateFileName);

  // Leer archivo base
  const existingPdfBytes = fs.readFileSync(filePath);

  // Cargar documento
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  // Rellenar los campos
  Object.entries(campos).forEach(([key, value]) => {
    const field = form.getTextField(key);
    if (field) {
      field.setText(String(value));
    } else {
      console.warn(`Campo "${key}" no encontrado en la plantilla PDF.`);
    }
  });

  form.flatten(); // Opcional: bloquea los campos para que no se puedan editar
  return await pdfDoc.save();
}
