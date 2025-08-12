'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { OwnerDto, PropertyDto } from '@/types/api';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/formatters';

interface OwnerDetailProps {
  id: string;
}

export default function OwnerDetail({ id }: OwnerDetailProps) {
  const [owner, setOwner] = useState<OwnerDto | null>(null);
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        setLoading(true);
        
        // Usar el nuevo endpoint que trae el propietario con sus propiedades
        try {
          const ownerWithProperties = await api.owners.getWithProperties(id);
          setOwner(ownerWithProperties);
          
          // Si el endpoint retorna las propiedades como parte del objeto propietario
          // setProperties(ownerWithProperties.properties || []);
          
          // En caso que aún necesitemos obtener las propiedades por separado
          const ownerProperties = await api.properties.getByOwnerId(id);
          setProperties(ownerProperties);
        } catch (detailErr) {
          console.error('Error al cargar propietario con propiedades:', detailErr);
          
          // Caer en modo de respaldo si la nueva API falla
          const ownerData = await api.owners.getById(id);
          setOwner(ownerData);
          
          try {
            const ownerProperties = await api.properties.getByOwnerId(id);
            setProperties(ownerProperties);
          } catch (propErr) {
            console.error('Error al cargar propiedades del propietario:', propErr);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos del propietario:', err);
        setError('No se pudieron cargar los datos del propietario. Intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOwnerData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('¿Está seguro de que desea eliminar este propietario?')) {
      return;
    }
    
    try {
      await api.owners.delete(id);
      router.push('/owners');
    } catch (err) {
      console.error('Error al eliminar propietario:', err);
      setError('No se pudo eliminar el propietario. Intente de nuevo más tarde.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold">Cargando información del propietario...</div>
      </div>
    );
  }

  if (error || !owner) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error || 'No se encontró el propietario'}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Detalles del Propietario</h2>
            <div className="space-x-2">
              <Link 
                href={`/owners/${id}/edit`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 h-10 py-2 px-4"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 h-10 py-2 px-4"
              >
                Eliminar
              </button>
              <Link 
                href="/owners"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 h-10 py-2 px-4"
              >
                Volver
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {owner.photo && owner.photo.trim() !== '' ? (
                <Image 
                  src={owner.photo} 
                  alt={`Foto de ${owner.name}`}
                  className="w-full h-auto rounded-lg shadow-md"
                  width={300}
                  height={300}
                  onError={(e) => {
                    // Fallback si la imagen no se puede cargar
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.style.display = 'none';
                    const parent = imgElement.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="bg-gray-200 w-full h-64 rounded-lg flex items-center justify-center"><span class="text-gray-500">Error al cargar imagen</span></div>';
                    }
                  }}
                />
              ) : (
                <div className="bg-gray-200 w-full h-64 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Sin foto</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
                  <p className="mt-1 text-lg">{owner.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Fecha de Nacimiento</h3>
                  <p className="mt-1 text-lg">{formatDate(owner.birthDate)}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                  <p className="mt-1 text-lg">{owner.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Creado</h3>
                  <p className="mt-1 text-sm text-gray-600">{formatDate(owner.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Actualizado</h3>
                  <p className="mt-1 text-sm text-gray-600">{formatDate(owner.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección para propiedades asociadas al propietario */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Propiedades asociadas</h3>
            {properties.length === 0 ? (
              <p className="text-gray-500">Este propietario no tiene propiedades asociadas.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <Link 
                    key={property.id} 
                    href={`/properties/${property.id}`}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg"
                  >
                    <h4 className="text-lg font-semibold">{property.name}</h4>
                    <p className="text-gray-600">{property.address}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
