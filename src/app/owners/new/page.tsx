'use client';

import OwnerForm from '@/components/owners/OwnerForm';

export default function NewOwnerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Crear Nuevo Propietario</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <OwnerForm />
        </div>
      </div>
    </div>
  );
}
