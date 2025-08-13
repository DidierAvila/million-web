# Million Web - Plataforma Inmobiliaria

![Million Web Logo](public/logo.svg)

## 📋 Descripción del Proyecto

Million Web es una plataforma inmobiliaria diseñada para la gestión integral de propiedades, propietarios y transacciones inmobiliarias. El sistema permite a los agentes inmobiliarios, administradores y propietarios gestionar eficientemente sus propiedades, desde el listado hasta la venta o alquiler.

### Características Principales

- **Gestión de Propiedades**: Listado, visualización, creación, edición y eliminación de propiedades.
- **Gestión de Propietarios**: Administración completa de los datos de los propietarios.
- **Transacciones**: Seguimiento de todas las transacciones relacionadas con las propiedades.
- **Panel de Control**: Visualización de estadísticas y resúmenes de actividad.
- **Sistema de Autenticación**: Manejo de roles y permisos para diferentes tipos de usuarios.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15.4.6**: Framework de React para desarrollo de aplicaciones web.
- **React**: Biblioteca JavaScript para construir interfaces de usuario.
- **TypeScript**: Superset de JavaScript que añade tipos estáticos.
- **Tailwind CSS**: Framework CSS utilitario para diseño rápido y responsivo.
- **Axios**: Cliente HTTP para realizar peticiones a la API.

### Autenticación y Seguridad
- **JWT (JSON Web Tokens)**: Para manejo de sesiones y autenticación.
- **Autorización basada en roles**: Control de acceso según el rol del usuario.

### Validación
- **Zod**: Biblioteca de validación de esquemas para TypeScript.

### Herramientas de Desarrollo
- **ESLint**: Herramienta de linting para identificar y corregir problemas en el código.
- **Prettier**: Formateador de código para mantener un estilo consistente.

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (versión 18.0 o superior)
- npm (versión 8.0 o superior) o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/DidierAvila/million-web.git
   cd million-web
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

   ```
   NEXT_PUBLIC_API_URL=https://api.example.com
   # Añade otras variables de entorno necesarias
   ```

4. **Ejecutar el servidor de desarrollo**

   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. **Acceder a la aplicación**

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📝 Estructura del Proyecto

```
million-web/
├── public/            # Archivos estáticos
├── src/               # Código fuente
│   ├── app/           # Rutas de la aplicación (Next.js App Router)
│   ├── components/    # Componentes reutilizables
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilidades y funciones auxiliares
│   ├── schemas/       # Esquemas de validación Zod
│   ├── services/      # Servicios para comunicación con la API
│   └── types/         # Definiciones de tipos TypeScript
├── .eslintrc.json     # Configuración de ESLint
├── .gitignore         # Archivos ignorados por Git
├── next.config.mjs    # Configuración de Next.js
├── package.json       # Dependencias y scripts
├── postcss.config.mjs # Configuración de PostCSS
├── tailwind.config.js # Configuración de Tailwind CSS
└── tsconfig.json      # Configuración de TypeScript
```

## 🔐 Sistema de Autenticación y Autorización

La aplicación cuenta con un sistema de autenticación basado en JWT y autorización por roles:

- **Roles disponibles**: admin, superadmin, agent, user
- **Permisos por rol**:
  - **admin/superadmin**: Acceso completo a todas las funcionalidades
  - **agent**: Puede ver, crear y editar propiedades y propietarios, pero no eliminarlos
  - **user**: Solo puede ver información, sin capacidad de edición

## 🧪 Pruebas

Para ejecutar las pruebas:

```bash
npm run test
# o
yarn test
```

## 📦 Compilación para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
# o
yarn build
```

Para iniciar la versión compilada:

```bash
npm run start
# o
yarn start
```

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, asegúrate de seguir estas pautas:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios
4. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
5. Empuja a la rama (`git push origin feature/amazing-feature`)
6. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.
