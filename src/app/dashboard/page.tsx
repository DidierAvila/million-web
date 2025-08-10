'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!AuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Obtener datos del usuario del localStorage
    const userData = localStorage.getItem('user-data');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Million Web Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Bienvenido, {user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                isLoading={isLoading}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card de bienvenida */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Usuario Activo
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de estado */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Estado de Sesión
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        Activa
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de información */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        ID de Usuario
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {user.id}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  ¡Bienvenido al Dashboard!
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    Has iniciado sesión exitosamente. Este es un dashboard de demostración
                    que muestra las funcionalidades implementadas:
                  </p>
                </div>
                <div className="mt-5">
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>✅ Autenticación con React Hook Form y Zod</li>
                    <li>✅ Validación de campos en tiempo real</li>
                    <li>✅ Manejo de errores de API</li>
                    <li>✅ Estados de carga y feedback visual</li>
                    <li>✅ Diseño responsivo con Tailwind CSS</li>
                    <li>✅ Accesibilidad (ARIA labels, roles, etc.)</li>
                    <li>✅ Soporte para modo oscuro</li>
                    <li>✅ TypeScript para tipado seguro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
