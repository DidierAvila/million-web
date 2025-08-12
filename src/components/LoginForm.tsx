'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { LoginRequest } from '@/types/api';
import { useToast } from './ui/Toast';

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginRequest>({
    userName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Efecto para redirigir después de login exitoso
  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1000); // Esperar 1 segundo para que se muestre el toast
      
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Iniciando proceso de login...');
      const { AuthService } = await import('@/services/auth');
      const authResponse = await AuthService.login(formData);
      
      if (authResponse.success) {
        console.log('Login exitoso:', authResponse);
        
        // Mostrar mensaje de éxito
        showToast(`¡Bienvenido/a! Iniciando sesión...`, 'success');
        
        // Marcar el login como exitoso para activar la redirección
        setLoginSuccess(true);
      } else {
        setError(authResponse.message || 'Error de autenticación. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      const errorMessage = 
        err instanceof Error ? err.message : 
        'Error al iniciar sesión. Por favor, verifique sus credenciales e intente nuevamente.';
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
            Iniciar sesión
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Ingrese sus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6'>
            <p className='text-red-800 dark:text-red-400'>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Input
            label='Correo electrónico'
            name='userName'
            type='text'
            value={formData.userName}
            onChange={handleChange}
            required
            autoComplete='username'
            placeholder='usuario@example.com'
          />

          <Input
            label='Contraseña'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete='current-password'
          />

          <Button
            type='submit'
            isLoading={loading}
            className='w-full'
          >
            Iniciar sesión
          </Button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
