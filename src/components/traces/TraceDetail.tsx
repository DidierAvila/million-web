'use client';

import { PropertyTraceDto, PropertyDto } from '@/types/api';
import { formatCurrency } from '@/lib/formatters';

interface TraceDetailProps {
  trace: PropertyTraceDto;
  property?: PropertyDto;
}

export function TraceDetail({ trace, property }: TraceDetailProps) {
  // Calcular el monto total (valor + impuesto)
  const totalAmount = trace.value + trace.tax;
  
  // Formatear la fecha
  const formattedDate = new Date(trace.dateSale).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Detalles de la Transacción
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID de Transacción</p>
            <p className="font-medium text-gray-900 dark:text-white">{trace.id}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Propiedad</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {property ? property.name : 'No disponible'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
            <p className="font-medium text-gray-900 dark:text-white">{trace.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
            <p className="font-medium text-gray-900 dark:text-white">{formattedDate}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Valor</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(trace.value)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Impuesto</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(trace.tax)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monto Total</p>
            <p className="font-medium text-green-600 dark:text-green-400">{formatCurrency(totalAmount)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fecha de Registro</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(trace.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
      
      {property && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Información de la Propiedad
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
                <p className="font-medium text-gray-900 dark:text-white">{property.address}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Precio Actual</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(property.price)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Año</p>
                <p className="font-medium text-gray-900 dark:text-white">{property.year}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Código Interno</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {property.internalCode || 'No asignado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
