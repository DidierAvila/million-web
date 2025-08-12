'use client';

import { PropertyDto } from '@/types/api';
import { formatCurrency } from '@/lib/formatters';
import Link from 'next/link';
import { Button } from '../ui/Button';

interface PropertyCardProps {
  property: PropertyDto;
  showActions?: boolean;
}

export function PropertyCard({ property, showActions = true }: PropertyCardProps) {
  return (
    <div className='bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden'>
      <div className='p-5'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate mb-1'>
          {property.name}
        </h3>
        <p className='text-sm text-gray-500 dark:text-gray-400 truncate mb-3'>
          {property.address}
        </p>
        
        <div className='flex justify-between items-center mb-4'>
          <span className='text-lg font-bold text-gray-900 dark:text-white'>
            {formatCurrency(property.price)}
          </span>
          <span className='text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded'>
            Año {property.year}
          </span>
        </div>
        
        <div className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
          <div className='flex justify-between'>
            <span>Propietario:</span>
            <span className='font-medium'>{property.ownerName || 'N/A'}</span>
          </div>
        </div>
        
        <div className='flex justify-between'>
          <Link href={`/properties/${property.id}`}>
            <Button size='sm' variant='outline'>Ver detalles</Button>
          </Link>
          {showActions && (
            <Link href={`/properties/${property.id}/edit`}>
              <Button size='sm'>Editar</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
