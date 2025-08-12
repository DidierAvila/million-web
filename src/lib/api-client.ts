'use client';

import axios from 'axios';
import { 
  LoginRequest, LoginResponse, RegisterRequest, 
  OwnerDto, CreateOwnerDto, UpdateOwnerDto,
  PropertyDto, CreatePropertyDto, UpdatePropertyDto,
  PropertyImageDto, CreatePropertyImageDto, 
  PropertyTraceDto, CreatePropertyTraceDto
} from '@/types/api';
import { API_BASE_URL, API_ENDPOINTS } from './api-endpoints';

// Configuración básica del cliente Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las solicitudes
if (typeof window !== 'undefined') {
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// Cliente de autenticación
const authClient = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      // Usar el servicio simulado para desarrollo
      const { AuthService } = await import('@/services/auth');
      return await AuthService.login(credentials);
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<void> => {
    try {
      console.log('Registrando usuario:', { ...userData, password: '***' });
      
      // Use the AuthService for registration
      const { AuthService } = await import('@/services/auth');
      const result = await AuthService.register(userData);
      
      if (!result) {
        throw new Error('No se pudo completar el registro');
      }
      
      // Registration successful
      return;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // Emitir evento de cambio de autenticación
      const authEvent = new CustomEvent('auth-state-changed', { 
        detail: { 
          isAuthenticated: false,
          user: null
        } 
      });
      window.dispatchEvent(authEvent);
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    try {
      // Importar funciones de manera dinámica
      const { isTokenExpired } = await import('@/lib/jwt-helpers');
      
      // Verificar si el token ha expirado
      if (isTokenExpired(token)) {
        console.warn('El token ha expirado, cerrando sesión...');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  },
  
  getUserInfo: () => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    // Definir el tipo de usuario
    type UserInfo = {
      userId?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      userName?: string;
      role?: string;
      [key: string]: string | undefined;
    };
    
    // Primero verificar si hay un token válido
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token disponible');
      return null;
    }
    
    // Intentar obtener la información del usuario del localStorage primero
    const userInfoStr = localStorage.getItem('userInfo');
    
    let userInfo: UserInfo | null = null;
    
    // Si tenemos información en localStorage, usarla
    if (userInfoStr) {
      try {
        userInfo = JSON.parse(userInfoStr) as UserInfo;
      } catch (error) {
        console.error('Error parsing user info from localStorage:', error);
      }
    }
    
    // Si no hay información en localStorage o está incompleta, extraerla del token
    if (!userInfo || !userInfo.firstName) {
      try {
        // Importamos las funciones de manera dinámica para evitar problemas con SSR
        // Usamos una función inmediatamente ejecutada para poder usar async/await
        (async () => {
          const { getUserNameFromToken } = await import('@/lib/jwt-helpers');
          if (token) {
            const tokenInfo = getUserNameFromToken(token);
            
            if (tokenInfo) {
              // Si no teníamos información del usuario, usamos la del token
              if (!userInfo) {
                userInfo = tokenInfo;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
              } 
              // Si teníamos información pero faltaban campos, los complementamos
              else {
                const updatedInfo: UserInfo = { ...userInfo };
                let updated = false;
                
                const fields = ['firstName', 'lastName', 'email', 'userId', 'userName'] as const;
                fields.forEach(field => {
                  if ((!updatedInfo[field] || updatedInfo[field] === '') && tokenInfo && tokenInfo[field]) {
                    updatedInfo[field] = tokenInfo[field];
                    updated = true;
                  }
                });
                
                if (updated) {
                  userInfo = updatedInfo;
                  localStorage.setItem('userInfo', JSON.stringify(userInfo));
                }
              }
              
              // Notificar el cambio de información de usuario
              window.dispatchEvent(new CustomEvent('auth-state-changed', { 
                detail: { 
                  isAuthenticated: true,
                  user: userInfo
                }
              }));
            }
          }
        })(); // Agregar los paréntesis para ejecutar la IIFE
      } catch (error) {
        console.error('Error getting user info from token:', error);
      }
    }
    
    return userInfo;
  }
};

// Cliente de propietarios
const ownersClient = {
  getAll: async (): Promise<OwnerDto[]> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.OWNER.BASE);
      return response.data;
    } catch (error) {
      console.error('Error al obtener propietarios:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<OwnerDto> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.OWNER.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error al obtener propietario con ID: ${id}`, error);
      throw error;
    }
  },
  
  getByName: async (name: string): Promise<OwnerDto[]> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.OWNER.FILTER_BY_NAME(name));
      return response.data;
    } catch (error) {
      console.error(`Error al obtener propietarios con nombre: ${name}`, error);
      throw error;
    }
  },
  
  getWithProperties: async (id: string): Promise<OwnerDto> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.OWNER.GET_WITH_PROPERTIES(id));
      return response.data;
    } catch (error) {
      console.error(`Error al obtener propietario con propiedades, ID: ${id}`, error);
      throw error;
    }
  },

  create: async (owner: CreateOwnerDto): Promise<OwnerDto> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.OWNER.CREATE, owner);
      return response.data;
    } catch (error) {
      console.error('Error al crear propietario:', error);
      throw error;
    }
  },

  update: async (id: string, owner: UpdateOwnerDto): Promise<OwnerDto> => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.OWNER.UPDATE(id), owner);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar propietario con ID: ${id}`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.OWNER.DELETE(id));
    } catch (error) {
      console.error(`Error al eliminar propietario con ID: ${id}`, error);
      throw error;
    }
  }
};

// Cliente de propiedades
const propertiesClient = {
  getAll: async (): Promise<PropertyDto[]> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PROPERTY.BASE);
      return response.data;
    } catch (error) {
      console.error('Error al obtener propiedades:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<PropertyDto> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PROPERTY.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error al obtener propiedad con ID: ${id}`, error);
      throw error;
    }
  },
  
  getByOwnerId: async (ownerId: string): Promise<PropertyDto[]> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PROPERTY.GET_BY_OWNER_ID(ownerId));
      return response.data;
    } catch (error) {
      console.error(`Error al obtener propiedades del propietario con ID: ${ownerId}`, error);
      throw error;
    }
  },
  
  filter: async (params: {name?: string, address?: string, minPrice?: number, maxPrice?: number}): Promise<PropertyDto[]> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PROPERTY.FILTER(params));
      return response.data;
    } catch (error) {
      console.error('Error al filtrar propiedades:', error);
      throw error;
    }
  },

  create: async (property: CreatePropertyDto): Promise<PropertyDto> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PROPERTY.CREATE, property);
      return response.data;
    } catch (error) {
      console.error('Error al crear propiedad:', error);
      throw error;
    }
  },

  update: async (id: string, property: UpdatePropertyDto): Promise<PropertyDto> => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.PROPERTY.UPDATE(id), property);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar propiedad con ID: ${id}`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.PROPERTY.DELETE(id));
    } catch (error) {
      console.error(`Error al eliminar propiedad con ID: ${id}`, error);
      throw error;
    }
  }
};

// Cliente de imágenes de propiedades
const propertyImagesClient = {
  getByPropertyId: async (propertyId: string): Promise<PropertyImageDto[]> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PROPERTY_IMAGE.GET_BY_PROPERTY_ID(propertyId));
      return response.data;
    } catch (error) {
      console.error(`Error al obtener imágenes para la propiedad: ${propertyId}`, error);
      throw error;
    }
  },

  create: async (image: CreatePropertyImageDto): Promise<PropertyImageDto> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PROPERTY_IMAGE.CREATE, image);
      return response.data;
    } catch (error) {
      console.error('Error al crear imagen de propiedad:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.PROPERTY_IMAGE.DELETE(id));
    } catch (error) {
      console.error(`Error al eliminar imagen con ID: ${id}`, error);
      throw error;
    }
  }
};

// Cliente de trazas de propiedades
const propertyTracesClient = {
  getByPropertyId: async (propertyId: string): Promise<PropertyTraceDto[]> => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PROPERTY_TRACE.GET_BY_PROPERTY_ID(propertyId));
      return response.data;
    } catch (error) {
      console.error(`Error al obtener trazas para la propiedad: ${propertyId}`, error);
      throw error;
    }
  },

  create: async (trace: CreatePropertyTraceDto): Promise<PropertyTraceDto> => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PROPERTY_TRACE.CREATE, trace);
      return response.data;
    } catch (error) {
      console.error('Error al crear traza de propiedad:', error);
      throw error;
    }
  }
};

// API unificada
export const api = {
  auth: authClient,
  owners: ownersClient,
  properties: propertiesClient,
  propertyImages: propertyImagesClient,
  propertyTraces: propertyTracesClient
};
