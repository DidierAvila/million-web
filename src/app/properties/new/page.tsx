'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { api } from '@/lib/api-client';
import { CreatePropertyDto } from '@/types/api';

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreatePropertyDto) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await api.properties.create(data);
      router.push('/properties');
    } catch (err) {
      console.error('Error al crear la propiedad:', err);
      setError('Ocurrió un error al crear la propiedad. Por favor, intente nuevamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-8'>
        Nueva Propiedad
      </h1>

      {error && (
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
          <p className='text-red-800 dark:text-red-400'>{error}</p>
        </div>
      )}

      <div className='bg-white dark:bg-gray-900 shadow rounded-lg p-6'>
        <PropertyForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}
