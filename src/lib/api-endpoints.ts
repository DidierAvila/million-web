'use client';

/**
 * Configuración centralizada de los endpoints de la API
 * Este archivo define todas las rutas de la API utilizadas en el proyecto
 */

// URL base de la API
// Asegúrate de que esta URL coincida con la URL donde se está ejecutando tu API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7154';
// Si tienes problemas de CORS en desarrollo, puedes usar un proxy relativo:
// export const API_BASE_URL = '';
const API_URL = `${API_BASE_URL}/api`;
const PATH_AUTHENTICATION = `${API_URL}/Authentication`;
const PATH_OWNER = `${API_URL}/Owners`;
const PATH_PROPERTY = `${API_URL}/Properties`;
const PATH_PROPERTY_IMAGE = `${API_URL}/PropertyImages`;
const PATH_PROPERTY_TRACE = `${API_URL}/PropertyTraces`;

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: `${PATH_AUTHENTICATION}/Login`,
  REGISTER: `${PATH_AUTHENTICATION}/Register`,
};

// Endpoints de propietarios
export const OWNER_ENDPOINTS = {
  BASE: `${PATH_OWNER}`,
  GET_BY_ID: (id: string) => `${PATH_OWNER}/${id}`,
  FILTER_BY_NAME: (name: string) => `${PATH_OWNER}?name=${encodeURIComponent(name)}`,
  GET_WITH_PROPERTIES: (id: string) => `${PATH_OWNER}/${id}/properties`,
  CREATE: `${PATH_OWNER}`,
  UPDATE: (id: string) => `${PATH_OWNER}/${id}`,
  DELETE: (id: string) => `${PATH_OWNER}/${id}`,
};

// Endpoints de propiedades
export const PROPERTY_ENDPOINTS = {
  BASE: `${PATH_PROPERTY}`,
  GET_BY_ID: (id: string) => `${PATH_PROPERTY}/${id}`,
  GET_BY_OWNER_ID: (ownerId: string) => `${PATH_PROPERTY}/owner/${ownerId}`,
  FILTER: (params: {name?: string, address?: string, minPrice?: number, maxPrice?: number}) => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append('name', params.name);
    if (params.address) queryParams.append('address', params.address);
    if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
    return `${PATH_PROPERTY}?${queryParams.toString()}`;
  },
  CREATE: `${PATH_PROPERTY}`,
  UPDATE: (id: string) => `${PATH_PROPERTY}/${id}`,
  DELETE: (id: string) => `${PATH_PROPERTY}/${id}`,
};

// Endpoints de imágenes de propiedades
export const PROPERTY_IMAGE_ENDPOINTS = {
  BASE: `${PATH_PROPERTY_IMAGE}`,
  GET_BY_PROPERTY_ID: (propertyId: string) => `${PATH_PROPERTY_IMAGE}/property/${propertyId}`,
  CREATE: `${PATH_PROPERTY_IMAGE}`,
  DELETE: (id: string) => `${PATH_PROPERTY_IMAGE}/${id}`,
};

// Endpoints de trazas de propiedades
export const PROPERTY_TRACE_ENDPOINTS = {
  BASE: `${PATH_PROPERTY_TRACE}`,
  GET_BY_PROPERTY_ID: (propertyId: string) => `${PATH_PROPERTY_TRACE}/property/${propertyId}`,
  CREATE: `${PATH_PROPERTY_TRACE}`,
};

// Exportar todos los endpoints como un objeto único para facilitar importaciones
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  OWNER: OWNER_ENDPOINTS,
  PROPERTY: PROPERTY_ENDPOINTS,
  PROPERTY_IMAGE: PROPERTY_IMAGE_ENDPOINTS,
  PROPERTY_TRACE: PROPERTY_TRACE_ENDPOINTS,
};

export default API_ENDPOINTS;
