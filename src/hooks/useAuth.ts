'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api-client';
import { RegisterRequest } from '@/types/api';

// Define el tipo para la información del usuario
interface UserInfo {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  role?: string;
}

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userInfo: UserInfo | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  getUserRole: () => string | undefined;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Comprobar el estado de autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await api.auth.isAuthenticated();
        setIsAuthenticated(auth);
        
        // Si está autenticado, obtener información del usuario
        if (auth) {
          const user = api.auth.getUserInfo();
          setUserInfo(user);
        } else {
          setUserInfo(null);
        }
        
        // Redirigir si es necesario
        if (!auth && !isPublicRoute(pathname)) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setIsAuthenticated(false);
        setUserInfo(null);
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
      const result = await api.auth.login({ userName, password });
      
      if (result.success) {
        setIsAuthenticated(true);
        // Obtener información del usuario actualizada
        const user = api.auth.getUserInfo();
        setUserInfo(user);
        router.push('/dashboard');
      } else {
        throw new Error(result.message || 'Error de autenticación');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    try {
      await api.auth.register(userData);
      router.push('/login');
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setUserInfo(null);
    router.push('/login');
  };

  // Función para obtener el rol del usuario actual
  const getUserRole = (): string | undefined => {
    return userInfo?.role;
  };

  return React.createElement(
    AuthContext.Provider, 
    { 
      value: { 
        isAuthenticated, 
        loading, 
        userInfo, 
        login, 
        register, 
        logout, 
        getUserRole 
      } 
    },
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
  return publicRoutes.includes(pathname || '') || 
         (pathname || '').startsWith('/dashboard') ||
         (pathname || '').startsWith('/register');
}
