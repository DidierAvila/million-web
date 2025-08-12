'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/formatters';
import { PropertyDto } from '@/types/api';

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, description, icon }: StatsCardProps) => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="p-3 rounded-md bg-blue-500 bg-opacity-10">
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </dt>
          <dd className="flex items-baseline">
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </div>
            {description && (
              <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </div>
            )}
          </dd>
        </div>
      </div>
    </div>
  </div>
);

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalOwners: 0,
    averagePrice: 0,
    totalSales: 0,
    recentTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // En un escenario real, podrías tener un endpoint específico para estadísticas
        // Aquí simulamos calculándolas desde múltiples endpoints
        const [properties, owners] = await Promise.all([
          api.properties.getAll(),
          api.owners.getAll(),
        ]);

        const totalProperties = properties?.length || 0;
        
        // Calcular precio promedio si hay propiedades
        let avgPrice = 0;
        if (totalProperties > 0) {
          avgPrice = properties.reduce((sum: number, prop: PropertyDto) => sum + prop.price, 0) / totalProperties;
        }
        
        // Obtener todas las transacciones para cada propiedad
        const allTransactions = [];
        for (const property of properties) {
          try {
            const propertyTraces = await api.propertyTraces.getByPropertyId(property.id);
            allTransactions.push(...propertyTraces);
          } catch (err) {
            console.error(`Error al cargar trazas para la propiedad ${property.id}:`, err);
          }
        }
        
        // Ordenar transacciones por fecha
        allTransactions.sort((a, b) => new Date(b.dateSale).getTime() - new Date(a.dateSale).getTime());
        
        // Calcular transacciones recientes (últimos 30 días)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentTransactions = allTransactions.filter(
          trace => new Date(trace.dateSale) >= thirtyDaysAgo
        ).length;

        setStats({
          totalProperties,
          totalOwners: owners?.length || 0,
          averagePrice: avgPrice,
          totalSales: allTransactions.length,
          recentTransactions: recentTransactions,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Total Propiedades"
        value={stats.totalProperties.toString()}
        icon={
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        }
      />

      <StatsCard
        title="Total Propietarios"
        value={stats.totalOwners.toString()}
        icon={
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        }
      />

      <StatsCard
        title="Precio Promedio"
        value={formatCurrency(stats.averagePrice)}
        icon={
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />

      <StatsCard
        title="Total Transacciones"
        value={stats.totalSales.toString()}
        icon={
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        }
      />

      <StatsCard
        title="Transacciones Recientes"
        value={stats.recentTransactions.toString()}
        description="últimos 30 días"
        icon={
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        }
      />
    </div>
  );
};
