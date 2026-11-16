# 🏫 Kindergarten Management Frontend (v2)

CRM SPA conectada al Backend RESTful Node + MySQL. React 19, shadcn/ui, Tailwind v4, React Query, React Hook Form + Zod, Zustand, Sonner. Soporte dual browser/Tauri para autenticación.

---

## 🚀 Stack

- **React 19** + **TypeScript 5.7** + **Vite 6.3**
- **shadcn/ui** (New York style, neutral palette)
- **Tailwind CSS v4** (vía `@tailwindcss/vite`)
- **TanStack Query 5** (cache + mutations) + **TanStack Table 8** (data table)
- **React Hook Form 7** + **Zod 3** (forms + validación)
- **Zustand 5** (estado global)
- **Sonner** (toast notifications, reemplaza sweetalert2 + react-hot-toast)
- **Lucide React** (íconos)
- **Axios 1.7.9** (CVE-2024-39338 fix)
- **React Router 7**
- **Biome 2.2** (lint + format, reemplaza ESLint + Prettier)
- **Vitest 3** + **Testing Library** (tests)
- **Tauri 2** ready (auth dual browser/desktop)

### Deps removidas en v2
`@react-oauth/google`, `better-auth`, `daisyui`, `sweetalert2`, `react-hot-toast`, `animate.css`, `react-spinners`, `react-router-dom`, `react-icons`, `prettier` + plugins, `eslint` + plugins, `autoprefixer`, `jwt-decode`, `query-string`, `react-countup`.

### CVE fixes
- `axios` 1.8.x → **1.7.9** (CVE-2024-39338 SSRF)
- `vite` 6.2 → **6.3.5**
- `typescript` 5.7.2 → **5.7.3**

---

## 🗂️ Arquitectura

```
src/
├── lib/                      # Infra cliente
│   ├── api.ts                # Axios con interceptor refresh + dual auth
│   ├── queryClient.ts        # React Query config
│   ├── utils.ts              # cn() helper (clsx + twMerge)
│   └── tauri.ts              # Detección runtime + token storage
├── types/                    # Tipos compartidos (DTOs backend)
│   ├── api.types.ts
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── rbac.types.ts
│   └── catalog.types.ts
├── stores/                   # Zustand
│   ├── auth.store.ts         # user + persist
│   └── ui.store.ts           # sidebar, theme
├── services/                 # HTTP services (puras llamadas API)
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── roles.service.ts
│   ├── permissions.service.ts
│   └── catalogs.service.ts
├── hooks/                    # Hooks compartidos
│   ├── useAuth.ts
│   ├── usePermission.ts
│   └── useDebounce.ts
├── features/                 # Por dominio
│   ├── auth/
│   │   ├── hooks/useLoginForm.ts
│   │   ├── components/LoginForm.tsx
│   │   └── pages/LoginPage.tsx
│   ├── users/
│   │   ├── hooks/useUsersPage.ts, useUserForm.ts, useUserMutations.ts
│   │   ├── components/UsersTable*.tsx, UserFormDialog.tsx
│   │   └── pages/UsersPage.tsx
│   └── dashboard/
├── layouts/
│   └── AppLayout.tsx         # Sidebar + Outlet
├── components/
│   ├── ui/                   # shadcn primitives (CLI)
│   └── common/               # DataTable, PageHeader, EmptyState, ConfirmDialog, Pagination, PermissionGate
├── routes/
│   ├── AppRouter.tsx         # Routes + lazy
│   ├── ProtectedRoute.tsx
│   ├── PublicOnlyRoute.tsx
│   └── routes.ts             # Nav config
├── config/
│   └── env.ts                # Env tipado
├── styles/
│   └── globals.css           # Tailwind v4 + shadcn vars
├── test/
│   └── setup.ts
├── App.tsx
└── main.tsx
```

---

## 📐 Convenciones obligatorias

### Componentes ≤ 150 líneas
Si rebasas 150 → split en subcomponentes. Ideal mucho menos.

### Lógica en hooks, JSX limpio
**Anti-patrón** (NO hacer):
```tsx
export const UsersPage = () => {
  const [filters, setFilters] = useState({});
  const { data } = useQuery(...);
  const handleDelete = async (id) => { ... };
  // 200 líneas de lógica + JSX
};
```

**Patrón correcto** (SÍ hacer):
```tsx
// hooks/useUsersPage.ts
export const useUsersPage = () => {
  const [filters, setFilters] = useState({});
  const usersQuery = useUsersQuery(filters);
  const mutations = useUserMutations();
  return { filters, setFilters, ...usersQuery, mutations };
};

// pages/UsersPage.tsx (< 80 líneas)
export const UsersPage = () => {
  const p = useUsersPage();
  return <DataTable data={p.rows} ... />;
};
```

