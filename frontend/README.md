# Clase UCC - Aplicativo React con Vite

## Descripción

Este proyecto es un aplicativo desarrollado en **React con Vite** para aprender y aplicar **pruebas unitarias** con Jest y, además, una práctica académica de **consumo de API-REST** (autenticación JWT, protección de rutas y consumo de endpoints reales del backend).

El aplicativo incluye:

* **Sidebar con acordeón** para navegación.
* **Componentes de ejemplo** para verificar dependencias.
* **Ejercicios con pruebas unitarias**:

  * Tablas de Multiplicar (`TablasMul.tsx`)
  * Conversor de Unidades (`UnitConverter.tsx`)
  * Validador de Contraseñas (`PasswordValidator.tsx`)
  * Contador de Clics (`ClickCounter.tsx`)
  * Lista de Tareas (`TodoList.tsx`)

* **Módulo API-REST (nuevo)**:
  * Login con JWT (`views/LoginView.tsx`)
  * Listado de productos desde backend (`views/ProductsView.tsx`)
  * Capa de servicios HTTP (`src/services/http.ts`) y gestión de sesión (`src/services/session.ts`)
  * Rutas protegidas con `Protected` (`src/routes/Protected.tsx`)

---

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/guswill24/ucc_ing_web.git
cd clase-ucc
```

Instalar dependencias:

```bash
npm install
```

---

## Scripts disponibles

* **Iniciar servidor de desarrollo**

```bash
npm run dev
```

* **Compilar para producción**

```bash
npm run build
```

* **Previsualizar build de producción**

```bash
npm run preview
```

* **Ejecutar pruebas unitarias**

```bash
npm test
```

* **Revisar tipos TypeScript**

```bash
npm run type-check
```

* **Linting y formateo**

```bash
npm run lint
npm run format
```

---

## Estructura de Carpetas

```
src/
├─ components/        # Componentes reutilizables (Sidebar, UnitConverter, etc.)
├─ routes/            # Enrutado SPA
│  ├─ AppRoutes.tsx   # Rutas principales
│  └─ Protected.tsx   # Guarda de rutas protegidas (JWT)
├─ services/          # Capa de acceso a datos/API
│  ├─ http.ts         # Wrapper fetch + BASE_URL + Authorization
│  ├─ session.ts      # setToken/getToken/clearToken (localStorage)
│  ├─ auth.ts         # login(email, password)
│  ├─ products.ts     # listProducts/getProduct/createProduct
│  ├─ categories.ts   # listCategories (JWT)
│  └─ profile.ts      # getMe/getMyOrders (JWT)
├─ views/             # Vistas de ejercicios y API-REST
│  ├─ LoginView.tsx   # Formulario de login (API)
│  └─ ProductsView.tsx# Listado de productos (API)
└─ main.tsx           # Entrada principal de React
```

---

## Componentes y funcionalidades

1. **Sidebar.tsx**: Menú lateral con acordeón, permite agrupar ejercicios y ejemplos.
2. **UnitConverter.tsx**: Conversor de unidades (Celsius ↔ Fahrenheit) con input controlado.
3. **PasswordValidator.tsx**: Validador de contraseñas dinámico, muestra requisitos cumplidos.
4. **ClickCounter.tsx**: Contador de clics persistente usando `localStorage`.
5. **TodoList.tsx**: Lista de tareas con agregar y eliminar elementos.
6. **TablasMul.tsx**: Tabla de multiplicar interactiva.

### API-REST (nuevo)
1. **LoginView.tsx**: Formulario controlado (email/password) que llama a `auth.login`, guarda el `access_token` con `setToken` y redirige a `/api/products`.
2. **ProductsView.tsx**: Consume `GET /api/v1/products` desde `products.listProducts`, muestra lista, estados de carga/errores y filtro simple por `limit`.
3. **services/http.ts**: Wrapper `request(path, { method, body, auth })` que agrega `Authorization: Bearer <token>` cuando `auth=true`.
4. **services/session.ts**: utilidades `setToken/getToken/clearToken` usando `localStorage`.
5. **routes/Protected.tsx**: Componente para proteger rutas (si no hay token, redirige a `/api/login`).

---

## Pruebas unitarias

Las pruebas unitarias están desarrolladas con **Jest** y **React Testing Library**.

* Validan la correcta interacción de los componentes.
* Comprobar que `localStorage` persista valores en `ClickCounter`.
* Verificar la lógica de validación en `PasswordValidator`.
* Confirmar el funcionamiento de agregar y eliminar tareas en `TodoList`.
* Aseguran que los componentes principales rendericen correctamente.

Ejecutar todas las pruebas:

```bash
npm test
```

---

## Consideraciones

* Se recomienda **investigar, analizar e interpretar cada ejercicio** antes de ejecutar pruebas unitarias.
* Las pruebas serán evaluadas de manera **individual en clase**, considerando la explicación del proceso y la solución aplicada.

---

## Integración API-REST (uso rápido)

1. Backend encendido en `http://localhost:3000` (ver guía en `specs/guia-paso-a-paso.md`).
2. Navega a `/api/login` y autentícate (ejemplo: `admin@mail.com / admin123`).
3. Tras login, se guarda el token y se redirige a `/api/products`.
4. Desde el menú “API-REST” puedes acceder al listado de productos y (si está configurado) a rutas protegidas con `Protected`.

Notas:
- Base URL del API configurada en `src/services/http.ts` como `http://localhost:3000/api/v1`.
- Para limpiar sesión, usa la acción de “Salir” (o `clearToken()` desde `session.ts`).

Para detalles extendidos (endpoints, errores 400/401/403, roles, ejemplos de código) revisa `specs/guia-paso-a-paso.md` y `specs/guia-integracion-api-rest.md`.

---

## Dependencias principales

* `react`, `react-dom`, `react-router-dom`
* `three`
* `tailwindcss`
* `framer-motion`
* `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/jest`

---

## Autor

**Gustavo Sánchez Rodríguez**
Asignatura: Ingeniería Web
Clase UCC

