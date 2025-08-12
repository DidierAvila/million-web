'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { api } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al dashboard
    const checkAuth = async () => {
      const isAuth = await api.auth.isAuthenticated();
      if (isAuth) {
        router.push('/dashboard');
      }
    };
    
    checkAuth();
  }, [router]);

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12'>
      <LoginForm />
    </div>
  );
}
