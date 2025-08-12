'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PropertyTraceDto, PropertyDto } from '@/types/api';
import { api } from '@/lib/api-client';
import { TraceDetail } from '@/components/traces/TraceDetail';
import Link from 'next/link';

export default function TraceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trace, setTrace] = useState<PropertyTraceDto | null>(null);
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTraceData = async () => {
      if (!id) {
        setError('ID de transacción no especificado');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Primero necesitamos encontrar esta traza entre todas las propiedades
        // ya que no hay un endpoint directo para obtener una traza por ID
        const properties = await api.properties.getAll();
        
        let foundTrace: PropertyTraceDto | null = null;
        let relatedProperty: PropertyDto | null = null;
        
        // Para cada propiedad, buscamos la traza con el ID especificado
        for (const prop of properties) {
          try {
            const traces = await api.propertyTraces.getByPropertyId(prop.id);
            const matchingTrace = traces.find(t => t.id === id);
            
            if (matchingTrace) {
              foundTrace = matchingTrace;
              relatedProperty = prop;
              break;
            }
          } catch (err) {
            console.error(`Error al cargar trazas para la propiedad ${prop.id}:`, err);
          }
        }
        
        if (foundTrace) {
          setTrace(foundTrace);
          setProperty(relatedProperty);
        } else {
          setError('No se encontró la transacción especificada');
        }
      } catch (err) {
        console.error('Error al cargar datos de la transacción:', err);
        setError('No se pudieron cargar los datos de la transacción. Intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTraceData();
  }, [id]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Detalle de Transacción
        </h1>
        <div className="flex gap-2">
          <Link 
            href="/traces"
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Volver a Transacciones
          </Link>
          {property && (
            <Link 
              href={`/properties/${property.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver Propiedad
            </Link>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/traces')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Volver a la lista de transacciones
          </button>
        </div>
      ) : trace ? (
        <TraceDetail trace={trace} property={property || undefined} />
      ) : null}
    </div>
  );
}
