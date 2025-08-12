'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// Definimos nuestro propio esquema de validación para el formulario
const filterFormSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

// Inferir el tipo del esquema
type PropertyFiltersValues = z.infer<typeof filterFormSchema>;

interface PropertyFiltersProps {
  onFilter: (filters: {name?: string; address?: string; minPrice?: number; maxPrice?: number}) => Promise<void>;
  isLoading?: boolean;
}

export function PropertyFilters({ onFilter, isLoading = false }: PropertyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFiltersValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      name: '',
      address: '',
      minPrice: '',
      maxPrice: '',
    },
  });

  const handleFilter = async (data: PropertyFiltersValues) => {
    const filters = {
      name: data.name && data.name.trim() !== '' ? data.name : undefined,
      address: data.address && data.address.trim() !== '' ? data.address : undefined,
      minPrice: data.minPrice && data.minPrice.trim() !== '' ? Number(data.minPrice) : undefined,
      maxPrice: data.maxPrice && data.maxPrice.trim() !== '' ? Number(data.maxPrice) : undefined,
    };

    await onFilter(filters);
  };

  const handleReset = () => {
    reset({
      name: '',
      address: '',
      minPrice: '',
      maxPrice: '',
    });
    onFilter({});
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-medium">Filtros</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
        </Button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <form onSubmit={handleSubmit(handleFilter)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre de la propiedad"
                {...register('name')}
                error={errors.name?.message}
                placeholder="Buscar por nombre"
              />
              
              <Input
                label="Dirección"
                {...register('address')}
                error={errors.address?.message}
                placeholder="Buscar por dirección"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Precio mínimo"
                type="number"
                min="0"
                step="0.01"
                {...register('minPrice')}
                error={errors.minPrice?.message}
                placeholder="Ej: 10000"
              />
              
              <Input
                label="Precio máximo"
                type="number"
                min="0"
                step="0.01"
                {...register('maxPrice')}
                error={errors.maxPrice?.message}
                placeholder="Ej: 500000"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                Limpiar filtros
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
              >
                Aplicar filtros
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
