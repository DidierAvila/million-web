'use client';

/**
 * Función para obtener los encabezados de autorización incluyendo token y rol
 * @returns Objeto con los headers de autorización
 */
export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;

    // Añadir el rol del usuario si está disponible
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo?.role) {
          headers['X-User-Role'] = userInfo.role;
        }
      } catch (error) {
        console.error('Error al obtener rol del usuario:', error);
      }
    }
  }

  return headers;
}
