'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PropertyDto, PropertyImageDto, PropertyTraceDto } from '@/types/api';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Button } from '../ui/Button';
import { ClientDate } from '../ui/ClientDate';

interface PropertyDetailProps {
  property: PropertyDto;
  images?: PropertyImageDto[] | null;
  traces?: PropertyTraceDto[] | null;
  onDelete?: () => Promise<void>;
}

export function PropertyDetail({
  property,
  images = [],
  traces = [],
  onDelete,
}: PropertyDetailProps) {
  return (
    <div className='bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden'>
      <div className='p-6'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              {property.name}
            </h1>
            <p className='text-gray-500 dark:text-gray-400 mt-1'>
              {property.address}
            </p>
          </div>
          <div className='flex space-x-2'>
            <Link href={`/properties/${property.id}/edit`}>
              <Button variant='outline'>Editar</Button>
            </Link>
            {onDelete && (
              <Button
                variant='destructive'
                onClick={onDelete}
              >
                Eliminar
              </Button>
            )}
          </div>
        </div>

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h2 className='text-lg font-semibold mb-4'>Detalles de la Propiedad</h2>
            
            <dl className='grid grid-cols-2 gap-x-4 gap-y-3'>
              <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Precio</dt>
              <dd className='text-sm text-gray-900 dark:text-white'>{formatCurrency(property.price)}</dd>
              
              <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Año</dt>
              <dd className='text-sm text-gray-900 dark:text-white'>{property.year}</dd>
              
              <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Código Interno</dt>
              <dd className='text-sm text-gray-900 dark:text-white'>{property.internalCode || 'N/A'}</dd>
              
              <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Propietario</dt>
              <dd className='text-sm text-gray-900 dark:text-white'>{property.ownerName || 'N/A'}</dd>
            </dl>
          </div>

          <div>
            {images && images.length > 0 ? (
              <div>
                <h2 className='text-lg font-semibold mb-4'>Imágenes</h2>
                <div className='grid grid-cols-2 gap-4'>
                  {images.map((image) => {
                    if (!image || !image.id) {
                      return null; // Saltamos imágenes inválidas
                    }
                    
                    return (
                      <div key={image.id} className='relative h-40'>
                        {image.imageUrl && image.imageUrl.trim() !== '' ? (
                          <Image
                            src={image.imageUrl}
                            alt={`Imagen de ${property.name}`}
                            className='object-cover rounded-lg w-full h-full'
                            width={300}
                            height={200}
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              // Fallback si la imagen no se puede cargar
                              const imgElement = e.target as HTMLImageElement;
                              imgElement.style.display = 'none';
                              const parent = imgElement.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg"><span class="text-gray-400">Error al cargar imagen</span></div>';
                              }
                            }}
                          />
                        ) : (
                          <div className='h-full w-full flex items-center justify-center bg-gray-100 rounded-lg'>
                            <span className='text-gray-400'>Sin imagen</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  No hay imágenes disponibles para esta propiedad
                </p>
                <Button size='sm' className='mt-2'>
                  Agregar Imagen
                </Button>
              </div>
            )}
          </div>
        </div>

        {traces && traces.length > 0 && (
          <div className='mt-8'>
            <h2 className='text-lg font-semibold mb-4'>Historial de la Propiedad</h2>
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden'>
              <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                {traces.map((trace) => {
                  if (!trace || !trace.id) {
                    return null; // Saltamos registros inválidos
                  }
                  
                  return (
                    <li key={trace.id} className='p-4'>
                      <div className='flex justify-between'>
                        <span className='font-medium'>{trace.name}</span>
                        <span className='text-gray-500'><ClientDate date={trace.dateSale} /></span>
                      </div>
                      <div className='mt-1 flex justify-between'>
                        <span className='text-sm text-gray-500'>Valor: {formatCurrency(trace.value)}</span>
                        <span className='text-sm text-gray-500'>Impuesto: {formatCurrency(trace.tax)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
