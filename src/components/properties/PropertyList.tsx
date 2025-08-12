'use client';

import { PropertyDto } from '@/types/api';
import { formatCurrency } from '@/lib/formatters';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { useState } from 'react';

interface PropertyListProps {
  properties: PropertyDto[];
  onDelete?: (id: string) => Promise<void>;
}

export function PropertyList({ properties, onDelete }: PropertyListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (properties.length === 0) {
    return (
      <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          No hay propiedades disponibles
        </h3>
        <p className='text-gray-500 dark:text-gray-400 mb-4'>
          No se encontraron propiedades registradas en el sistema.
        </p>
        <Link href='/properties/new'>
          <Button>Registrar nueva propiedad</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
        <thead className='bg-gray-50 dark:bg-gray-800'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Nombre
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Dirección
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Precio
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Año
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Propietario
            </th>
            <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
          {properties.map((property) => (
            <tr key={property.id} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                {property.name}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                {property.address}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                {formatCurrency(property.price)}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                {property.year}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                {property.ownerName || 'N/A'}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2'>
                <Link href={`/properties/${property.id}`}>
                  <Button size='sm' variant='outline'>
                    Ver
                  </Button>
                </Link>
                <Link href={`/properties/${property.id}/edit`}>
                  <Button size='sm' variant='outline'>
                    Editar
                  </Button>
                </Link>
                {onDelete && (
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleDelete(property.id)}
                    isLoading={deletingId === property.id}
                    disabled={deletingId !== null}
                  >
                    Eliminar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
