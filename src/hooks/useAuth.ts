'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api-client';

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Comprobar el estado de autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await api.auth.isAuthenticated();
        setIsAuthenticated(auth);
        
        // Redirigir si es necesario
        if (!auth && !isPublicRoute(pathname)) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [pathname, router]);

  // Función para iniciar sesión
  const login = async (userName: string, password: string) => {
    setLoading(true);
    try {
      await api.auth.login({ userName, password });
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    router.push('/login');
  };

  return React.createElement(
    AuthContext.Provider, 
    { value: { isAuthenticated, loading, login, logout } },
    children
  );
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Función para determinar si una ruta es pública
function isPublicRoute(pathname: string | null) {
  const publicRoutes = ['/login', '/register', '/dashboard', '/'];
  return publicRoutes.includes(pathname || '') || (pathname || '').startsWith('/dashboard');
}
