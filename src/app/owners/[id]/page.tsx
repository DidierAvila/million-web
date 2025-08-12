'use client';

import { useParams } from 'next/navigation';
import OwnerDetail from '@/components/owners/OwnerDetail';

export default function OwnerDetailPage() {
  const { id } = useParams() as { id: string };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Detalle del Propietario</h1>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <OwnerDetail id={id} />
        </div>
      </div>
    </div>
  );
}
