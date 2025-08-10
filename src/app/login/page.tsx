import { Metadata } from 'next';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Iniciar Sesión - Million Web',
  description: 'Inicia sesión en tu cuenta de Million Web',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Million Web
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Plataforma de desarrollo web moderna
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 Million Web. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
