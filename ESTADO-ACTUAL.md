# Estado actual del proyecto SAE

**Última actualización:** 3 de noviembre de 2026

Este documento es la referencia vigente. Los documentos de análisis y planificación
(`ANALISIS-TECNICO-SAE.md`, `PLAN-ACTUALIZACION-NEXT-NEST.md`, `DECISION-GRAPHQL.md`)
describen el diagnóstico y el plan original; **el plan ya fue ejecutado**.

---

## Stack actual

### Backend (`sae-backend`)

| Componente | Versión |
|---|---|
| NestJS | **12.3.2** |
| TypeScript | **6.0.3** |
| Node.js | **24 LTS** (Docker `node:24-alpine`) |
| Prisma | 6.19.1 (MySQL) |
| Express | 5.3.0 |
| Jest | 30.5.2 |
| API | **REST únicamente** (GraphQL eliminado) |

### Frontend (`sae-frontend`)

| Componente | Versión |
|---|---|
| Next.js | **16.4.3** (App Router, Turbopack) |
| React | **19.3.1** |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| TanStack Query | 5.x |
| NextAuth | 4.24 |
| Node.js | **24 LTS** |

### Puertos

- Frontend: **3003**
- Backend: **3305** (`API_PREFIX=api` → `/api/...`)

---

## Trabajo realizado

### 1. Eliminación de GraphQL

El sistema tenía dos transportes en paralelo. El frontend usaba GraphQL en 2 archivos
(de 341) y el backend mantenía 35 resolvers. Se consolidó todo en REST.

- Frontend: −31.900 líneas (`lib/graphql/`, codegen, 7 dependencias)
- Backend: −12.300 líneas (35 resolvers, 688 decoradores en 112 archivos, `schema.gql`,
  `common/types/graphql.ts`, 4 dependencias)
- El backend quedó sin ninguna referencia a GraphQL (`npm ls` del grafo devuelve *empty*)

### 2. Actualización de frameworks

| Fase | Resultado |
|---|---|
| Node 24 LTS | Dockerfiles + `.nvmrc` en ambos proyectos |
| Next.js 15.5.3 → 16.4.3 | `middleware.ts` → `proxy.ts`, Turbopack por defecto, `next lint` → ESLint CLI |
| NestJS 10 → 11 | Express 5: `forRoutes("*")` → `forRoutes("{*splat}")` |
| NestJS 11 → 12 | TypeScript 6, Jest 30, `baseUrl` eliminado, scripts con `--experimental-vm-modules` |

### 3. Correcciones que aparecieron en el camino

- `moduleNameMapper` de Jest incompleto: los 12 e2e no ejecutaban **ningún** test
- Crash en `companies/list`: `categories` recibía `{data, meta}` y llamaba `.sort()`
- Imports `src/prisma/...` (solo resolvían por `baseUrl`) → `@prisma/...`
- 4 errores de lint nuevos por `<a>` internos → `next/link`
- Filtro `status` de equipos que nunca se enviaba al backend (documentado en el código)

---

## Verificación al día de hoy

```
backend   tsc --noEmit  -> 0 errores
          nest build    -> OK
          test:e2e      -> 19 pasan / 0 fallan (3 suites: auth, seguridad archivos, smoke test de negocio) en ~15s
          runtime       -> /api/health 200, /api/docs 200, /api/companies 401

frontend  tsc --noEmit  -> 0 errores
          next build    -> OK, 60 rutas
          eslint        -> 471 warnings / 0 errores
          runtime       -> /login 200, /dashboard 307
```

### 4. Contrato de API (OpenAPI)

El CRUD genérico recibía `@Body() dto: any`, y con metatipo `Object` el
`ValidationPipe` **no valida**. Dos consecuencias: los endpoints aceptaban
cualquier body (mass assignment) y Swagger no podía documentarlos.

- `create`/`update` tipados con su DTO en 20 controllers (30 endpoints) — `2a52d83`
- `PartialType` movido a `@nestjs/swagger` en 22 DTOs: el de `@nestjs/mapped-types`
  no propaga `@ApiProperty`, así que esos schemas salían **vacíos** — `78108b1`
- `openapi.json` versionado, exportado desde la app compilada (sin abrir puerto)

```bash
npm run openapi:export     # backend: regenera openapi.json
npm run openapi:types      # frontend: regenera lib/api/schema.d.ts
```

Contrato: **168 paths, 80 schemas, 0 vacíos** (antes había 22 vacíos).

**Límite conocido:** documenta los cuerpos de **entrada** (Create/Update) pero no
los de **respuesta**, porque `BaseController.findAll/findOne` no declaran
`@ApiOkResponse` con un tipo concreto. Tipar respuestas requiere ese decorador por
controller, con la misma mecánica del paso anterior.

---

## Pendiente, por prioridad

