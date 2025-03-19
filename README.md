## Sistema de Gestión Escolar

Un sistema de gestión diseñado para administrar eficientemente una escuela, permitiendo gestionar datos clave dentro de la plataforma mediante un CRM. Incluye distintos módulos y catálogos para un control óptimo de la información almacenada en la base de datos.

## 🚀 Características

- Gestión de estudiantes, maestros, padres y personal administrativo.

- Administración de inscripciones y asignación de clases.

- Manejo de permisos y roles de usuario.

- Reportes y estadísticas visuales.

- Autenticación segura mediante JWT.

- Diseño responsivo y moderno con TailwindCSS y DaisyUI.

## 🛠 Tecnologías Utilizadas

El proyecto está desarrollado con las siguientes tecnologías y librerías:

- `@react-oauth/google` - Autenticación con Google.
- `@tanstack/react-query` - Manejo eficiente del estado de datos asíncronos.
- `@tanstack/react-query-devtools` - Herramientas de desarrollo para React Query.
- `@trivago/prettier-plugin-sort-imports` - Plugin para ordenar importaciones en Prettier.
- `axios` - Cliente HTTP para realizar peticiones a la API.
- `daisyui` - Extensión de TailwindCSS para componentes UI.
- `jsonwebtoken` - Manejo de tokens JWT para autenticación segura.
- `prettier` - Formateador de código para mantener consistencia.
- `recharts`- Librería de gráficos para visualización de datos.
- `zustand` - Manejo de estado global en React.
- `tailwindcss`- Framework de CSS para estilización eficiente.
- `react-icons`- Libreia de iconos para ayuda visual a la iconografia
- `husky`- Hooks para mejorar la calidad del código en commits.

## 📂 Estructura del Proyecto

```
/src
├── /components        # Componentes reutilizables de UI
│   ├── /ui           # Componentes genéricos como botones, inputs, modales
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── Table.jsx
│   │   └── index.js  # Exporta todos los componentes de UI
│   ├── Navbar.jsx    # Barra de navegación
│   ├── Sidebar.jsx   # Menú lateral
│   ├── Footer.jsx    # Pie de página
│   └── index.js      # Exporta todos los componentes globales
│
├── /config           # Configuración global del proyecto
│   ├── api.js        # Configuración base de Axios (ejemplo: baseURL, interceptores)
│   ├── constants.js  # Constantes globales (ejemplo: roles de usuario, estados)
│   ├── env.js        # Carga de variables de entorno
│   ├── theme.js      # Configuración de tema (si usas Tailwind o DaisyUI)
│   └── index.js      # Exporta todas las configuraciones
│
├── /features         # Módulos específicos de cada funcionalidad
│   ├── /auth        # Módulo de autenticación (login, registro)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── authService.js  # Funciones para login y registro
│   │   ├── authSlice.js    # Estado global con Zustand o Redux
│   │   ├── hooks.js        # Hooks específicos para auth
│   │   └── index.js        # Exporta todo el módulo
│   ├── /students   # Módulo para estudiantes
│   │   ├── StudentList.jsx
│   │   ├── StudentForm.jsx
│   │   ├── studentService.js
│   │   ├── studentSlice.js
│   │   ├── hooks.js
│   │   └── index.js
│   ├── /teachers   # Módulo para profesores
│   ├── /parents    # Módulo para padres
│   ├── /classes    # Módulo para clases
│   └── ...         # Más módulos según necesidades
│
├── /hooks           # Hooks personalizados
│   ├── useAuth.js   # Hook para manejar autenticación
│   ├── useFetch.js  # Hook para llamadas a la API con React Query
│   ├── useModal.js  # Hook para manejar modales
│   └── index.js     # Exporta todos los hooks
│
├── /pages           # Páginas principales de la app (cada ruta principal)
│   ├── Home.jsx     # Página de inicio
│   ├── Dashboard.jsx # Panel principal
│   ├── Login.jsx    # Página de login
│   ├── Register.jsx # Página de registro
│   ├── NotFound.jsx # Página 404
│   └── index.js     # Exporta todas las páginas
│
├── /routes          # Configuración de rutas
│   ├── PrivateRoute.jsx  # Protege rutas privadas con autenticación
│   ├── AppRouter.jsx     # Define las rutas principales
│   └── index.js          # Exporta las rutas
│
├── /services        # Llamadas a la API con Axios
│   ├── authService.js    # Servicio para autenticación
│   ├── studentService.js # Servicio para estudiantes
│   ├── teacherService.js # Servicio para maestros
│   ├── classService.js   # Servicio para clases
│   └── index.js          # Exporta todos los servicios
│
├── /store           # Estado global con Zustand
│   ├── authStore.js     # Manejo de sesión de usuario
│   ├── studentStore.js  # Manejo de estado de estudiantes
│   ├── teacherStore.js  # Manejo de estado de maestros
│   └── index.js         # Exporta todos los stores
│
├── /utils           # Funciones auxiliares
│   ├── formatDate.js  # Función para formatear fechas
│   ├── validateForm.js # Validaciones de formularios
│   ├── helpers.js     # Funciones genéricas
│   └── index.js       # Exporta todas las utilidades
│
├── /styles          # Configuración de Tailwind y estilos globales
│   ├── tailwind.css  # Estilos de Tailwind
│   ├── global.css    # Estilos personalizados
│   └── theme.css     # Personalización del tema
│
├── main.jsx         # Punto de entrada
├── app.jsx          # Componente raíz
└── index.js         # Punto de montaje
```

## 🛠 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

### 1️⃣ Clonar el repositorio

```
 git clone https://github.com/muke78/Frontend-Kindergarden.git
 cd Frontend-Kindergarden
```

### 2️⃣ Instalar dependencias

```
bun i
```

### 3️⃣ Configurar variables de entorno

Crea un archivo .env en la raíz del proyecto y configura las variables necesarias:

```
VITE_API_BASE_URL=https://tu-api.com
VITE_GOOGLE_CLIENT_ID=tu-google-client-id
```

### 4️⃣ Ejecutar el proyecto

```
  bun dev
```

## 📌 Convenciones de Código

Para mantener un código limpio y estandarizado, seguimos estas prácticas:

- Prettier para formateo automático.

- Husky para ejecutar validaciones antes de los commits.

- Zustand para manejo de estado global.

- React Query para manejar peticiones asíncronas eficientemente.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
