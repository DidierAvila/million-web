'use client';

import { PropertyDto } from '@/types/api';
import { useState } from 'react';

interface TraceFilterProps {
  properties: PropertyDto[];
  onFilter: (filters: { dateFrom?: Date; dateTo?: Date; propertyId?: string }) => void;
  onReset: () => void;
  selectedProperty: string;
  setSelectedProperty: (id: string) => void;
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
}

export function TraceFilter({ 
  properties, 
  onFilter, 
  onReset,
  selectedProperty,
  setSelectedProperty,
  dateRange,
  setDateRange
}: TraceFilterProps) {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filters: { dateFrom?: Date; dateTo?: Date; propertyId?: string } = {};
    
    if (selectedProperty) {
      filters.propertyId = selectedProperty;
    }
    
    if (fromDate) {
      filters.dateFrom = new Date(fromDate);
      setDateRange({ ...dateRange, from: new Date(fromDate) });
    }
    
    if (toDate) {
      filters.dateTo = new Date(toDate);
      // Asegurarnos que la fecha incluya el día completo
      filters.dateTo.setHours(23, 59, 59, 999);
      setDateRange({ ...dateRange, to: new Date(toDate) });
    }
    
    onFilter(filters);
  };
  
  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setSelectedProperty('');
    onReset();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Filtrar Transacciones</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:gap-4">
        <div className="md:w-[calc(33%-1rem)]">
          <label htmlFor="property" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Propiedad
          </label>
          <select
            id="property"
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Todas las propiedades</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:w-[calc(33%-1rem)]">
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fecha Desde
          </label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="md:w-[calc(33%-1rem)]">
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fecha Hasta
          </label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="w-full flex gap-2 justify-end pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Aplicar Filtros
          </button>
        </div>
      </form>
    </div>
  );
}
