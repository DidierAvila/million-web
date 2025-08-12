'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { PropertyDto, OwnerDto } from '@/types/api';
import Link from 'next/link';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/formatters';
import { DashboardStats } from '@/components/dashboard/DashboardStats';

export default function DashboardPage() {
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [owners, setOwners] = useState<OwnerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verificar si el usuario está autenticado
  useEffect(() => {
    // Verificar estado inicial de manera asíncrona
    const checkInitialAuth = async () => {
      const isAuth = await api.auth.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    checkInitialAuth();
    
    // Escuchar cambios en el estado de autenticación
    const handleAuthChange = async (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.isAuthenticated !== undefined) {
        setIsAuthenticated(customEvent.detail.isAuthenticated);
      } else {
        const isAuth = await api.auth.isAuthenticated();
        setIsAuthenticated(isAuth);
      }
    };
    
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Cargar propiedades y propietarios en paralelo
        const [propertiesData, ownersData] = await Promise.all([
          api.properties.getAll(),
          api.owners.getAll()
        ]);
        
        setProperties(propertiesData || []);
        setOwners(ownersData || []);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Ocurrió un error al cargar los datos. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Calcular estadísticas
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, property) => sum + property.price, 0);
  const totalOwners = owners.length;
  const avgPropertyPrice = totalProperties > 0 
    ? totalValue / totalProperties 
    : 0;

  // Obtener las propiedades más recientes
  const recentProperties = [...properties]
    .sort((a, b) => {
      // Ordenar por ID de forma descendente (asumiendo que IDs más altos son más recientes)
      // Si tu sistema usa fechas, podrías usar: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return b.id.localeCompare(a.id);
    })
    .slice(0, 4);
    
  // Obtener los propietarios más recientes
  const recentOwners = [...owners]
    .sort((a, b) => {
      // Ordenar por ID de forma descendente
      return b.id.localeCompare(a.id);
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className='container mx-auto py-8'>
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Dashboard
        </h1>
        {isAuthenticated && (
          <div className='flex space-x-2'>
            <Link href='/properties/new'>
              <Button variant='outline' size='sm'>
                Nueva Propiedad
              </Button>
            </Link>
            <Link href='/owners/new'>
              <Button size='sm'>
                Nuevo Propietario
              </Button>
            </Link>
          </div>
        )}
        {!isAuthenticated && (
          <div className="text-sm text-gray-600 dark:text-gray-400 italic">
            Inicia sesión para administrar propiedades y propietarios
          </div>
        )}
      </div>

      {error && (
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
          <p className='text-red-800 dark:text-red-400'>{error}</p>
        </div>
      )}

      {/* Estadísticas mejoradas utilizando el componente DashboardStats */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
          Estadísticas Generales
        </h2>
        <DashboardStats />
      </div>
      
      {/* Tarjetas de resumen */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Tarjeta: Total de propiedades */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-blue-500'>
          <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            Total de Propiedades
          </h3>
          <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
            {totalProperties}
          </p>
          <Link href='/properties' className='text-blue-600 hover:underline text-sm mt-2 inline-block'>
            Ver todas
          </Link>
        </div>

        {/* Tarjeta: Valor total */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-green-500'>
          <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            Valor Total
          </h3>
          <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
            {formatCurrency(totalValue)}
          </p>
        </div>

        {/* Tarjeta: Precio promedio */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-yellow-500'>
          <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            Precio Promedio
          </h3>
          <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
            {formatCurrency(avgPropertyPrice)}
          </p>
        </div>

        {/* Tarjeta: Total de propietarios */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 border-l-4 border-purple-500'>
          <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            Total de Propietarios
          </h3>
          <p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
            {totalOwners}
          </p>
          <Link href='/owners' className='text-blue-600 hover:underline text-sm mt-2 inline-block'>
            Ver todos
          </Link>
        </div>
      </div>

      {/* Sección de propiedades y propietarios recientes */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Propiedades recientes */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Propiedades Recientes
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                Últimas propiedades agregadas al sistema
              </p>
            </div>
            {isAuthenticated ? (
              <Link href='/properties'>
                <Button variant='outline' size='sm'>
                  Ver todas
                </Button>
              </Link>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">Vista pública</span>
            )}
          </div>

          {recentProperties.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {recentProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  showActions={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay propiedades registradas</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Comienza registrando tu primera propiedad en el sistema.
              </p>
              <div className="mt-4">
                {isAuthenticated ? (
                  <Link href='/properties/new'>
                    <Button size="sm">
                      <svg className="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Registrar propiedad
                    </Button>
                  </Link>
                ) : (
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Inicia sesión para añadir propiedades
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Propietarios recientes */}
        <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Propietarios Recientes
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                Últimos propietarios registrados
              </p>
            </div>
            {isAuthenticated ? (
              <Link href='/owners'>
                <Button variant='outline' size='sm'>
                  Ver todos
                </Button>
              </Link>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">Vista pública</span>
            )}
          </div>

          {recentOwners.length > 0 ? (
            <div className='divide-y divide-gray-200 dark:divide-gray-700'>
              {recentOwners.map((owner) => (
                <div key={owner.id} className='flex items-center py-3 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 rounded-md -mx-2'>
                  <div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300'>
                    {owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className='ml-4 flex-grow'>
                    <div className='text-sm font-medium text-gray-900 dark:text-white'>{owner.name}</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>{owner.address}</div>
                  </div>
                  {isAuthenticated ? (
                    <Link href={`/owners/${owner.id}`} className='ml-2 flex-shrink-0'>
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  ) : (
                    <div className="ml-2 flex-shrink-0 text-sm text-gray-400">Propietario</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700'>
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay propietarios registrados</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Comienza registrando tu primer propietario en el sistema.
              </p>
              <div className="mt-4">
                {isAuthenticated ? (
                  <Link href='/owners/new'>
                    <Button size="sm">
                      <svg className="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Registrar propietario
                    </Button>
                  </Link>
                ) : (
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Inicia sesión para añadir propietarios
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
