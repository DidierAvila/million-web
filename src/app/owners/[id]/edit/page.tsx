'use client';

import { useParams } from 'next/navigation';
import OwnerForm from '@/components/owners/OwnerForm';

export default function EditOwnerPage() {
  const { id } = useParams() as { id: string };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Propietario</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <OwnerForm ownerId={id} />
        </div>
      </div>
    </div>
  );
}
