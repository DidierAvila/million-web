'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/formatters';

interface ClientDateProps {
  date: string | null | undefined;
  format?: 'long' | 'short';
}

/**
 * Componente para formatear fechas de manera segura en el cliente
 * Esto evita errores de hidratación cuando se usa Intl.DateTimeFormat
 */
export function ClientDate({ date, format = 'long' }: ClientDateProps) {
  // Inicialmente mostramos una representación básica de la fecha
  const [formattedDate, setFormattedDate] = useState<string>(date || 'N/A');

  useEffect(() => {
    // Solo formateamos la fecha en el cliente
    if (date) {
      try {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          if (format === 'long') {
            setFormattedDate(formatDate(date));
          } else {
            // Formato corto sin hora
            setFormattedDate(
              new Intl.DateTimeFormat('es-CO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).format(dateObj)
            );
          }
        } else {
          setFormattedDate('Fecha inválida');
        }
      } catch (error) {
        console.error('Error al formatear la fecha:', error);
        setFormattedDate('Error de formato');
      }
    } else {
      setFormattedDate('N/A');
    }
  }, [date, format]);

  return <span>{formattedDate}</span>;
}
