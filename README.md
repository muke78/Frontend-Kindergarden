# 🏫 AKT - CRM para Administración de Kinder

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

### 📌 **Frontend y UI**

- [`react`](https://react.dev/) - Biblioteca para la construcción de interfaces de usuario.
- [`react-dom`](https://react.dev/) - Renderizado de componentes React en el DOM.
- [`react-router-dom`](https://reactrouter.com/) - Enrutamiento dinámico en aplicaciones React.
- [`tailwindcss`](https://tailwindcss.com/) - Framework CSS para estilos rápidos y eficientes.
- [`daisyui`](https://daisyui.com/) - Extensión de TailwindCSS con componentes personalizables.
- [`framer-motion`](https://www.framer.com/motion/) - Animaciones fluidas y avanzadas en React.
- [`animate.css`](https://animate.style/) - Animaciones CSS listas para usar.
- [`react-icons`](https://react-icons.github.io/react-icons/) - Librería de iconos para mejorar la experiencia visual.
- [`react-spinners`](https://www.davidhu.io/react-spinners/) - Indicadores de carga animados.

### 🔄 **Estado y Manejo de Datos**

- [`@tanstack/react-query`](https://tanstack.com/query/latest) - Manejo eficiente del estado de datos asíncronos.
- [`@tanstack/react-table`](https://tanstack.com/table/latest) - Tablas dinámicas y personalizables.
- [`zustand`](https://zustand-demo.pmnd.rs/) - Gestión de estado global simple y eficiente.

### 🔐 **Autenticación y Seguridad**

- [`@react-oauth/google`](https://github.com/MomenSherif/react-oauth) - Autenticación con Google.
- [`jwt-decode`](https://github.com/auth0/jwt-decode) - Decodificación de tokens JWT.

### 🔧 **Utilidades y Herramientas**

- [`axios`](https://axios-http.com/) - Cliente HTTP para realizar peticiones a la API.
- [`query-string`](https://www.npmjs.com/package/query-string) - Manejo y manipulación de query strings en URLs.
- [`sweetalert2`](https://sweetalert2.github.io/) - Alertas y modales personalizables.
- [`zod`](https://zod.dev/) - Validación de esquemas de datos.
- [`motion-number`](https://motion-number.barvian.me/) - Contadores animados numéricos.

### 📊 **Visualización de Datos**

- [`recharts`](https://recharts.org/en-US/) - Librería de gráficos interactivos para React.

### 🛠 **Desarrollo y Configuración**

- [`vite`](https://vitejs.dev/) - Herramienta de construcción rápida para proyectos frontend.
- [`@vitejs/plugin-react-swc`](https://www.npmjs.com/package/@vitejs/plugin-react-swc) - Optimizaciones de compilación para React.
- [`prettier`](https://prettier.io/) - Formateador de código para mantener consistencia.
- [`@trivago/prettier-plugin-sort-imports`](https://github.com/trivago/prettier-plugin-sort-imports) - Plugin para ordenar importaciones en Prettier.
- [`eslint`](https://eslint.org/) - Linter para mejorar la calidad del código.
- [`typescript`](https://www.typescriptlang.org/) - Tipado estático para JavaScript.
- [`husky`](https://typicode.github.io/husky/#/) - Hooks para mejorar la calidad del código en commits.

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
