import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { LoginCredentials, LoginResponse } from '@/types/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await AuthService.login(credentials);

      if (response.success && response.token && response.user) {
        AuthService.saveAuthData(response.token, response.user);
        router.push('/dashboard'); // Redirigir al dashboard después del login
        return true;
      } else {
        setError(response.message || 'Error en el inicio de sesión');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      router.push('/login');
    } catch (err) {
      console.error('Error durante logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    login,
    logout,
    isLoading,
    error,
    clearError,
    isAuthenticated: AuthService.isAuthenticated(),
  };
};
