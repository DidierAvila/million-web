'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';

export function NavBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    api.auth.logout();
    window.location.href = '/login';
  };

  return (
    <nav className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <Link href='/dashboard'>
                <span className='text-xl font-bold text-gray-900 dark:text-white'>
                  Million
                </span>
              </Link>
            </div>
            
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              <Link 
                href='/dashboard' 
                className={cn(
                  'inline-flex items-center h-16 border-b-2 px-1 pt-1 text-sm font-medium',
                  isActive('/dashboard')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                Dashboard
              </Link>
              
              <Link 
                href='/properties' 
                className={cn(
                  'inline-flex items-center h-16 border-b-2 px-1 pt-1 text-sm font-medium',
                  isActive('/properties')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                Propiedades
              </Link>
              
              <Link 
                href='/owners' 
                className={cn(
                  'inline-flex items-center h-16 border-b-2 px-1 pt-1 text-sm font-medium',
                  isActive('/owners')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                Propietarios
              </Link>
            </div>
          </div>
          
          <div className='hidden sm:ml-6 sm:flex sm:items-center'>
            <div className='ml-3 relative'>
              <button 
                onClick={handleLogout}
                className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium'
              >
                Cerrar sesi�n
              </button>
            </div>
          </div>
          
          <div className='-mr-2 flex items-center sm:hidden'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <span className='sr-only'>Abrir men� principal</span>
              {isMobileMenuOpen ? (
                <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              ) : (
                <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Men� m�vil */}
      {isMobileMenuOpen && (
        <div className='sm:hidden'>
          <div className='pt-2 pb-3 space-y-1'>
            <Link
              href='/dashboard'
              className={cn(
                'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                isActive('/dashboard')
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              Dashboard
            </Link>
            
            <Link
              href='/properties'
              className={cn(
                'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                isActive('/properties')
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              Propiedades
            </Link>
            
            <Link
              href='/owners'
              className={cn(
                'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
                isActive('/owners')
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              Propietarios
            </Link>
          </div>
          
          <div className='pt-4 pb-3 border-t border-gray-200 dark:border-gray-800'>
            <div className='mt-3 space-y-1'>
              <button
                onClick={handleLogout}
                className='block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-800 dark:hover:text-gray-200'
              >
                Cerrar sesi�n
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
