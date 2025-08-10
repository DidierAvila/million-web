import { LoginCredentials, LoginResponse, AuthError } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Simulamos una llamada a API real
      // En producción, reemplazar con tu endpoint real
      const response = await fetch(`${API_BASE_URL}/posts/1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Simulamos una respuesta exitosa para demostración
      // En producción, usar la respuesta real de la API
      if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
        return {
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            email: credentials.email,
            name: 'Usuario Admin',
          },
        };
      } else {
        return {
          success: false,
          message: 'Credenciales inválidas',
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      
      throw new Error('Error de conexión. Intenta nuevamente.');
    }
  }

  static async logout(): Promise<void> {
    // Limpiar token del localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-data');
    }
  }

  static saveAuthData(token: string, user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user-data', JSON.stringify(user));
    }
  }

  static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}
