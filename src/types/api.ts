// Tipos para autenticación
export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string; // name en la API
  lastName: string;
  role: string; // Admin, User
  phone: string;
  notificationType: string; // Email, Sms, Push
}

// Tipos para Owner
export interface OwnerDto {
  id: string;
  name: string;
  address: string;
  photo?: string;
  birthDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOwnerDto {
  name: string;
  address: string;
  photo?: string;
  birthdate: string;
}

export interface UpdateOwnerDto {
  name: string;
  address: string;
  photo?: string;
  birthdate: string;
}

// Tipos para Property
export interface PropertyDto {
  id: string;
  name: string;
  address: string;
  price: number;
  year: number;
  internalCode?: string;
  idOwner: string; 
  ownerName?: string;
}

export interface CreatePropertyDto {
  name: string;
  address: string;
  price: number;
  taxes: number;
  year: number;
  internalCode?: string;
  idOwner: string;
}

export interface UpdatePropertyDto {
  name: string;
  address: string;
  price: number;
  taxes: number;
  year: number;
  internalCode?: string;
  idOwner: string;
}

// Tipos para PropertyImage
export interface PropertyImageDto {
  id: string;
  propertyId: string;
  imageUrl?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyImageDto {
  propertyId: string;
  imageUrl?: string;
  enabled: boolean;
}

// Tipos para PropertyTrace
export interface PropertyTraceDto {
  id: string;
  propertyId: string;
  dateSale: string;
  name: string;
  value: number;
  tax: number;
  createdAt: string;
}

export interface CreatePropertyTraceDto {
  propertyId: string;
  dateSale: string;
  name: string;
  value: number;
  tax: number;
}
