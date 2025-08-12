'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OwnerDto } from '@/types/api';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/formatters';
import { Button } from '../ui/Button';

interface OwnerListProps {
  owners?: OwnerDto[];
  onDelete?: (id: string) => Promise<void>;
}

export function OwnerList({ owners: initialOwners, onDelete }: OwnerListProps) {
  const [owners, setOwners] = useState<OwnerDto[]>(initialOwners || []);
  const [loading, setLoading] = useState(!initialOwners);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOwners = async () => {
    if (initialOwners) return;
    
    try {
      setLoading(true);
      const data = await api.owners.getAll();
      setOwners(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar propietarios:', err);
      setError('No se pudieron cargar los propietarios. Intente de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleNameSearch = async () => {
    if (!searchName.trim()) {
      fetchOwners();
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await api.owners.getByName(searchName);
      setOwners(results);
      setError(null);
    } catch (err) {
      console.error('Error al buscar propietarios por nombre:', err);
      setError('No se pudieron buscar propietarios por nombre. Intente de nuevo más tarde.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const resetSearch = () => {
    setSearchName('');
    fetchOwners();
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    setDeletingId(id);
    try {
      await onDelete(id);
      setOwners(owners.filter(owner => owner.id !== id));
    } catch (err) {
      console.error('Error al eliminar propietario:', err);
      setError('No se pudo eliminar el propietario.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Cargando propietarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (owners.length === 0) {
    return (
      <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
          No hay propietarios disponibles
        </h3>
        <p className='text-gray-500 dark:text-gray-400 mb-4'>
          No se encontraron propietarios registrados en el sistema.
        </p>
        <Link href='/owners/new'>
          <Button>Registrar nuevo propietario</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Encabezado con botón de crear */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Lista de Propietarios
        </h2>
        <Link href="/owners/new">
          <Button className="bg-green-600 hover:bg-green-700">
            Nuevo Propietario
          </Button>
        </Link>
      </div>
      
      {/* Sección de búsqueda */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar por nombre</label>
            <div className="flex">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Nombre del propietario"
                className="flex-1 border rounded-l-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={handleNameSearch}
                disabled={isSearching}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md disabled:bg-gray-300"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
          
          <div className="self-end">
            <Button 
              onClick={resetSearch}
              variant="outline"
            >
              Mostrar todos
            </Button>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
          <thead className='bg-gray-50 dark:bg-gray-800'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Nombre
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Dirección
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Fecha de Nacimiento
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'>
            {owners.map((owner) => (
              <tr key={owner.id} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                  <div className="flex items-center">
                    {owner.photo && (
                      <div className="flex-shrink-0 h-10 w-10 mr-4">
                        <Image 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={owner.photo} 
                          alt={`Foto de ${owner.name}`}
                          width={40}
                          height={40} 
                        />
                      </div>
                    )}
                    {owner.name}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                  {owner.address}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                  {formatDate(owner.birthDate)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2'>
                  <Link href={`/owners/${owner.id}`}>
                    <Button size='sm' variant='outline'>
                      Ver
                    </Button>
                  </Link>
                  <Link href={`/owners/${owner.id}/edit`}>
                    <Button size='sm' variant='outline'>
                      Editar
                    </Button>
                  </Link>
                  {onDelete && (
                    <Button
                      size='sm'
                      variant='outline'
                      className='text-red-500 hover:text-red-700'
                      disabled={deletingId === owner.id}
                      onClick={() => handleDelete(owner.id)}
                    >
                      {deletingId === owner.id ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
