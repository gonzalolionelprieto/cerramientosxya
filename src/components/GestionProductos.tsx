import React, { useState } from 'react';
import {
  useGetProductos,
  type Producto,
  useCreateProducto,
  useUpdateProducto, // Import useUpdateProducto
  uploadProductImage,
  type UpdateProductoArgs, // Import UpdateProductoArgs
} from '@/hooks/useProductos';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, ImageOff, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription, // Not used for now, but could be added
  // DialogFooter, // Not used directly here as form has its own buttons
  // DialogClose, // Not used directly here
} from '@/components/ui/dialog';
import ProductoForm, { type ProductoFormData } from './ProductoForm'; // Import form and its data type
import { toast } from 'sonner'; // For placeholder submit
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card'; // For empty state
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GestionProductos: React.FC = () => {
  const { data: productos = [], isLoading, isError, error } = useGetProductos(); // refetch not strictly needed due to query invalidation
  const createProductoMutation = useCreateProducto();
  const updateProductoMutation = useUpdateProducto();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Partial<Producto> | null | undefined>(null);

  const handleOpenModal = (producto?: Partial<Producto> | null) => {
    setEditingProducto(producto); // Set to null for new, or product data for edit
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProducto(null); // Clear editing state
  };

  const handleFormSubmit = async (formData: ProductoFormData) => {
    try {
      let finalImageUrl = formData.imagen_url; // Existing URL or empty string

      // Step 1: Handle image upload if a new file is provided
      if (formData.imagen_file) {
        toast.info('Subiendo imagen...');
        const { publicUrl, error: uploadError } = await uploadProductImage(formData.imagen_file);
        if (uploadError) {
          toast.error('Error al subir la imagen.', { description: uploadError.message });
          // Optionally, delete the old image if productToEdit.imagen_url existed and imagen_url was cleared
          // This part is complex if the old image needs deletion before knowing new one succeeds.
          // For now, we just error out.
          return;
        }
        finalImageUrl = publicUrl;
        toast.success('Imagen subida correctamente.');
      } else if (formData.imagen_url === '' && editingProducto?.imagen_url) {
        // This means the user cleared an existing image URL via "Quitar Imagen" without uploading a new one.
        // Here you might want to delete the old image from storage.
        // For now, we'll just set the URL to null or empty.
        console.log(`Image marked for removal (URL cleared): ${editingProducto.imagen_url}`);
        // finalImageUrl = null; // Or empty string, depending on DB preference
      }

      const { imagen_file, ...productDataFromForm } = formData;

      // Ensure all fields intended for the DB are correctly typed and present
      const productPayload: Omit<Producto, 'id' | 'created_at' | 'updated_at'> & { id?: string } = {
        tipoSistema: productDataFromForm.tipoSistema,
        descripcion: productDataFromForm.descripcion || null,
        medidas_alto: productDataFromForm.medidas_alto,
        medidas_ancho: productDataFromForm.medidas_ancho,
        medidas_profundidad: productDataFromForm.medidas_profundidad,
        esPlantilla: productDataFromForm.esPlantilla,
        imagen_url: finalImageUrl,
        opciones: productDataFromForm.opciones || null, // Ensure it's null if empty array, or as DB expects
      };

      const isEditMode = editingProducto && editingProducto.id;

      if (isEditMode) {
        // Ensure 'id' is not in the payload for update, it's passed separately
        const { id, created_at, updated_at, ...updatePayload } = productPayload as any; // Cast to remove id for update

        await updateProductoMutation.mutateAsync({
          id: editingProducto.id!, // Non-null assertion as isEditMode checks this
          updates: updatePayload as UpdateProductoArgs
        });
        toast.success(`Producto "${productPayload.tipoSistema}" actualizado exitosamente.`);
      } else {
        await createProductoMutation.mutateAsync(productPayload as any); // Replace 'any' with the correct type if known
        toast.success(`Producto "${productPayload.tipoSistema}" creado exitosamente.`);
      }

      handleCloseModal();
      // Query invalidation in mutation hooks will refetch the list.
    } catch (error) {
      const err = error as Error;
      // If using react-query's throwOnError: true, this catch might not be needed here
      // as errors would be handled by the hook's onError or component's error boundary.
      // However, for direct feedback, it's fine.
      toast.error(`Error al ${editingProducto?.id ? 'actualizar' : 'crear'} el producto.`, {
        description: err.message
      });
    }
  };

  const formatMedidas = (producto: Producto) => {
    const alto = producto.medidas_alto ?? 'N/A';
    const ancho = producto.medidas_ancho ?? 'N/A';
    const prof = producto.medidas_profundidad ?? 'N/A';
    return `${alto} x ${ancho} x ${prof} cm`;
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Productos y Plantillas</h1>
            <p className="text-sm text-gray-600 mt-1">
              Administre los productos base y las plantillas para la creación de pedidos.
            </p>
          </div>
          <div>
            <Skeleton className="h-10 w-48" /> {/* Skeleton for Button */}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo Sistema</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Medidas (AxAxP cm)</TableHead>
              <TableHead>Plantilla?</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Productos y Plantillas</h1>
            <p className="text-sm text-gray-600 mt-1">
              Administre los productos base y las plantillas para la creación de pedidos.
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al Cargar Productos</AlertTitle>
          <AlertDescription>
            No se pudieron cargar los productos. Intente de nuevo más tarde.
            {error && <p className="mt-2 text-xs">Detalle: {error.message}</p>}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Productos y Plantillas</h1>
          <p className="text-sm text-gray-600 mt-1">
            Administre los productos base y las plantillas para la creación de pedidos.
          </p>
        </div>
        <div>
          <Button onClick={() => handleOpenModal(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Producto/Plantilla
          </Button>
        </div>
      </div>

      {/* Product List / Table */}
      {productos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <PlusCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay productos o plantillas creadas todavía.
            </h3>
            <p className="text-gray-600 mb-4">
              ¡Comience agregando un nuevo producto o plantilla!
            </p>
            {/* Placeholder for future Add button here too, or rely on header one */}
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo Sistema</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="min-w-[150px]">Medidas (AxAxP cm)</TableHead>
              <TableHead>Plantilla?</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className="font-medium">{producto.tipoSistema}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {producto.descripcion || 'N/A'}
                </TableCell>
                <TableCell>{formatMedidas(producto)}</TableCell>
                <TableCell>
                  {producto.esPlantilla ? (
                    <Badge variant="outline">Sí</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">No</span>
                  )}
                </TableCell>
                <TableCell>
                  {/* Placeholder for image - maybe an icon if no image_url */}
                  {producto.imagen_url ? (
                    <a href={producto.imagen_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">Ver Imagen</a>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <ImageOff className="h-3 w-3 mr-1 inline-block" /> N/A
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {/* Placeholder for action buttons */}
                  <span className="text-xs text-gray-500">(Editar | Eliminar)</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Modal using Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"> {/* Adjusted width and added scroll */}
          <DialogHeader>
            <DialogTitle>
              {editingProducto && editingProducto.id ? 'Editar Producto/Plantilla' : 'Crear Nuevo Producto/Plantilla'}
            </DialogTitle>
            {/* Optional: <DialogDescription>...</DialogDescription> */}
          </DialogHeader>
          <ProductoForm
            productToEdit={editingProducto || undefined}
            onSubmit={handleFormSubmit}
            isLoading={createProductoMutation.isPending || updateProductoMutation.isPending}
            onClose={handleCloseModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionProductos;
