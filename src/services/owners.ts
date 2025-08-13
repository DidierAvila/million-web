'use client';

// Eliminamos la importación no utilizada de api
import { getAuthHeaders } from '@/lib/auth-headers';
import { OwnerDto } from '@/types/api';

/**
 * Servicio para manejar operaciones de propietarios con autenticación y rol
 */
export const OwnerService = {
  /**
   * Obtiene todos los propietarios
   */
  getAll: async (): Promise<OwnerDto[]> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Owners`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener propietarios: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener propietarios:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un propietario por su ID
   */
  getById: async (id: string): Promise<OwnerDto> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Owners/${id}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener propietario: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error al obtener propietario con ID: ${id}`, error);
      throw error;
    }
  },
  
  /**
   * Crea un nuevo propietario
   */
  create: async (owner: Omit<OwnerDto, 'id'>): Promise<OwnerDto> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Owners`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(owner)
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear propietario: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al crear propietario:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza un propietario existente
   */
  update: async (id: string, owner: Partial<OwnerDto>): Promise<OwnerDto> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Owners/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(owner)
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar propietario: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error al actualizar propietario con ID: ${id}`, error);
      throw error;
    }
  },
  
  /**
   * Elimina un propietario
   */
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Owners/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error al eliminar propietario: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error al eliminar propietario con ID: ${id}`, error);
      throw error;
    }
  }
};
