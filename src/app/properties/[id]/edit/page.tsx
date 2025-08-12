'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PropertyDto, CreatePropertyDto, UpdatePropertyDto } from '@/types/api';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isEditMode = id !== 'new' && id !== undefined;
  
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!isEditMode || !id) {
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const propertyData = await api.properties.getById(id);
        setProperty(propertyData);
        console.log('Property loaded:', propertyData); // Para depuración
      } catch (err) {
        console.error('Error al cargar la propiedad:', err);
        setError('No se pudo cargar la información de la propiedad. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, isEditMode]);

  const handleSubmit = async (formData: CreatePropertyDto | UpdatePropertyDto) => {
    setIsSaving(true);
    setError(null);
    
    try {
      if (isEditMode && id) {
        // Actualizar propiedad existente
        console.log('Actualizando propiedad:', id, formData); // Para depuración
        await api.properties.update(id, formData);
      } else {
        // Crear nueva propiedad
        console.log('Creando nueva propiedad:', formData); // Para depuración
        await api.properties.create(formData);
      }
      
      // Redirigir a la lista de propiedades
      router.push('/properties');
    } catch (err) {
      console.error('Error al guardar la propiedad:', err);
      setError('Ocurrió un error al guardar la propiedad. Por favor, inténtalo de nuevo.');
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          ← Volver
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Editar Propiedad' : 'Nueva Propiedad'}
        </h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <PropertyForm
          onSubmit={handleSubmit}
          initialData={property || undefined}
          isLoading={isLoading || isSaving}
        />
      </div>
    </div>
  );
}
