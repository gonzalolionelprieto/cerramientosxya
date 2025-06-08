import React, { useEffect, useState } from 'react'; // Import useState
import { useForm, Controller, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Uncommented and verified
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Producto } from '@/hooks/useProductos';
import { Loader2, Trash2, PlusCircle } from 'lucide-react'; // Import Trash2, PlusCircle

// Zod Schema Definition
const opcionSchema = z.object({
  nombre: z.string().min(1, "Nombre de opción es requerido."),
  // Allow precio to be null or a positive number. If string, coerce, then check.
  precio: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().positive("Precio debe ser positivo.").nullable()
  ),
});

const productoFormSchema = z.object({
  tipoSistema: z.string().min(1, "Tipo de sistema es requerido."),
  descripcion: z.string().optional(),
  medidas_alto: z.coerce.number().positive("Alto debe ser un número positivo").optional().nullable(),
  medidas_ancho: z.coerce.number().positive("Ancho debe ser un número positivo").optional().nullable(),
  medidas_profundidad: z.coerce.number().positive("Profundidad debe ser un número positivo").optional().nullable(),
  esPlantilla: z.boolean().default(false),
  imagen_url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')).nullable(),
  imagen_file: z.instanceof(File).optional().nullable(), // For the actual file object
  opciones: z.array(opcionSchema).optional(),
});

export type ProductoFormData = z.infer<typeof productoFormSchema>;
export type OpcionFormData = z.infer<typeof opcionSchema>;

// Component Props Interface
interface ProductoFormProps {
  productToEdit?: Partial<Producto>; // Using Partial<Producto> for flexibility
  onSubmit: (data: ProductoFormData) => Promise<void>; // onSubmit from parent will handle the mutation
  isLoading?: boolean;
  onClose: () => void;
}