Ver implementación de referencia en `src/features/users/`.

---

## 🔐 Auth dual: Browser + Tauri

Un solo backend sirve a ambos clientes según header:

| Cliente | Detección | Headers | Storage |
|---|---|---|---|
| **Browser** | default | (nada) | Cookies `httpOnly` |
| **Tauri** | `window.__TAURI_INTERNALS__` | `X-Client-Type: tauri` + `Authorization: Bearer` | localStorage (TODO: plugin-stronghold en prod) |

`lib/api.ts` detecta runtime y configura request automático. `lib/tauri.ts` abstrae storage.

### Interceptor refresh

Cuando un request recibe 401:
1. Se encola request original
2. Llama `/auth/refresh` UNA vez (single-flight)
3. Reintenta requests pendientes con nuevo token
4. Si refresh falla → dispara `auth:logout` event → `useAuth` redirige a `/login`

---

## 🎨 shadcn/ui

`components.json` ya configurado. **No se generan todos los primitives upfront** (filosofía shadcn = on-demand).

### Componentes ya incluidos manualmente

Los primitives base ya están escritos en `src/components/ui/` (canonical shadcn):
`button`, `input`, `label`, `card`, `dialog`, `select`, `badge`, `dropdown-menu`,
`table`, `separator`, `avatar`, `skeleton`, `tooltip`, `sheet`, `checkbox`,
`tabs`, `sonner`, `sidebar`.

> Nota: shadcn CLI (`bunx shadcn add ...`) tiene bug en Windows con paths que
> contienen caracteres especiales / espacios (ej. carpeta "Mi música" en
> Documentos). Por eso los primitives están escritos directamente, no via CLI.
> Si quieres agregar más, copia desde [ui.shadcn.com](https://ui.shadcn.com/docs/components).

### Para añadir más cuando los necesites (ya todos listados en el plan):
```bash
bunx --bun shadcn@latest add <component-name>
```

Lista completa solicitada (instalar bajo demanda):
`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `combobox`, `command`, `context-menu`, `data-table`, `date-picker`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `field`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `menubar`, `native-select`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`.

---

## ⚙️ Setup

```bash
# 1. Instalar deps
bun install

# 2. shadcn primitives ya incluidos en src/components/ui/ (no requiere CLI)

# 3. .env
cp .env.example .env
# Editar VITE_API_URL=http://localhost:4000/api/v1

# 4. Levantar
bun dev
```

---

## 🧪 Tests

```bash
bun test            # Vitest run
bun test:ui         # UI interactiva
bun test:coverage   # Cobertura
```

Setup en `src/test/setup.ts`. Tests viven junto a su feature: `features/<feature>/__tests__/`.

---

## 📦 Scripts

| Script | Comando |
|---|---|
| `bun dev` | Servidor dev |
| `bun build` | tsc + Vite build |
| `bun preview` | Preview de build |
| `bun test` | Vitest |
| `bun lint` | Biome lint |
| `bun format` | Biome format |
| `bun check` | Biome check (lint + format) |

---

## 🔄 Estado de módulos

| Módulo | Estado | Notas |
|---|---|---|
| auth | ✅ | LoginPage + refresh interceptor + logout |
| dashboard | ✅ | Stub con cards del user |
| users | ✅ | CRUD completo (table, dialog, filters, pagination, permissions ready) — **úsalo como template** |
| roles | ⏳ | Stub. Replicar patrón users |
| permissions (UI matrix) | ⏳ | Pendiente |
| students | ⏳ | Pendiente |
| teachers | ⏳ | Pendiente |
| parents | ⏳ | Pendiente |
| classrooms | ⏳ | Pendiente |
| grade-groups | ⏳ | Pendiente |
| assets | ⏳ | Pendiente |
| inventory | ⏳ | Pendiente |
| supplies | ⏳ | Pendiente |
| suppliers | ⏳ | Pendiente |
| diagnostics | ⏳ | Pendiente |
| audit-logs | ⏳ | Pendiente (read-only viewer con filtros) |

Cada módulo nuevo sigue el patrón de `src/features/users/`:
1. `services/<feature>.service.ts` (ya creados varios)
2. `features/<feature>/hooks/use<Feature>Page.ts`, `use<Feature>Form.ts`, `use<Feature>Mutations.ts`
3. `features/<feature>/components/<Feature>FormDialog.tsx`, `<Feature>Filters.tsx`, `<Feature>TableColumns.tsx`
4. `features/<feature>/pages/<Feature>Page.tsx`
5. Registrar ruta en `AppRouter.tsx`

---

## 📁 Repositorio

🔗 https://github.com/muke78/Frontend-Kindergarden
