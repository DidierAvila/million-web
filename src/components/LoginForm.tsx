'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/auth';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data);
    
    if (!success) {
      // El error ya se maneja en el hook useAuth
      console.log('Login failed');
    } else {
      reset(); // Limpiar el formulario en caso de éxito
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {error && (
          <div
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700 dark:text-red-400 text-sm font-medium">
                {error}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            {...register('email')}
            type="email"
            label="Correo Electrónico"
            placeholder="tu@ejemplo.com"
            error={errors.email?.message}
            required
            autoComplete="email"
            autoFocus
          />

          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="••••••••"
              error={errors.password?.message}
              required
              autoComplete="current-password"
            />
            
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading || isSubmitting}
              className="w-full"
            >
              Iniciar Sesión
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Credenciales de prueba:
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Email: admin@example.com | Contraseña: password123
          </p>
        </div>
      </div>
    </div>
  );
};
