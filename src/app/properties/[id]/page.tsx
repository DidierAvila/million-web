'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PropertyDto, PropertyImageDto, PropertyTraceDto } from '@/types/api';
import { PropertyDetail } from '@/components/properties/PropertyDetail';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';

export default function PropertyDetailPage() {
  const router = useParams();
  const navigateBack = useRouter();
  const { id } = router;
  
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [images, setImages] = useState<PropertyImageDto[]>([]);
  const [traces, setTraces] = useState<PropertyTraceDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id || typeof id !== 'string') {
        setError('ID de propiedad no válido');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Hacer las tres peticiones en paralelo
        const [propertyData, imagesData, tracesData] = await Promise.all([
          api.properties.getById(id),
          api.propertyImages.getByPropertyId(id),
          api.propertyTraces.getByPropertyId(id)
        ]);

        setProperty(propertyData);
        setImages(imagesData || []);
        setTraces(tracesData || []);
      } catch (err) {
        console.error('Error al cargar los datos de la propiedad:', err);
        setError('Ocurrió un error al cargar la información. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error || 'No se encontró la propiedad'}</p>
        </div>
        <div className="mt-6">
          <Button onClick={() => navigateBack.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigateBack.back()}>
          ← Volver a propiedades
        </Button>
      </div>

      <PropertyDetail
        property={property}
        images={images}
        traces={traces}
      />
    </div>
  );
}