### Bloqueantes de seguridad (sin resolver)

P0-1, P0-2, P0-3, P0-4, P0-6, P0-7 y P0-8 están cerrados. El único ítem abierto es P0-5.

| ID | Problema | Verificación |
|---|---|---|
| ~~P0-1~~ | ~~44 endpoints REST sin autenticación~~ | **RESUELTO** (`3d142b6`): guards globales + `@Public()` |
| ~~P0-2~~ | ~~IDOR en `/api/server-files/:id/download`~~ | **RESUELTO** (`a0a4e70`): control de pertenencia por empresa + 4 tests |
| ~~P0-3~~ | ~~Subida de archivos sin validar tipo MIME~~ | **RESUELTO** (`9da37c5`): whitelist MIME/extensiones en Multer + cleanup temporales + 2 tests |
| ~~P0-4~~ | ~~Sin `prisma/migrations/`~~ | **RESUELTO** (`a0a4e70`): baseline 0_init verificado sobre base vacía; el entrypoint aplica `migrate deploy` |
| P0-5 | Secretos reales en `.env` y repositorios sin remoto | Sin backup fuera del equipo |
| ~~P0-6~~ | ~~CORS abierto (`enableCors()` sin orígenes)~~ | **RESUELTO** (`aaec5df`): whitelist vía `CORS_ORIGINS` en `main.ts` |
| ~~P0-7~~ | ~~`@Roles(Role.MANAGER)` referencia roles que no existen en Prisma~~ | **RESUELTO** (`aaec5df`): enum unificado con Prisma + limpieza en controllers |
| ~~P0-8~~ | ~~Escalada de privilegios por mass assignment en el CRUD genérico~~ | **RESUELTO** (`574ddb0` en `/users`, `2a52d83` en los 30 endpoints restantes) |

### Deuda técnica

| Ítem | Detalle |
|---|---|
| ~~9 errores de lint (frontend)~~ | **RESUELTO** (`3bf68e8`): `@ts-nocheck` eliminados en los forms de equipos y neumáticos |
| ~~64 e2e fallando~~ | **RESUELTO** (`57647c1`): Suite consolidada (Plan A: poda de 12 specs obsoletos + Smoke Test de flujos clave) |
| 0 tests unitarios | 16 carpetas `tests/` vacías en el backend |
| Sin CI | Nada valida `tsc`, build ni migraciones en cada PR |
| `strictNullChecks: false` | En el backend |
| 1 vulnerabilidad crítica | En dependencias de producción del frontend |

---

## Commits de la actualización

### `sae-frontend`

| Hash | Descripción |
|---|---|
| `497f98d` | shadcn/ui + dependencias de diseño |
| `7781353` | Refactor de la capa de aplicación de empleados |
| `8077041` | Hooks `useCompanies`/`useEquipments` a REST |
| `56d1b74` | Eliminación de la capa GraphQL |
| `5bafeec` | Next.js 16.4.3 + React 19.3.1 |
| `5e8151c` | Node 24 LTS |
| `5cb0257` | Docs: actualizar la documentación al stack vigente |
| `3bf68e8` | Fix(forms): eliminar los @ts-nocheck restaurando el Combobox con API de opciones |
| `d7ea134` | Feat(api): tipos generados desde el contrato OpenAPI |
| `7fb710d` | Feat(api): regenerar schema.d.ts tras actualización de openapi |

### `sae-backend`

| Hash | Descripción |
|---|---|
| `0314840` | `moduleNameMapper` de Jest |
| `58f699c` | Eliminación de resolvers y módulo GraphQL |
| `75b974e` | Eliminación de decoradores GraphQL en DTOs |
| `2890b73` | NestJS 11 (Express 5) |
| `690f927` | Node 24 LTS |
| `0db4f73` | NestJS 12 + TypeScript 6 + Jest 30 |
| `2307e56` | Docs: actualizar README a NestJS 12 y eliminar reporte obsoleto |
| `3d142b6` | Autenticación global en todos los endpoints (fail-closed) |
| `574ddb0` | Cerrar escalada de privilegios en el CRUD de usuarios |
| `2a52d83` | Tipar create/update del CRUD genérico en 20 controllers |
| `78108b1` | Exportar contrato OpenAPI y completar los schemas |
| `a0a4e70` | Cerrar IDOR en archivos y establecer baseline de migraciones |
| `aaec5df` | Cerrar P0-6 (CORS) y P0-7 (sincronizar roles con Prisma) |
| `9da37c5` | Cerrar P0-3 con validación de MIME y extensiones en upload |
| `57647c1` | Consolidar suite e2e en smoke test y seguridad (Plan A) |

### Ramas

El trabajo está en dos ramas **sin mergear**: `chore/next-16` (frontend) y `chore/nest-11`
(backend). Existe el tag `pre-graphql-removal` en ambos repos como punto de retorno.
