'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { RegisterRequest } from '@/types/api';

// Define a schema for registration validation
const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
    .max(255, 'El email es demasiado largo'),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es demasiado largo'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .max(100, 'El apellido es demasiado largo'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
  confirmPassword: z
    .string()
    .min(1, 'La confirmación de contraseña es requerida'),
  role: z
    .string()
    .min(1, 'El rol es requerido'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .max(20, 'El número de teléfono es demasiado largo'),
  notificationType: z
    .string()
    .min(1, 'El tipo de notificación es requerido'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Eliminamos la definición de tipo que no se está usando
// type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    name: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: 'User', // Default role
    phone: '',
    notificationType: 'Email', // Default notification type
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast, ToastContainer } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing in a field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    try {
      registerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        
        // Forma simplificada de procesar los errores
        for (const issue of error.issues) {
          if (issue.path.length > 0) {
            // Convertir el primer elemento de path a string
            const fieldName = String(issue.path[0]);
            // Usar solo el primer error para cada campo
            if (!newErrors[fieldName]) {
              newErrors[fieldName] = issue.message;
            }
          }
        }
        
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('Iniciando proceso de registro...');
      // Eliminamos la importación no utilizada
      // const { AuthService } = await import('@/services/auth');
      
      // Use the API client to register
      const api = await import('@/lib/api-client');
      await api.api.auth.register(formData);
      
      // Show success message
      showToast('Registro exitoso. Puedes iniciar sesión ahora.', 'success');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      console.error('Error en el registro:', err);
      const errorMessage = 
        err instanceof Error ? err.message : 
        'Error al registrar. Por favor, intente nuevamente.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-8'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Crear cuenta
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Complete el formulario para registrarse
          </p>
        </div>

        {error && (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
            <p className='text-red-800 dark:text-red-400'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            label='Correo electrónico'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete='email'
            placeholder='usuario@example.com'
            error={errors.email}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label='Nombre'
              name='name'
              type='text'
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete='given-name'
              error={errors.name}
            />

            <Input
              label='Apellido'
              name='lastName'
              type='text'
              value={formData.lastName}
              onChange={handleChange}
              required
              autoComplete='family-name'
              error={errors.lastName}
            />
          </div>

          <Input
            label='Contraseña'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete='new-password'
            error={errors.password}
          />

          <Input
            label='Confirmar contraseña'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete='new-password'
            error={errors.confirmPassword}
          />

          <Input
            label='Teléfono'
            name='phone'
            type='tel'
            value={formData.phone}
            onChange={handleChange}
            required
            autoComplete='tel'
            placeholder='+1234567890'
            error={errors.phone}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='w-full'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Rol <span className='text-red-500'>*</span>
              </label>
              <select 
                name='role'
                value={formData.role}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, role: e.target.value }));
                  if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                }}
                className='flex w-full rounded-md border px-3 py-2 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              >
                <option value='User'>Usuario</option>
                <option value='Admin'>Administrador</option>
              </select>
              {errors.role && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                  {errors.role}
                </p>
              )}
            </div>

            <div className='w-full'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Tipo de notificación <span className='text-red-500'>*</span>
              </label>
              <select 
                name='notificationType'
                value={formData.notificationType}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, notificationType: e.target.value }));
                  if (errors.notificationType) setErrors(prev => ({ ...prev, notificationType: '' }));
                }}
                className='flex w-full rounded-md border px-3 py-2 text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              >
                <option value='Email'>Email</option>
                <option value='Sms'>SMS</option>
                <option value='Push'>Push</option>
              </select>
              {errors.notificationType && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                  {errors.notificationType}
                </p>
              )}
            </div>
          </div>

          <Button
            type='submit'
            isLoading={loading}
            className='w-full'
          >
            Registrarse
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <a 
                href="/login" 
                className="text-blue-600 hover:underline dark:text-blue-400"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/login');
                }}
              >
                Iniciar sesión
              </a>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
