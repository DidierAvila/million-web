'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useState, useEffect } from 'react';
import { CreatePropertyDto, OwnerDto, PropertyDto, UpdatePropertyDto } from '@/types/api';
import { api } from '@/lib/api-client';

// Tipo de los valores del formulario
interface PropertyFormValues {
  name: string;
  address: string;
  price: number;
  year: number;
  internalCode?: string;
  idOwner: string;
}

interface PropertyFormProps {
  onSubmit: (data: CreatePropertyDto | UpdatePropertyDto) => Promise<void>;
  onCancel?: () => void;
  initialData?: PropertyDto;
  isLoading?: boolean;
}

export function PropertyForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: PropertyFormProps) {
  const [owners, setOwners] = useState<OwnerDto[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PropertyFormValues>({
    defaultValues: initialData
      ? {
          name: initialData.name || '',
          address: initialData.address || '',
          price: initialData.price,
          year: initialData.year,
          internalCode: initialData.internalCode || '',
          idOwner: initialData.idOwner || '',
        }
      : undefined,
  });

  // Validación manual
  const validateForm = (data: PropertyFormValues) => {
    const errors: Record<string, string> = {};
    
    if (!data.name) errors.name = 'El nombre es requerido';
    if (!data.address) errors.address = 'La dirección es requerida';
    if (!data.price || data.price <= 0) errors.price = 'El precio debe ser mayor a 0';
    if (!data.year) errors.year = 'El año es requerido';
    if (data.year < 1900 || data.year > new Date().getFullYear()) {
      errors.year = 'El año debe estar entre 1900 y ' + new Date().getFullYear();
    }
    if (!data.idOwner) errors.idOwner = 'El propietario es requerido';
    return Object.keys(errors).length === 0;
  };

  // Cargar propietarios al montar el componente
  useEffect(() => {
    const loadOwners = async () => {
      setLoadingOwners(true);
      try {
        const ownersData = await api.owners.getAll();
        setOwners(ownersData || []);
      } catch (error) {
        console.error('Error al cargar propietarios:', error);
      } finally {
        setLoadingOwners(false);
      }
    };

    loadOwners();
  }, []);

  // Actualizar los valores del formulario cuando cambia initialData
  useEffect(() => {
    if (initialData) {
      console.log('Estableciendo datos iniciales en el formulario:', initialData);
      setValue('name', initialData.name || '');
      setValue('address', initialData.address || '');
      setValue('price', initialData.price);
      setValue('year', initialData.year);
      setValue('internalCode', initialData.internalCode || '');
      setValue('idOwner', initialData.idOwner || '');
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (data: PropertyFormValues) => {
    // Validar formulario manualmente
    if (!validateForm(data)) {
      return;
    }

    // Convertir string a número
    const formattedData = {
      ...data,
      price: Number(data.price),
      year: Number(data.year),
    };

    onSubmit(formattedData as CreatePropertyDto | UpdatePropertyDto).then(() => {
      if (!initialData) {
        // Si es un nuevo registro, limpiamos el formulario
        reset();
      }
    }).catch((error) => {
      console.error('Error al guardar la propiedad:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          label='Nombre de la propiedad'
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <Input
          label='Dirección'
          {...register('address')}
          error={errors.address?.message}
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Input
          label='Precio'
          type='number'
          step='0.01'
          min='0'
          {...register('price')}
          error={errors.price?.message}
          required
        />

        <Input
          label='Año'
          type='number'
          step='1'
          min='1900'
          max={new Date().getFullYear()}
          {...register('year')}
          error={errors.year?.message}
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          label='Código interno'
          {...register('internalCode')}
          error={errors.internalCode?.message}
        />

        <div className='w-full'>
          <label
            htmlFor='ownerId'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
          >
            Propietario <span className='text-red-500'>*</span>
          </label>
          <select
            id='idOwner'
            {...register('idOwner')}
            className='w-full px-3 py-2 border rounded-md shadow-sm'
            disabled={loadingOwners}
          >
            <option value=''>Seleccione un propietario</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
          {errors.idOwner && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
              {errors.idOwner.message}
            </p>
          )}
        </div>
      </div>

      <div className='flex justify-end space-x-2 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={() => onCancel ? onCancel() : reset()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type='submit' isLoading={isLoading}>
          {initialData ? 'Actualizar' : 'Crear'} Propiedad
        </Button>
      </div>
    </form>
  );
}
