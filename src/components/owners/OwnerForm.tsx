'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateOwnerDto, OwnerDto, UpdateOwnerDto } from '@/types/api';
import { api } from '@/lib/api-client';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

// Esquema de validación para el formulario
const ownerFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  photo: z.string().optional(),
  birthdate: z.string().refine(value => {
    try {
      const date = new Date(value);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, { message: 'Fecha de nacimiento inválida' }),
});

type OwnerFormData = z.infer<typeof ownerFormSchema>;

interface OwnerFormProps {
  ownerId?: string;
  customSubmit?: (data: CreateOwnerDto | UpdateOwnerDto) => Promise<void>;
}

export default function OwnerForm({ ownerId, customSubmit }: OwnerFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<OwnerDto | null>(null);
  const router = useRouter();
  const isEditing = Boolean(ownerId);

  // Configurar React Hook Form con validación Zod
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<OwnerFormData>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: {
      name: '',
      address: '',
      photo: '',
      birthdate: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    }
  });

  // Cargar datos del propietario si estamos en modo edición
  useEffect(() => {
    const fetchOwnerData = async () => {
      if (ownerId) {
        try {
          setLoading(true);
          const data = await api.owners.getById(ownerId);
          setInitialData(data);
          
          // Formatear fecha para el input type="date" (YYYY-MM-DD)
          const formattedBirthdate = new Date(data.birthDate).toISOString().split('T')[0];
          
          // Establecer valores en el formulario
          setValue('name', data.name);
          setValue('address', data.address);
          setValue('photo', data.photo || '');
          setValue('birthdate', formattedBirthdate);
          
          setError(null);
        } catch (err) {
          console.error('Error al cargar datos del propietario:', err);
          setError('No se pudieron cargar los datos del propietario. Intente de nuevo más tarde.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOwnerData();
  }, [ownerId, setValue]);

  const handleFormSubmit = async (data: OwnerFormData) => {
    try {
      setLoading(true);
      
      const formattedData: CreateOwnerDto | UpdateOwnerDto = {
        name: data.name,
        address: data.address,
        photo: data.photo || undefined,
        birthdate: data.birthdate,
      };
      
      if (customSubmit) {
        // Usar la función de envío personalizada si se proporciona
        await customSubmit(formattedData);
      } else {
        // Usar la implementación predeterminada
        if (isEditing && ownerId) {
          await api.owners.update(ownerId, formattedData);
        } else {
          await api.owners.create(formattedData);
        }
        router.push('/owners');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error al guardar propietario:', err);
      setError('No se pudo guardar el propietario. Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !initialData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Cargando información del propietario...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nombre Completo"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Nombre completo del propietario"
            required
          />
          
          <Input
            label="Dirección"
            {...register('address')}
            error={errors.address?.message}
            placeholder="Dirección completa"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="URL de la Foto"
            type="url"
            {...register('photo')}
            error={errors.photo?.message}
            placeholder="https://ejemplo.com/foto.jpg"
          />
          
          <Input
            label="Fecha de Nacimiento"
            type="date"
            {...register('birthdate')}
            error={errors.birthdate?.message}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/owners')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading}>
            {isEditing ? 'Actualizar' : 'Crear'} Propietario
          </Button>
        </div>
      </form>
    </div>
  );
}
