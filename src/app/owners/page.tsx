'use client';

import React from 'react';
import { OwnerList } from '@/components/owners/OwnerListView';
import { api } from '@/lib/api-client';

export default function OwnersPage() {
  const handleDelete = async (id: string) => {
    try {
      await api.owners.delete(id);
      return Promise.resolve();
    } catch (error) {
      console.error('Error al eliminar propietario:', error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <OwnerList onDelete={handleDelete} />
    </div>
  );
}
