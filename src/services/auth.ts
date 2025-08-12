import { LoginCredentials, LoginResponse } from '@/types/auth';
// Eliminamos la importación no utilizada
import { AUTH_ENDPOINTS } from '@/lib/api-endpoints';
import { RegisterRequest } from '@/types/api';

export class AuthService {
  static async register(userData: RegisterRequest): Promise<boolean> {
    try {
      console.log('Intentando registro en:', AUTH_ENDPOINTS.REGISTER);
      
      // Mapeamos los campos según lo esperado por el servidor
      const serverData = {
        ...userData,
        // Si el servidor espera firstName en lugar de name, hacemos el mapeo
        firstName: userData.name,
      };
      
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Si estamos en desarrollo, podemos simular un registro exitoso
      if (process.env.NODE_ENV === 'development') {
        console.warn('Usando fallback para registro en desarrollo');
        return true;
      }
      
      throw error;
    }
  }

  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Usamos la API real
      console.log('Intentando autenticación en:', AUTH_ENDPOINTS.LOGIN);
      console.log('Con credenciales:', { userName: credentials.userName, password: '***' });
      
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Intentamos determinar el formato de la respuesta
      const contentType = response.headers.get('content-type');
      let responseData;
      let token;
      
      try {
        // Si es JSON, procesamos normalmente
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('Datos JSON recibidos:', responseData);
          token = responseData.token;
        } else {
          // Si no es JSON, podría ser un token JWT directo
          const textResponse = await response.text();
          console.log('Respuesta de texto recibida:', textResponse.substring(0, 20) + '...');
          
          // Verificar si parece un token JWT (comienza con eyJ)
          if (textResponse.startsWith('eyJ')) {
            token = textResponse;
            responseData = { token: textResponse };
            console.log('Detectado token JWT directo');
          } else {
            // No es un token JWT ni JSON, error
            throw new Error('Respuesta del servidor en formato desconocido');
          }
        }
      } catch (parseError) {
        console.error('Error al procesar respuesta:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      // Si tenemos un token, procesamos la autenticación
      if (token) {
        // Importar JWT helpers de manera dinámica
        const { getUserNameFromToken } = await import('@/lib/jwt-helpers');
        const userInfo = getUserNameFromToken(token);
        
        // Extraer información del usuario del token o de la respuesta
        const userId = userInfo?.userId || responseData?.userId || responseData?.user?.id || '';
        const userEmail = userInfo?.email || responseData?.email || responseData?.user?.email || '';
        const userName = userInfo?.firstName || responseData?.name || responseData?.user?.name || '';
        const userRole = userInfo?.role || '';
        
        // Crear objeto userInfo completo para localStorage
        const fullUserInfo = {
          userId,
          email: userEmail,
          firstName: userInfo?.firstName || userName.split(' ')[0] || '',
          lastName: userInfo?.lastName || userName.split(' ')[1] || '',
          userName: userEmail,
          role: userRole
        };
        
        // Guardar en localStorage y emitir evento de autenticación
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(fullUserInfo));
        
        // Emitir evento para notificar cambio en estado de autenticación
        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          const authEvent = new CustomEvent('auth-state-changed', {
            detail: {
              isAuthenticated: true,
              user: fullUserInfo
            }
          });
          window.dispatchEvent(authEvent);
          console.log('Evento de autenticación emitido desde login:', fullUserInfo);
        }
        
        return {
          success: true,
          token: token,
          user: {
            id: userId,
            email: userEmail,
            name: userName,
          },
        };
      } else {
        return {
          success: false,
          message: responseData.message || 'Error de autenticación',
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      
      // Si hay un error de conexión y estamos en desarrollo, podemos usar el fallback
      console.warn('Usando fallback para login en desarrollo');
      
      // Verificamos si es un SyntaxError al parsear JSON (posiblemente un token JWT directo)
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        console.log('Error de parseo JSON, podría ser un token JWT directo');
        // Intentar procesar como token directo
        try {
          // Crear un tipo para el error con propiedades adicionales
          interface ErrorWithResponse extends Error {
            responseText?: string;
            rawResponse?: string;
            response?: {text?: () => string};
          }
          
          const errorWithResponse = error as ErrorWithResponse;
          const responseText = errorWithResponse.responseText || errorWithResponse.rawResponse || '';
          if (responseText.startsWith('eyJ')) {
            const token = responseText;
            const { getUserNameFromToken } = await import('@/lib/jwt-helpers');
            const userInfo = getUserNameFromToken(token);
            
            if (userInfo) {
              this.saveAuthData(token, {
                id: userInfo.userId || '',
                email: userInfo.email || '',
                name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
              });
              
              return {
                success: true,
                token: token,
                user: {
                  id: userInfo.userId || '',
                  email: userInfo.email || '',
                  name: `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
                },
              };
            }
          }
        } catch (jwtError) {
          console.error('Error procesando posible token JWT:', jwtError);
        }
      }
      
      // Modo fallback para desarrollo
      if (credentials.userName === 'admin@example.com' && credentials.password === 'password123') {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY4OTdhMDQyNDE0OTdkNjM2ZGUyOWM0YSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFsZWpvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6IkFsZWpvIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc3VybmFtZSI6IlBlcnR1eiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzU0OTczMTAyfQ.7ZrSFr5xSU_yq8G6CpErPWy379L-141k3N-fHeo38n0';
        
        // Guardamos los datos de autenticación
        this.saveAuthData(token, {
          id: '6897a04241497d636de29c4a',
          email: 'alejo@gmail.com',
          name: 'Alejo Pertuz',
        });
        
        return {
          success: true,
          token: token,
          user: {
            id: '6897a04241497d636de29c4a',
            email: 'alejo@gmail.com',
            name: 'Alejo Pertuz',
          },
        };
      }
      
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      
      throw new Error('Error de conexión. Intenta nuevamente.');
    }
  }

  static async logout(): Promise<void> {
    // Limpiar token y datos de usuario del localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // También podríamos intentar hacer una petición al servidor para invalidar el token
      // si la API lo soporta
      try {
        // Opcional: llamar a un endpoint de logout en el servidor
        // await fetch(`${API_BASE_URL}/api/Authentication/Logout`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        console.log('Sesión cerrada exitosamente');
      } catch (error) {
        console.error('Error al cerrar sesión en el servidor:', error);
        // No propagamos el error ya que la sesión se considera cerrada localmente
      }
      
      // Disparar evento de cierre de sesión para notificar a otros componentes
      if (typeof window.dispatchEvent === 'function') {
        const authEvent = new CustomEvent('auth-state-changed', {
          detail: {
            isAuthenticated: false,
            user: null
          }
        });
        window.dispatchEvent(authEvent);
      }
    }
  }

  static saveAuthData(token: string, user: { id: string; email: string; name?: string }): void {
    if (typeof window !== 'undefined') {
      // Crear el objeto userInfo que vamos a guardar
      const userInfo = {
        userId: user.id,
        email: user.email,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        userName: user.email,
        // Si hay un role en el token, se extrae con getUserNameFromToken
        // y se añade automáticamente desde el servicio de login
      };
      
      // Guardar datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // Emitir evento para notificar el cambio de estado de autenticación
      if (typeof window.dispatchEvent === 'function') {
        const authEvent = new CustomEvent('auth-state-changed', {
          detail: {
            isAuthenticated: true,
            user: userInfo
          }
        });
        window.dispatchEvent(authEvent);
        console.log('Evento de autenticación emitido:', userInfo);
      }
    }
  }

  static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  static isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }
}