const ProductoForm: React.FC<ProductoFormProps> = ({
  productToEdit,
  onSubmit: handleParentSubmit, // Renamed to avoid conflict with RHF's handleSubmit
  isLoading,
  onClose,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProductoFormData>({
    resolver: zodResolver(productoFormSchema),
    defaultValues: {
      tipoSistema: '',
      descripcion: '',
      medidas_alto: null,
      medidas_ancho: null,
      medidas_profundidad: null,
      esPlantilla: false,
      imagen_url: '',
      imagen_file: null, // Initialize imagen_file
      opciones: [{ nombre: '', precio: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "opciones",
  });

  useEffect(() => {
    if (productToEdit) {
      // Ensure 'opciones' from productToEdit (which is Json | null) is transformed
      // into the array structure expected by the form.
      let initialOpciones: OpcionFormData[] = [{ nombre: '', precio: null }]; // Default if no options
      if (productToEdit.opciones && Array.isArray(productToEdit.opciones)) {
        // Assuming productToEdit.opciones is already an array of {nombre: string, precio: number | null}
        // If it's a JSON string, it would need parsing: e.g. JSON.parse(productToEdit.opciones as string)
        // For this subtask, we assume it's compatible or null.
        const productOpciones = productToEdit.opciones as unknown as OpcionFormData[];
        if (productOpciones.length > 0) {
          initialOpciones = productOpciones.map(op => ({
            nombre: op.nombre || '',
            precio: op.precio === undefined ? null : Number(op.precio) // Ensure precio is number or null
          }));
        }
      }

      form.reset({
        tipoSistema: productToEdit.tipoSistema || '',
        descripcion: productToEdit.descripcion || '',
        medidas_alto: productToEdit.medidas_alto || null,
        medidas_ancho: productToEdit.medidas_ancho || null,
        medidas_profundidad: productToEdit.medidas_profundidad || null,
        esPlantilla: productToEdit.esPlantilla || false,
        imagen_url: productToEdit.imagen_url || '',
        opciones: initialOpciones,
        imagen_file: null, // Always reset file input on edit
      });
      if (productToEdit.imagen_url) {
        setImagePreview(productToEdit.imagen_url);
      } else {
        setImagePreview(null);
      }
    } else {
      form.reset({
        tipoSistema: '',
        descripcion: '',
        medidas_alto: null,
        medidas_ancho: null,
        medidas_profundidad: null,
        esPlantilla: false,
        imagen_url: '',
        imagen_file: null,
        opciones: [{ nombre: '', precio: null }],
      });
      setImagePreview(null);
    }
  }, [productToEdit, form]);

  // Wrapper for the submit handler from props
  const onFormSubmitValid: SubmitHandler<ProductoFormData> = async (data) => {
    // Ensure opciones with empty nombre and no price are not submitted, or handle as needed
    const filteredData = {
      ...data,
      opciones: data.opciones?.filter(op => op.nombre || op.precio !== null)
    };
    await handleParentSubmit(filteredData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmitValid)} className="space-y-6">
        {/* Tipo Sistema */}
        <FormField
          control={form.control}
          name="tipoSistema"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Sistema</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo de sistema..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Paño fijo">Paño fijo</SelectItem>
                  <SelectItem value="Paño corredizo">Paño corredizo</SelectItem>
                  <SelectItem value="Paño plegable">Paño plegable</SelectItem>
                  <SelectItem value="Mosquitero">Mosquitero</SelectItem>
                  <SelectItem value="Mampara">Mampara</SelectItem>
                  <SelectItem value="Techo vidriado">Techo vidriado</SelectItem>
                  <SelectItem value="Baranda de vidrio">Baranda de vidrio</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descripcion */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción detallada del producto o plantilla..." {...field} value={field.value ?? ''}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Medidas Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="medidas_alto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alto (cm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ej: 120.5" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medidas_ancho"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ancho (cm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ej: 80" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medidas_profundidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profundidad (cm)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ej: 4.5" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Imagen URL */}
        <FormField
          control={form.control}
          name="imagen_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Imagen (Opcional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://ejemplo.com/imagen.jpg" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Es Plantilla */}
        <FormField
          control={form.control}
          name="esPlantilla"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>¿Es una Plantilla?</FormLabel>
                <FormDescription>
                  Marque esta opción si el producto se usará como plantilla base reutilizable.
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Imagen File Input and Preview */}
        <FormField
          control={form.control}
          name="imagen_file"
          render={({ field }) => ( // `field` includes onChange, onBlur, value, name, ref
            <FormItem>
              <FormLabel>Cargar Imagen (Opcional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file); // Update react-hook-form state with the File object
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      field.onChange(null);
                      setImagePreview(null);
                    }
                  }}
                  // We don't directly use field.value for file input control after selection
                  // ref={field.ref} // react-hook-form might not need explicit ref for file inputs handled this way
                />
              </FormControl>
              <FormDescription>
                Si ya existe una URL de imagen y carga un nuevo archivo, el archivo reemplazará la URL al guardar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {imagePreview && (
          <div className="space-y-2">
            <Label>Vista Previa de Imagen:</Label>
            <div className="relative w-32 h-32 border rounded-md overflow-hidden">
              <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                form.setValue('imagen_file', null);
                setImagePreview(null);
                // If editing, this implies the current imagen_url should be cleared on submit
                // We can also clear imagen_url field if it's for existing image
                if (productToEdit?.imagen_url) {
                     form.setValue('imagen_url', ''); // Mark existing URL for removal
                }
              }}
            >
              Quitar Imagen
            </Button>
          </div>
        )}

        {/* Opciones Dinámicas */}
        <div className="space-y-4 p-4 border rounded-md">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium text-gray-700">Opciones Adicionales</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ nombre: '', precio: null })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Opción
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-x-3 p-3 bg-gray-50/50 rounded-md border">
              <FormField
                control={form.control}
                name={`opciones.${index}.nombre`}
                render={({ field: nestedField }) => (
                  <FormItem className="flex-grow">
                    <FormLabel className="text-xs">Nombre Opción {index + 1}</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Vidrio Templado" {...nestedField} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`opciones.${index}.precio`}
                render={({ field: nestedField }) => (
                  <FormItem className="w-1/3">
                    <FormLabel className="text-xs">Precio Adicional</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej: 150.75" {...nestedField} value={nestedField.value ?? ''} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
                className="h-9 w-9 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Eliminar opción</span>
              </Button>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-xs text-center text-gray-500 py-2">No hay opciones adicionales. Haga clic en "Agregar Opción" para añadir una.</p>
          )}
        </div>


        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductoForm;
