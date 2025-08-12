import { z } from 'zod';

// Esquema de validación para login
export const loginSchema = z.object({
  userName: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Esquema de validación para crear/editar propietarios
export const ownerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  birthDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, { message: 'Fecha de nacimiento inválida' }),
});

// Esquema de validación para crear/editar propiedades
export const propertySchema = z.object({
  name: z.string().min(1, 'El nombre de la propiedad es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  price: z.coerce.number()
    .min(0.01, 'El precio debe ser mayor a 0'),
  taxes: z.coerce.number()
    .min(0, 'Los impuestos no pueden ser negativos'),
  year: z.coerce.number()
    .int('El año debe ser un número entero')
    .min(1900, 'El año no puede ser anterior a 1900')
    .max(new Date().getFullYear(), `El año no puede ser mayor a ${new Date().getFullYear()}`),
  internalCode: z.string().optional(),
  ownerId: z.string().min(1, 'El propietario es requerido'),
});

// Esquema de validación para crear/editar imágenes de propiedades
export const propertyImageSchema = z.object({
  idProperty: z.string().min(1, 'La propiedad es requerida'),
  file: z.string().min(1, 'La imagen es requerida'),
  enabled: z.boolean().default(true),
});

// Esquema de validación para crear trazabilidad
export const propertyTraceSchema = z.object({
  propertyId: z.string().min(1, 'La propiedad es requerida'),
  saleDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, { message: 'Fecha de venta inválida' }),
  value: z.coerce.number()
    .min(0.01, 'El valor debe ser mayor a 0'),
});

// Tipo para filtros de propiedades
export const propertyFiltersSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

// Tipo para filtros de fecha para trazabilidad
export const dateRangeSchema = z.object({
  startDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, { message: 'Fecha de inicio inválida' }),
  endDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, { message: 'Fecha de fin inválida' }),
});
