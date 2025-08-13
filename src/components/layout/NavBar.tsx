'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: 'Propietarios',
    href: '/owners',
    icon: (
      <svg 
        className="w-5 h-5" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
        />
      </svg>
    ),
  },
  {
    name: 'Propiedades',
    href: '/properties',
    icon: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    name: 'Transacciones',
    href: '/traces',
    icon: (
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{userId?: string; firstName?: string; lastName?: string; email?: string; userName?: string; role?: string} | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showToast, ToastContainer } = useToast();
  
  useEffect(() => {
    // Verificar el estado de autenticación inicial y la información del usuario
    const checkAuth = async () => {
      console.log('NavBar: Verificando estado de autenticación inicial');
      const isAuth = await api.auth.isAuthenticated();
      const userInfoData = api.auth.getUserInfo();
      
      console.log('NavBar: Estado inicial -', isAuth ? 'Autenticado' : 'No autenticado', userInfoData);
      
      setIsAuthenticated(isAuth);
      setUserInfo(userInfoData);
    };
    
    checkAuth();
    
    // Escuchar cambios en el estado de autenticación
    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('NavBar: Evento auth-state-changed recibido', customEvent.detail);
      
      const isAuth = customEvent.detail?.isAuthenticated;
      const userData = customEvent.detail?.user;
      
      console.log('NavBar: Actualizando estado -', isAuth ? 'Autenticado' : 'No autenticado', userData);
      
      setIsAuthenticated(isAuth);
      setUserInfo(userData);
    };
    
    // Agregar el event listener
    window.addEventListener('auth-state-changed', handleAuthChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);
  
  // No mostrar la navbar en la página de carga inicial
  if (pathname === '/') {
    return null;
  }
  
  // Función para cerrar sesión
  const handleLogout = () => {
    const userName = userInfo?.firstName || userInfo?.userName || 'Usuario';
    api.auth.logout();
    setIsAuthenticated(false);
    setUserInfo(null);
    setIsMobileMenuOpen(false);
    showToast(`¡Hasta pronto, ${userName}! Has cerrado sesión correctamente.`, 'info');
    setTimeout(() => {
      router.push('/login'); // Redirigir a la página de login después de mostrar el toast
    }, 1000); // Pequeño retraso para que el usuario vea el mensaje
  };
  
  // Función para cerrar el menú móvil
  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Función para manejar clics en elementos de navegación
  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (href !== '/dashboard' && !isAuthenticated) {
      e.preventDefault(); // Prevenir la navegación por defecto
      router.push('/login'); // Redirigir a login
    }
  };

  return (
    <>
    <nav className="bg-white dark:bg-[var(--neutral-900)] shadow-sm border-b border-[var(--neutral-200)] dark:border-[var(--neutral-700)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-semibold text-[var(--primary)]">Million</span>
                <span className="text-xl font-semibold text-[var(--secondary)] dark:text-[var(--secondary-light)]">Web</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Dashboard siempre visible */}
                <Link
                  href="/dashboard"
                  className={cn(
                    pathname === '/dashboard'
                      ? 'bg-[var(--primary-light)] bg-opacity-20 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)] dark:bg-opacity-30 dark:text-[var(--primary-light)]'
                      : 'text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] hover:text-[var(--primary)] dark:text-[var(--neutral-300)] dark:hover:bg-[var(--neutral-800)] dark:hover:text-[var(--primary-light)]',
                    'px-3 py-2 rounded-md text-sm font-medium flex items-center'
                  )}
                  aria-current={pathname === '/dashboard' ? 'page' : undefined}
                >
                  <span className="mr-2">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </span>
                  Dashboard
                </Link>

                {/* Otros items de navegación */}
                {navItems.filter(item => item.href !== '/dashboard').map((item) => {
                  const isActive = pathname === item.href || 
                    (pathname.startsWith(item.href) && item.href !== '/dashboard');
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'bg-[var(--primary-light)] bg-opacity-20 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)] dark:bg-opacity-30 dark:text-[var(--primary-light)]'
                          : 'text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] hover:text-[var(--primary)] dark:text-[var(--neutral-300)] dark:hover:bg-[var(--neutral-800)] dark:hover:text-[var(--primary-light)]',
                        'px-3 py-2 rounded-md text-sm font-medium flex items-center'
                      )}
                      onClick={(e) => handleNavClick(item.href, e)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Botones de autenticación o perfil */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center ml-4">
                <div className="flex flex-col mr-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hola, {userInfo?.firstName || userInfo?.userName || 'Usuario'}
                  </div>
                  {userInfo?.role && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Rol: {userInfo.role}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--secondary)] rounded-md hover:bg-[var(--secondary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary-light)]"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-light)]"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
          
          {/* Botón de toggle para móviles */}
          <div className="-mr-2 flex md:hidden ml-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-white dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Dashboard siempre visible */}
          <Link
            href="/dashboard"
            onClick={handleNavigation}
            className={cn(
              pathname === '/dashboard'
                ? 'bg-[var(--primary-light)] bg-opacity-20 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)] dark:bg-opacity-30 dark:text-[var(--primary-light)]'
                : 'text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] hover:text-[var(--primary)] dark:text-[var(--neutral-300)] dark:hover:bg-[var(--neutral-800)] dark:hover:text-[var(--primary-light)]',
              'block px-3 py-2 rounded-md text-base font-medium flex items-center'
            )}
            aria-current={pathname === '/dashboard' ? 'page' : undefined}
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>

          {/* Otros items de navegación */}
          {navItems.filter(item => item.href !== '/dashboard').map((item) => {
            const isActive = pathname === item.href || 
              (pathname.startsWith(item.href) && item.href !== '/dashboard');
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  handleNavigation();
                  handleNavClick(item.href, e);
                }}
                className={cn(
                  isActive
                    ? 'bg-[var(--primary-light)] bg-opacity-20 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)] dark:bg-opacity-30 dark:text-[var(--primary-light)]'
                    : 'text-[var(--neutral-600)] hover:bg-[var(--neutral-100)] hover:text-[var(--primary)] dark:text-[var(--neutral-300)] dark:hover:bg-[var(--neutral-800)] dark:hover:text-[var(--primary-light)]',
                  'block px-3 py-2 rounded-md text-base font-medium flex items-center'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.name}
              </Link>
            );
          })}
          
          {/* Botones de autenticación para móvil */}
          <div className="pt-4 pb-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Hola, {userInfo?.firstName || userInfo?.userName || 'Usuario'}
                  </div>
                  {userInfo?.role && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Rol: {userInfo.role}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-[var(--secondary)] rounded-md hover:bg-[var(--secondary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary-light)]"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={handleNavigation}
                className="w-full block px-4 py-2 text-sm font-medium text-center text-white bg-[var(--primary)] rounded-md hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-light)]"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
    <ToastContainer />
    </>
  );
}
