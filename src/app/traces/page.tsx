'use client';

import { useState, useEffect } from 'react';
import { PropertyTraceDto, PropertyDto } from '@/types/api';
import { api } from '@/lib/api-client';
import { TraceList } from '@/components/traces/TraceList';
import { TraceFilter } from '@/components/traces/TraceFilter';
import Link from 'next/link';

export default function TracesPage() {
  const [traces, setTraces] = useState<(PropertyTraceDto & { propertyName?: string })[]>([]);
  const [filteredTraces, setFilteredTraces] = useState<(PropertyTraceDto & { propertyName?: string })[]>([]);
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  
  // Cargar todas las transacciones y propiedades al iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Primero obtenemos todas las propiedades
        const propertiesData = await api.properties.getAll();
        setProperties(propertiesData);
        
        // Luego obtenemos las trazas de cada propiedad
        const allTraces: (PropertyTraceDto & { propertyName?: string })[] = [];
        
        // Para cada propiedad, obtenemos sus trazas
        await Promise.all(propertiesData.map(async (property) => {
          try {
            const propertyTraces = await api.propertyTraces.getByPropertyId(property.id);
            // Añadimos el nombre de la propiedad a cada traza
            const tracesWithPropertyInfo = propertyTraces.map(trace => ({
              ...trace,
              propertyName: property.name
            }));
            allTraces.push(...tracesWithPropertyInfo);
          } catch (err) {
            console.error(`Error al cargar trazas para la propiedad ${property.id}:`, err);
          }
        }));
        
        // Ordenamos por fecha más reciente
        const sortedTraces = allTraces.sort((a, b) => 
          new Date(b.dateSale).getTime() - new Date(a.dateSale).getTime()
        );
        
        setTraces(sortedTraces);
        setFilteredTraces(sortedTraces);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos de transacciones. Intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Función para filtrar las trazas
  const handleFilter = (filters: { dateFrom?: Date; dateTo?: Date; propertyId?: string }) => {
    let filtered = [...traces];
    
    // Filtrar por propiedad
    if (filters.propertyId) {
      filtered = filtered.filter(trace => trace.propertyId === filters.propertyId);
    }
    
    // Filtrar por fecha desde
    if (filters.dateFrom) {
      filtered = filtered.filter(trace => 
        new Date(trace.dateSale) >= filters.dateFrom!
      );
    }
    
    // Filtrar por fecha hasta
    if (filters.dateTo) {
      filtered = filtered.filter(trace => 
        new Date(trace.dateSale) <= filters.dateTo!
      );
    }
    
    setFilteredTraces(filtered);
  };
  
  // Función para resetear los filtros
  const resetFilters = () => {
    setFilteredTraces(traces);
    setDateRange({});
    setSelectedProperty('');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Historial de Transacciones
        </h1>
        <Link 
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Volver al Dashboard
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <TraceFilter 
        properties={properties} 
        onFilter={handleFilter}
        onReset={resetFilters}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      
      <TraceList 
        traces={filteredTraces} 
        loading={loading} 
      />
    </div>
  );
}
