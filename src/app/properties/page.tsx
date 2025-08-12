'use client';

import { useState, useEffect } from 'react';
import { PropertyDto } from '@/types/api';
import { api } from '@/lib/api-client';
import { PropertyList } from '@/components/properties/PropertyList';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PropertyFilters } from '@/components/properties/PropertyFilters';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    name?: string;
    address?: string;
    minPrice?: number;
    maxPrice?: number;
  }>({});

  const loadProperties = async (filterParams = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      let data: PropertyDto[];
      if (Object.keys(filterParams).length > 0) {
        data = await api.properties.filter(filterParams);
      } else {
        data = await api.properties.getAll();
      }
      setProperties(data || []);
    } catch (err) {
      console.error('Error al cargar propiedades:', err);
      setError('Ocurrió un error al cargar las propiedades. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [/* Incluimos dependencias vacías para ejecutar solo en el montaje */]);

  const handleDelete = async (id: string) => {
    try {
      await api.properties.delete(id);
      // Actualizar el estado removiendo la propiedad eliminada
      setProperties((prevProperties) => 
        prevProperties.filter((property) => property.id !== id)
      );
    } catch (err) {
      console.error(`Error al eliminar propiedad con ID: ${id}`, err);
      setError('Ocurrió un error al eliminar la propiedad. Intente nuevamente.');
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Propiedades
        </h1>
        <Link href='/properties/new'>
          <Button>
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      <PropertyFilters 
        onFilter={async (filterParams) => {
          setFilters(filterParams);
          await loadProperties(filterParams);
        }} 
        isLoading={loading}
      />

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
        </div>
      ) : error ? (
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
          <p className='text-red-800 dark:text-red-400'>{error}</p>
          <Button 
            variant='outline' 
            size='sm'
            className='mt-2' 
            onClick={() => loadProperties()}
          >
            Reintentar
          </Button>
        </div>
      ) : (
        <PropertyList properties={properties} onDelete={handleDelete} />
      )}
    </div>
  );
}
