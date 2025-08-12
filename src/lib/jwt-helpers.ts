'use client';

/**
 * Tipo para el payload del JWT decodificado
 */
export type JwtPayload = {
  // Claims estándar
  exp?: number;
  iat?: number;
  nbf?: number;
  sub?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  role?: string;
  
  // Claims formato XML (ASP.NET Identity)
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  
  // Permitir cualquier otro claim adicional
  [key: string]: unknown;
};

/**
 * Decodifica un token JWT sin verificar su firma
 * Nota: Esta función solo decodifica la información del token
 * 
 * @param token - El token JWT a decodificar
 * @returns El payload del token decodificado o null si no es válido
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    if (!token) return null;

    // Un token JWT tiene tres partes separadas por puntos: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Token JWT inválido: formato incorrecto');
      return null;
    }

    // Decodificar la parte del payload (segunda parte)
    const payload = parts[1];
    
    // El payload está en Base64Url, necesitamos convertirlo a Base64 estándar
    // y luego decodificarlo
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar token JWT:', error);
    return null;
  }
}

/**
 * Verifica si un token JWT ha expirado
 * 
 * @param token - El token JWT a verificar
 * @returns true si el token ha expirado, false en caso contrario
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true;
    
    // La fecha de expiración en el token está en segundos desde la época Unix
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  } catch (error) {
    console.error('Error al verificar expiración del token:', error);
    return true;
  }
}

/**
 * Obtiene el nombre de usuario del token JWT
 * 
 * @param token - El token JWT
 * @returns El nombre de usuario o null si no se encuentra
 */
export function getUserNameFromToken(token: string): {
  firstName?: string;
  lastName?: string;
  email?: string;
  userId?: string;
  userName?: string;
  role?: string;
} | null {
  try {
    // Verificar si el token ha expirado
    if (isTokenExpired(token)) {
      console.warn('El token JWT ha expirado');
      return null;
    }
    
    const decoded = decodeJwt(token);
    if (!decoded) return null;

    // Los tokens JWT pueden tener diferentes claims dependiendo de cómo estén configurados
    // Intentamos buscar en diferentes ubicaciones comunes donde podría estar la información del usuario
    
    // Claims estándar (inicializar con valores nulos)
    let firstName: string | undefined = undefined;
    let lastName: string | undefined = undefined;
    let email: string | undefined = undefined;
    let userId: string | undefined = undefined;
    let userName: string | undefined = undefined;
    let role: string | undefined = undefined;
    
    // Primero buscar en claims de formato XML (ASP.NET Identity)
    // Estos son los que hemos visto en el token proporcionado
    if (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]) {
      firstName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] as string;
    }
    
    if (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]) {
      lastName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] as string;
    }
    
    if (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]) {
      email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] as string;
      // Usar el email como nombre de usuario si no hay otro definido
      userName = email;
    }
    
    if (decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]) {
      userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string;
    }
    
    if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
      role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string;
    }
    
    // Si no encontramos los claims en formato XML, buscar en formato estándar
    if (!firstName) {
      firstName = (decoded.firstName as string) || (decoded.given_name as string) || (decoded.name as string)?.split(' ')?.[0];
    }
    
    if (!lastName) {
      lastName = (decoded.lastName as string) || (decoded.family_name as string) || (decoded.name as string)?.split(' ')?.[1] || '';
    }
    
    if (!email) {
      email = (decoded.email as string) || (decoded.sub as string);
    }
    
    if (!userId) {
      userId = (decoded.userId as string) || (decoded.sub as string) || (decoded.id as string);
    }
    
    if (!userName) {
      userName = (decoded.userName as string) || (decoded.preferred_username as string) || email;
    }
    
    // Usar el email como nombre de usuario si no hay otro disponible
    if (!userName && email) {
      userName = email;
    }
    
    const userInfo = {
      firstName,
      lastName,
      email,
      userId,
      userName,
      role
    };
    
    return userInfo;
  } catch (error) {
    console.error('Error al obtener información del usuario desde token JWT:', error);
    return null;
  }
}
