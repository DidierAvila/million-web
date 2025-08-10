# Sistema de Login - Million Web

## Descripción General

Sistema de autenticación completo implementado en Next.js 15 con TypeScript, que incluye validación de formularios, manejo de errores, y buenas prácticas de accesibilidad y UX.

## Características Implementadas

### ✅ Tecnologías Utilizadas
- **Next.js 15.4.6** - Framework React con App Router
- **TypeScript** - Tipado estático
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Tailwind CSS 4** - Estilos y diseño responsivo

### ✅ Funcionalidades de Autenticación
- Validación en tiempo real de campos
- Manejo de estados de carga
- Gestión de errores de API
- Persistencia de sesión con localStorage
- Redirección automática post-login
- Logout seguro

### ✅ Accesibilidad (WCAG 2.1)
- Labels asociados correctamente
- ARIA attributes (aria-invalid, aria-describedby, role, aria-live)
- Navegación por teclado
- Indicadores visuales de estado
- Mensajes de error descriptivos
- Soporte para lectores de pantalla

### ✅ UX/UI
- Diseño responsivo (mobile-first)
- Modo oscuro automático
- Indicadores de carga
- Feedback visual inmediato
- Botón para mostrar/ocultar contraseña
- Transiciones suaves

## Estructura del Proyecto

```
src/
├── app/
│   ├── login/page.tsx          # Página de login
│   ├── dashboard/page.tsx      # Dashboard post-login
│   └── page.tsx               # Página principal
├── components/
│   ├── ui/
│   │   ├── Input.tsx          # Componente de input reutilizable
│   │   └── Button.tsx         # Componente de botón reutilizable
│   └── LoginForm.tsx          # Formulario de login principal
├── hooks/
│   └── useAuth.ts             # Hook personalizado de autenticación
├── services/
│   └── auth.ts                # Servicio de API de autenticación
├── schemas/
│   └── auth.ts                # Esquemas de validación con Zod
└── types/
    └── auth.ts                # Tipos TypeScript
```

## Uso del Sistema

### Credenciales de Prueba
```
Email: admin@example.com
Contraseña: password123
```

### Flujo de Autenticación

1. **Página Principal** (`/`) - Introducción con enlace al login
2. **Login** (`/login`) - Formulario de autenticación
3. **Dashboard** (`/dashboard`) - Área protegida post-login

### Validaciones Implementadas

#### Email
- Campo requerido
- Formato de email válido
- Máximo 255 caracteres

#### Contraseña
- Campo requerido
- Mínimo 6 caracteres
- Máximo 100 caracteres

## Componentes Principales

### LoginForm
Formulario principal con:
- Validación en tiempo real
- Manejo de errores
- Estados de carga
- Accesibilidad completa

### Input Component
Componente reutilizable que incluye:
- Label asociado
- Manejo de errores
- Texto de ayuda
- Accesibilidad ARIA

### Button Component
Botón con variantes y estados:
- Múltiples variantes (primary, secondary, outline)
- Estados de carga
- Diferentes tamaños
- Accesibilidad completa

## Hooks Personalizados

### useAuth
Hook que maneja:
- Estado de autenticación
- Login/logout
- Manejo de errores
- Estados de carga
- Redirecciones

## Servicios

### AuthService
Clase estática que maneja:
- Llamadas a API
- Almacenamiento de tokens
- Verificación de autenticación
- Simulación de API (para demo)

## Configuración de API

El sistema está configurado para trabajar con cualquier API REST. Para conectar con tu API real:

1. Actualizar `API_BASE_URL` en `src/services/auth.ts`
2. Modificar el método `login()` para usar tu endpoint real
3. Ajustar la estructura de respuesta según tu API

```typescript
// Ejemplo de configuración personalizada
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-api.com';

// En AuthService.login()
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(credentials),
});
```

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint
```

## Mejoras Futuras Sugeridas

- [ ] Implementar refresh tokens
- [ ] Agregar autenticación de dos factores (2FA)
- [ ] Implementar "Recordar sesión"
- [ ] Agregar recuperación de contraseña
- [ ] Implementar rate limiting
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar middleware de autenticación
- [ ] Agregar logging de seguridad

## Seguridad

### Medidas Implementadas
- Validación tanto en cliente como servidor
- Sanitización de inputs
- Manejo seguro de tokens
- Headers de seguridad apropiados

### Recomendaciones Adicionales
- Implementar HTTPS en producción
- Configurar CSP (Content Security Policy)
- Usar variables de entorno para configuración sensible
- Implementar rate limiting en el servidor
- Auditorías de seguridad regulares

## Soporte de Navegadores

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Licencia

Este proyecto es parte de Million Web y está sujeto a sus términos de licencia.
