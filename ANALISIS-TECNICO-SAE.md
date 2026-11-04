# Análisis técnico del proyecto SAE (histórico)

> Snapshot realizado antes de la migración a Next.js 16, NestJS 12, REST y CI.
> Para el estado vigente consultar `ESTADO-ACTUAL.md`.

> **Estado:** plan ejecutado. El estado vigente esta en [ESTADO-ACTUAL.md](ESTADO-ACTUAL.md).


**Fecha:** 27 de octubre de 2026
**Alcance:** `sae-backend` (NestJS + Prisma + GraphQL/REST) y `sae-frontend` (Next.js 15 + React 19)
**Método:** inspección estática del código, ejecución de `tsc`, ESLint, `npm audit` y revisión del modelo de datos. **No** se levantó la base de datos ni se ejecutó la aplicación.

---

## 1. Resumen ejecutivo

SAE es una aplicación de gestión empresarial (empresas, empleados, equipos, cubiertas/neumáticos, reportes y expedientes digitales) con **~55.000 líneas de TypeScript** repartidas en dos aplicaciones. El nivel de funcionalidad es alto: 48 modelos de datos, 123 endpoints REST, 81 operaciones GraphQL, 60 páginas y 107 componentes.

La arquitectura está **bien pensada pero desigualmente ejecutada**. Hay patrones sólidos y reutilizables (BaseService/BaseController/BaseResolver, capa de servicios en el frontend, DTOs validados), y al mismo tiempo hay **agujeros de seguridad críticos** que no son teóricos: 44 endpoints escriben y leen datos sin ninguna autenticación, y el módulo de archivos permite descargar cualquier documento del sistema enumerando un ID.

**Veredicto:** el proyecto es un buen producto en construcción con deuda de "última milla". No lo veo como un problema de diseño sino de **disciplina de cierre**: las piezas están, pero falta aplicarlas de forma consistente en todas partes. Los tres bloqueantes reales son seguridad, migraciones de base de datos y ausencia total de tests.

| Dimensión | Nota | Comentario |
|---|---|---|
| Funcionalidad | 8/10 | Cobertura de dominio amplia y coherente con el negocio |
| Arquitectura | 7/10 | Buenas abstracciones; conviven dos stacks de datos |
| Seguridad | **3/10** | Endpoints sin autenticar, IDOR, secretos y CORS abierto |
| Datos / migraciones | **3/10** | Sin `migrations/`; el despliegue no aplica cambios de esquema |
| Testing | **1/10** | 0 tests unitarios, 0 tests de frontend, e2e con auth desactivada |
| Tipado | 5/10 | Compila, pero `strict` desactivado y 263 `any` |
| Operación (CI/Docker) | 4/10 | Dockerfiles razonables, sin CI, dev-dependencies en producción |
| Documentación | 7/10 | Mucha y detallada, con desfases respecto al código |

---

## 2. Métricas verificadas

### Backend (`sae-backend`)

| Métrica | Valor |
|---|---|
| Archivos TypeScript en `src/` | 382 |
| Líneas de código en `src/` | 19.129 |
| Modelos Prisma | 48 |
| Esquema Prisma | 1.230 líneas |
| Controllers REST | 44 |
| Resolvers GraphQL | 35 |
| Endpoints REST | 123 |
| Queries + Mutations GraphQL | 81 |
| Tests unitarios (`*.spec.ts`) | **0** |
| Carpetas `tests/` vacías | **16** |
| Tests e2e | 12 archivos |
| Migraciones Prisma | **0 (no existe `prisma/migrations/`)** |
| Vulnerabilidades (`npm audit --omit=dev`) | 67 (3 críticas, 43 altas) |
| `npm run lint` | **Falla** (sin `eslint.config.*`, ESLint 9) |
| `npx tsc --noEmit` | Pasa (con `strict` desactivado) |

### Frontend (`sae-frontend`)

| Métrica | Valor |
|---|---|
| Archivos `.ts`/`.tsx` | 341 |
| Líneas de código | 35.835 |
| Páginas (`page.tsx`) | 60 |
| Páginas con `"use client"` | **53 de 60 (88%)** |
| `loading.tsx` | **0** |
| `error.tsx` | 1 (solo raíz) |
| Componentes | 107 (34 en `components/ui`) |
| Problemas ESLint | **509** (9 errores, 500 warnings) |
| — `no-explicit-any` | 263 |
| — imports solo-tipo | 155 |
| — variables sin usar | 81 |
| Archivos con `@ts-nocheck` | 3 |
| Tests | **0** |
| Vulnerabilidades (`npm audit --omit=dev`) | 50 (4 críticas, 26 altas) |
| `npx tsc --noEmit` | **Pasa limpio** (excelente señal) |

---

## 3. Arquitectura actual

```
                    ┌──────────────────────────────┐
   Navegador  ────► │  sae-frontend :3003          │
                    │  Next.js 15 App Router       │
                    │  NextAuth v4 (JWT)           │
                    │  TanStack Query + Zod        │
                    └───────────┬──────────────────┘
                                │
              ┌─────────────────┴──────────────────┐
              │  DOS capas de datos conviviendo    │
              │  A) axios  → REST  (dominante)     │
              │  B) graphql-request → GraphQL (2 hooks) │
              └─────────────────┬──────────────────┘
                                │
                    ┌───────────▼──────────────────┐
                    │  sae-backend :3305           │
                    │  NestJS 10                   │
                    │  44 controllers REST         │
                    │  35 resolvers GraphQL        │
                    │  Prisma 6 ──► MySQL          │
                    └──────────────────────────────┘
```

**Backend.** Organización por dominio (`modules/`) con tres capas: `controller|resolver → service → Prisma`. Existe una tríada genérica reutilizable (`BaseService`, `BaseController`, `BaseResolver`) que aplica `@UseGuards(JwtAuthGuard, RolesGuard)` a nivel de clase; los módulos que heredan de ella quedan protegidos automáticamente. Además hay dos subsistemas con patrón *strategy* bien resueltos y documentados: `reports/` (exportación a Excel/PDF/CSV) y `server-files/` (almacenamiento por entidad).

**Frontend.** App Router con route groups por dominio. La capa de datos real es `lib/api/*.service.ts` (41 servicios, todos extendiendo `BaseApiService`) + `lib/hooks/` con TanStack Query (19 hooks). Los formularios usan React Hook Form + Zod. La UI es shadcn/ui (34 componentes) sobre Tailwind v4.

---

## 4. Fortalezas

Vale la pena decirlas porque son reales y son la base sobre la que construir:

1. **Compila limpio en ambos lados.** `tsc --noEmit` sale en 0 en backend y frontend. Con 55k líneas, eso no es trivial.
2. **Abstracciones correctas.** `BaseService`/`BaseController`/`BaseResolver` evitan duplicar CRUD en 30+ módulos. `StorageFactory` y las estrategias de reportes son ejemplos de diseño extensible bien aplicado.
3. **Validación de entrada global.** El `ValidationPipe` de `main.ts` usa `whitelist`, `forbidNonWhitelisted` y `forbidUnknownValues`: es la configuración estricta, no la permisiva.
4. **El modelo de datos está pensado.** 48 modelos con índices explícitos, claves únicas compuestas (`@@unique([businessCategoryId, name])`), `onDelete` diferenciado (Cascade vs SetNull) y una convención `createdAt/updatedAt/isActive/deletedAt` documentada en el propio schema.
5. **Defensa en profundidad en el frontend.** Middleware de rutas + NextAuth + `forbidden/page.tsx` + manejo de sesión tipado.
6. **Documentación abundante.** 9 documentos en `docs/` del frontend (~3.000 líneas), README de 1.673 líneas en el backend, guías específicas de estrategias de archivos y reportes.
7. **Dockerfiles con buenas intenciones.** Multi-stage, usuario no root, healthchecks, `npm ci`.

---

## 5. Hallazgos priorizados

### 🔴 P0 — Bloqueantes (resolver antes de exponer el sistema)

---

#### P0-1. 44 endpoints REST sin autenticación, incluidos escrituras y archivos

**Evidencia.** `src/app.module.ts` no registra ningún `APP_GUARD` global. La protección depende de heredar de `BaseController` (que sí tiene `@UseGuards(JwtAuthGuard, RolesGuard)` en su línea 54). Diez controllers **no heredan** y **no declaran** `@UseGuards`:

| Controller | Endpoints | Riesgo |
|---|---|---|
| `server-files.controller.ts` | 3 | Subida y descarga de documentos |
| `tire-reports.controller.ts` | 10 | Exportación de datos operativos |
| `tire-assignments.controller.ts` | 4 | Montaje/desmontaje de cubiertas |
| `tire-inspections.controller.ts` | 5 | Inspecciones |
| `tire-positions.controller.ts` | 5 | Posiciones |
| `tire-recaps.controller.ts` | 5 | Recauchutados |
| `tire-rotations.controller.ts` | 5 | Rotaciones |
| `tire-events.controller.ts` | 4 | Eventos |
| `history-log.controller.ts` | 2 | Historial de empleados |
| `reports.controller.ts` | 1 | Exportaciones |

Cualquiera con acceso de red puede crear, modificar y leer estos datos. El propio código lo delata en `tire-assignments.controller.ts:16`:

```ts
// si tenes auth, extrae userId del request y pásalo al service
return this.svc.mount(dto /*, userId */);
```

**Corrección (bajo esfuerzo, alto impacto):** registrar los guards como globales en `app.module.ts` y usar un decorador `@Public()` para las excepciones (`/health`, login):

```ts
providers: [
  { provide: APP_GUARD, useClass: JwtAuthGuard },
  { provide: APP_GUARD, useClass: RolesGuard },
]
```

Esto protege por defecto y convierte "olvidarse del guard" en "olvidarse de abrir el endpoint", que es el modo de falla correcto.

---

#### P0-2. IDOR en la descarga de archivos

**Evidencia.** `server-files.controller.ts:172-203`:

```ts
@Get(":id/download")
async download(@Param("id") id: string, @Res() res: Response) {
  const doc = await this.serverFilesService.findOne(+id);
  const filePath = isAbsolute(doc.data.path) ? doc.data.path : join(process.cwd(), doc.data.path);
  return res.download(filePath, doc.data.filename);
}
```

Sin autenticación, sin verificación de pertenencia y con IDs autoincrementales: `GET /api/server-files/1/download`, `/2/`, `/3/`… recorre todo el repositorio documental (legajos de empleados, documentación de empresas). Es una fuga de datos personales por enumeración secuencial.

**Corrección:** guard JWT + validar que el archivo pertenece a la empresa del usuario, y usar identificadores no secuenciales (UUID) para las rutas públicas.

---

#### P0-3. Subida de archivos sin validación de tipo

**Evidencia.** `server-files.controller.ts:144-158`. El `FileInterceptor` sólo limita tamaño (10 MB). No hay `fileFilter`, ni lista blanca de MIME, ni verificación de contenido real (magic bytes). El nombre se aleatoriza, pero **se preserva la extensión original** (`extname(file.originalname)`), así que es posible almacenar `.html`, `.svg`, `.js` o ejecutables. Combinado con P0-1 (sin auth) y con que el backend sirve archivos desde disco, se habilita *stored XSS* y distribución de malware desde el dominio de la aplicación.

**Corrección:** lista blanca de MIME + extensión, verificación de *magic bytes*, servir descargas con `Content-Disposition: attachment` y `Content-Security-Policy: sandbox`.

---

#### P0-4. No existe estrategia de migraciones: el despliegue nunca aplica cambios de esquema

**Evidencia.** No existe `sae-backend/prisma/migrations/`. El único `Dockerfile` de producción llama a un entrypoint que **omite explícitamente** la sincronización, en `docker/entrypoint.sh:11-17`:

```sh
if [ "$NODE_ENV" = "production" ]; then
  echo "📦 Skipping Prisma migrations (user request)"
  # npx prisma migrate deploy
else
  echo "🧪 Skipping schema sync (user request)"
  # npx prisma db push
fi
```

Consecuencia: el esquema de producción se administra a mano (o con `db push` desde una máquina de desarrollo). No hay historial, no hay rollback, no hay forma de saber qué versión del esquema corre en cada entorno, y los despliegues no son reproducibles. En un sistema con 48 modelos y datos reales, esto es el hallazgo con mayor probabilidad de causar un incidente grave.

**Corrección:** `prisma migrate dev` en local para generar el historial inicial (baseline), `migrate deploy` en el entrypoint de producción, y un job de CI que verifique que el esquema y las migraciones coinciden (`prisma migrate diff --exit-code`).

---

#### P0-5. Credenciales reales en disco y ausencia de copia remota

**Evidencia.** `sae-backend/.env` contiene credenciales de MySQL de un entorno real (host privado, usuario, contraseña de root) junto con `JWT_SECRET` y `JWT_REFRESH_SECRET` operativos. `sae-frontend/.env` contiene el `NEXTAUTH_SECRET` real. Ambos están correctamente en `.gitignore`, así que **no** están versionados — bien resuelto.

El problema es otro: `git remote -v` no devuelve nada en ninguno de los tres repositorios. El código y las credenciales existen **sólo en este equipo**. Un disco perdido = proyecto perdido. Y como `.env` viaja junto al código, cualquier backup informal del directorio arrastra los secretos.

Además, `.env.example` del frontend incluye un `NEXTAUTH_SECRET` con valor por defecto plausible (`sae-nextauth-secret-key-2024-...`); los desarrolladores lo copian tal cual y terminan con un secreto compartido y público.

**Corrección:** (1) crear remotos y respaldar ya; (2) rotar los secretos actuales porque estuvieron en claro en disco sin respaldo controlado; (3) reemplazar el valor de `.env.example` por un placeholder vacío y documentar cómo generarlo.

---

#### P0-6. CORS completamente abierto en ambos extremos

**Evidencia.** Backend, `main.ts:23`: `app.enableCors();` sin argumentos → refleja cualquier origen. Frontend, `next.config.ts:10`: `Access-Control-Allow-Origin: "*"` sobre `/api/*`. Sumado a que el token de acceso se expone en la sesión del cliente (ver P2-4), cualquier sitio puede invocar la API desde el navegador del usuario.

**Corrección:** lista blanca de orígenes por variable de entorno (`CORS_ORIGINS`), método y headers explícitos.

---

#### P0-7. `@Roles(Role.MANAGER)` referencia roles que no existen en la base

**Evidencia.** Hay **dos enums `Role` incompatibles**:

- `prisma/schema.prisma:40` → `enum Role { USER, ADMIN }`
- `src/common/decorators/roles.decorator.ts:4` → `{ ADMIN, USER, MANAGER, EMPLOYEE }`

Y el código usa roles inexistentes en 8 lugares: `@Roles(Role.ADMIN, Role.MANAGER)`. Como ningún usuario puede tener `MANAGER`, **esas rutas quedan efectivamente restringidas a ADMIN**, y la intención del desarrollador (que un manager acceda) nunca se cumple. Es un fallo silencioso: no rompe, autoriza de menos.

**Corrección:** una sola fuente de verdad. Extender el enum de Prisma con `MANAGER`/`EMPLOYEE` (y migrar), o eliminar los valores fantasma del decorador.

---

### 🟠 P1 — Deuda estructural

---

#### P1-1. Dos stacks de datos en el frontend; uno está ~95% muerto

**Evidencia.** Conviven, y en parte se solapan:

| Stack | Archivos | Uso real |
|---|---|---|
| REST (`lib/api/` + `lib/hooks/`) | 41 servicios, 19 hooks | **Dominante**: 54 imports en `app/` |
| GraphQL (`lib/graphql/` + codegen) | `generated.ts` (3.600 líneas), `schema.json` (20.578 líneas), 12 `.graphql` | **2 hooks** (`useCompanies`, `useEquipments`) |

Peor: esos dos hooks son **híbridos** — leen por GraphQL (12 y 10 referencias) y mutan por REST, con `select: (data: any)` para adaptar las formas de respuesta (`useCompanies.ts:30`). Es decir, el mismo archivo habla dos protocolos y parchea la diferencia con `any`.

Además hay endpoints hardcodeados en código de cliente:

```ts
// lib/hooks/useCompanies.ts:22
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3305/graphql";
```

Ese fallback a `localhost` se compila en el bundle y se usa en producción si la variable falta.

**Impacto:** ~24.000 líneas de artefactos generados y una segunda capa de datos que hay que entender, mantener y versionar sin beneficio. El backend mantiene 81 operaciones GraphQL que el frontend casi no consume.

**Decisión necesaria (no técnica, de producto):** o se completa la migración a GraphQL de forma consistente, o se elimina la capa. Mantener ambas es lo único que no tiene sentido. Mi recomendación: **consolidar en REST** (es donde está el 95% del código y funciona), eliminar `lib/graphql/` y el codegen del frontend, y dejar GraphQL en el backend sólo si hay consumidores externos.

---

#### P1-2. Cero tests automatizados, y los que existen desactivan la seguridad

**Evidencia.** El backend tiene **0 archivos `*.spec.ts`** y **16 carpetas `tests/` vacías** — el andamiaje de tests se creó y nunca se llenó. El frontend tiene **0 tests** de cualquier tipo.

Los 12 tests e2e existentes no compensan, y en un punto son contraproducentes: `test/utils.ts` reemplaza los guards reales por un `AllowAllGuard`:

```ts
class AllowAllGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean { return true; }
}
```

Con Prisma también *mockeado*, esos archivos son en realidad tests de controller con la seguridad **y** la persistencia anuladas. **Ningún test podía detectar P0-1** (endpoints sin auth) por construcción. Cobertura actual de módulos: ~11 de 30, sin auth, sin empleados, sin equipos, sin usuarios, sin archivos.

**Corrección por orden de retorno:**
1. Tests de integración que **sí** ejerciten los guards (assertar 401/403) — protegen el hallazgo más grave.
2. Tests unitarios de la lógica de negocio no trivial: `employees.service.ts` (353 líneas), `tire-assignments.service.ts` (233), `employee-vacations.service.ts` (209), cálculo de reportes.
3. Un smoke test de frontend (Playwright) del flujo login → listado → alta.

---

#### P1-3. Tipado débil donde más importa

**Evidencia.** `sae-backend/tsconfig.json`:

```json
"strictNullChecks": false,
"noImplicitAny": false,
"strictBindCallApply": false,
"forceConsistentCasingInFileNames": false
```

Es el `tsconfig` por defecto de NestJS sin endurecer. En un dominio con borrado lógico, `null` es precisamente el valor que hay que distinguir: con `strictNullChecks: false`, TypeScript no detecta el acceso a un registro ya eliminado — el bug que más va a aparecer en producción.

En el frontend, el typecheck pasa limpio, pero hay **263 `any` explícitos** y **3 formularios críticos con `@ts-nocheck` en la línea 1**, que anula todo el chequeo del archivo:

- `components/forms/equipment-form.tsx` (610 líneas)
- `components/forms/equipment-model-form.tsx`
- `components/forms/tire-model-form.tsx`

Son justamente los formularios más grandes y complejos. `@ts-nocheck` es el lugar donde los bugs se esconden.

**Corrección:** activar `strictNullChecks` en el backend módulo por módulo (o de una, aceptando el ruido inicial); quitar los `@ts-nocheck` tipando los `register()` de RHF con genéricos.

---

#### P1-4. Borrado lógico declarado pero no aplicado

**Evidencia.** El schema documenta la convención (`schema.prisma:11-17`) y **16 modelos** tienen `deletedAt`. Pero en todo `src/`:

- sólo **12 lugares** filtran `deletedAt: null` en las consultas,
- sólo **5 lugares** escriben `deletedAt: new Date()` al borrar,
- y hay **16 llamadas a `delete`/`deleteMany`** (borrado físico) en 12 archivos: `base.service.ts`, `contacts.service.ts`, `employee-incident.service.ts`, `employee-vacations.service.ts`, `cities/provinces/countries.service.ts`, `family.service.ts`, `tire-inspections`, `tire-positions`, `tire-recaps`, `tire-rotations`.

El resultado es el peor de los dos mundos: los datos "borrados" lógicamente **siguen apareciendo** en la mayoría de los listados, y los borrados físicos **pierden historial irreversiblemente**. En un sistema con `HistoryLog`, perder historial contradice el propósito del módulo.

**Corrección:** una extensión de Prisma (`$extends` con query middleware) que aplique `deletedAt: null` por defecto y convierta `delete` en `update({ deletedAt })`. Se implementa una vez y funciona en los 48 modelos.

---

#### P1-5. Multi-tenancy declarada, no implementada

**Evidencia.** `companyId` aparece en ~20 modelos y `User.companyId` es obligatorio, lo que sugiere un diseño multi-empresa. Pero **no existe una sola consulta que filtre por la empresa del usuario**: la búsqueda de `companyId: user.*` no devuelve resultados en todo `src/`. Además `User.companyId` tiene `@default(1)`, lo que permite crear usuarios sin empresa real asignada.

En la práctica: **cualquier usuario autenticado ve los datos de todas las empresas**, y los 44 endpoints sin auth (P0-1) no ven nada en absoluto. Para un sistema de administración empresarial, esto puede ser un problema contractual si el modelo de negocio asume aislamiento por cliente.

**Corrección:** si el multi-tenant es un requisito, aplicar el mismo enfoque que P1-4 (extensión de Prisma que inyecte `companyId` desde el contexto de request). Si no lo es, quitar los defaults y documentar que es mono-empresa.

---

#### P1-6. `npm run lint` no funciona en el backend

**Evidencia.** `package.json` declara `"lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"` y ESLint 9.39.1, pero **no existe `eslint.config.js`** (ni `.eslintrc.*`). Ejecutarlo da:

```
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
```

Es decir: el backend no tiene lint. Las dependencias `@typescript-eslint/parser`, `plugin` y `eslint-config-prettier` están instaladas y sin usar, y no hay `.prettierrc` en ninguno de los dos proyectos (aunque `format` y `prettier` sí están declarados).

En el frontend el lint **sí** corre, con 509 problemas, y hay un detalle que importa: `eslint.config.mjs` importa `@eslint/js` y `typescript-eslint` pero **nunca importa `eslint-config-next`**, que sí está instalado. Por lo tanto no se aplican ninguna de las reglas específicas de Next.js (imágenes, hooks, links). Y el script `lint` usa `next lint`, que está **deprecado en Next 15.5 y se elimina en Next 16**.

**Corrección:** crear `eslint.config.mjs` en el backend; en el frontend sumar `...nextPlugin.configs.coreWebVitals` al flat config y migrar el script a `eslint .`.

---

### 🟡 P2 — Mantenibilidad y operación

---

#### P2-1. El App Router se usa como si fuera una SPA

60 páginas, **53 con `"use client"`** (88%). No hay **ningún** `loading.tsx`, hay un solo `error.tsx`, y no se hace fetching en Server Components. Consecuencias concretas: sin streaming, sin `Suspense` boundaries, sin caché de datos en servidor, y todo el JS de cada página se envía al cliente. Se paga el costo de Next.js sin aprovechar sus beneficios.

**Corrección gradual:** convertir primero los listados de sólo lectura (`companies/list`, `employees/list`, `tires/list`) a Server Components con fetching en servidor y `loading.tsx` por segmento. No hace falta reescribir; sirve para las rutas de mayor peso.

---

#### P2-2. Sin CI ni verificación automática

**Evidencia.** No existe `.github/workflows/` ni ningún pipeline. Nada impide mergear código que no compila o que rompe tipos. Con un `tsc` que pasa limpio en ambos proyectos, montar el pipeline es barato y de retorno inmediato.

**Mínimo viable:** `tsc --noEmit` + `eslint` + `prisma migrate diff --exit-code` en cada PR.

---

#### P2-3. Dependencias con vulnerabilidades críticas y sin parche disponible

| Proyecto | Total | Críticas | Altas |
|---|---|---|---|
| Backend | 67 | 3 (`express`, `proxy-addr`, `tar`) | 43 |
| Frontend | 50 | 4 (`next`, `next-auth`, `express`, `proxy-addr`) | 26 |

Las dos más importantes:

- **`next@15.5.3`** acumula avisos críticos sin versión de parche en esa línea (RCE en Image Optimization, *request smuggling*, bypass de middleware, DoS en Server Actions). Es un paquete de producción directo.
- **`next-auth@4.24.13`** acumula avisos críticos sin parche en v4.

Señal reveladora: `eslint-config-next` ya está en **16.1.1** mientras `next` sigue en **15.5.3**. La actualización a Next 16 estaba en curso y quedó a mitad de camino. Completarla resuelve de un golpe la mayoría de los avisos críticos del frontend y habilita React 19 de forma soportada.

Otras observaciones de dependencias:
- `shadcn` figura como **dependencia de producción** (es una CLI de desarrollo) y arrastra `@babel/core`, `@modelcontextprotocol/sdk`, `postcss`, `ts-morph`: es el origen de buena parte de las vulnerabilidades y del peso instalado.
- **Tres librerías de primitivas UI conviviendo**: `@base-ui/react`, `radix-ui` y 13 paquetes `@radix-ui/react-*` individuales.
- `json2csv@6.0.0-alpha.2` — versión **alpha** en dependencias de producción.
- Tres librerías de PDF/documentos solapadas en el backend: `pdfkit` + `pdf-lib` + `docx`.
- `bcrypt@5.1.1` requiere compilación nativa (fricción en Docker/Alpine); `bcryptjs` o `argon2` son alternativas más simples.

---

#### P2-4. Gestión de sesión: refresh token almacenado pero nunca usado

**Evidencia.** `lib/api/auth.ts` guarda `refreshToken` en el JWT callback (líneas 58-66) y lo expone en la sesión (línea 73), pero **no hay lógica de renovación**: no existe un `refreshAccessToken` ni detección de expiración. El backend emite `JWT_EXPIRATION=1d`; a las 24 h la sesión de NextAuth sigue viva pero todas las llamadas a la API fallan con 401 hasta que el usuario vuelve a loguearse.

Además el `accessToken` viaja al cliente en el objeto de sesión, lo que lo expone a cualquier XSS. Lo correcto es mantenerlo en una cookie `httpOnly` y hacer las llamadas sensibles del lado servidor.

---

#### P2-5. Docker: dependencias de desarrollo en producción

**Backend** (`Dockerfile`): define el stage `deps` con `npm ci --omit=dev`... y **nunca lo usa**. El `runner` copia `node_modules` desde `builder`, que instaló `--include=dev`. La imagen de producción lleva así TypeScript, Jest, ESLint, `prisma` CLI y `@nestjs/cli`. También copia `src/` completo al runtime (código fuente en la imagen) y queda un `RUN date > dummy` que sólo sirve para invalidar caché.

**Frontend**: mismo patrón — `COPY --from=builder /app/node_modules` proviene del stage de desarrollo. Y pasa `NEXTAUTH_SECRET` como `ARG` de build (líneas 44-50): **el secreto queda grabado en las capas de la imagen**, recuperable con `docker history`. Un secreto nunca debe ser `ARG`.

**Corrección:** en el `runner`, copiar `node_modules` del stage `deps` de producción; inyectar `NEXTAUTH_SECRET` como variable de entorno en runtime, no en build. Considerar `output: 'standalone'` en Next para reducir la imagen.

---

#### P2-6. Los dos repositorios están anidados como *gitlinks* sin `.gitmodules`

**Evidencia.** El repo raíz trackea `sae-backend` y `sae-frontend` con modo `160000` (gitlink de submódulo), pero **no existe `.gitmodules`**. Un `git clone` del repo raíz produce dos directorios vacíos, sin pista de dónde obtener el contenido. Y ningún repositorio tiene remoto.

**Corrección:** decidir el modelo — submódulos reales (`git submodule add`), o monorepo con workspaces de npm/pnpm (probablemente lo mejor aquí, dado que comparten versiones y se despliegan juntos).

---

#### P2-7. Desfases entre documentación y código

Ejemplos verificados:

| Documento dice | El código hace |
|---|---|
| `AGENTS.md`: `NEXT_PUBLIC_API_BASE_URL` | `lib/env.ts:6` y `apiClient.ts:53`: `NEXT_PUBLIC_API_URL` |
| Docs: backend en `:3305` | `Dockerfile`: `EXPOSE 3005`, `.env`: `PORT=3305` |
| `.env.example`: `http://localhost:port` | No es una URL válida; `env.ts` la rechaza con `z.string().url()` |
| `.env.example` backend: sólo DB y JWT | `.env` real también usa `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD` (sin documentar) |

Con dos puertos distintos para el mismo servicio, cualquiera que siga la documentación al pie de la letra termina con un frontend que no conecta.

---

### ⚪ P3 — Higiene

- **Artefactos de herramientas de IA versionados**: `.kilo/`, `plans/` (5 documentos de planificación), `.zenflow/` (borrado pero presente en el índice de git), `sae-frontend/.agents/skills/`. Son ~decenas de archivos que no son parte del producto.
- **`schema.json` de GraphQL: 20.578 líneas** versionadas. Es un artefacto de introspección regenerable; no debería estar en el repo.
- **`backend-out.log` / `backend-err.log`** en el directorio de trabajo (ignorados por git, correcto, pero conviene sacarlos del árbol).
- **Nombres de archivo inconsistentes**: conviven `entity/` y `entities/` dentro de `modules/equipment/`, y `equipment-form.tsx` junto a `create-tire-form.tsx`.
- **`graphql.ts` generado en `src/common/types/`**: 2.870 líneas de artefacto dentro del código fuente. Funciona, pero conviene generarlo a `src/generated/` y tratarlo como build output.

---

## 6. Tabla resumen de hallazgos

| ID | Hallazgo | Severidad | Esfuerzo | Impacto si no se corrige |
|---|---|---|---|---|
| P0-1 | 44 endpoints sin autenticación | 🔴 Crítica | Bajo | Acceso total a datos y escrituras |
| P0-2 | IDOR en descarga de archivos | 🔴 Crítica | Bajo | Fuga de legajos y documentos |
| P0-3 | Upload sin validar tipo de archivo | 🔴 Crítica | Bajo | XSS almacenado / malware |
| P0-4 | Sin migraciones; deploy no sincroniza esquema | 🔴 Crítica | Medio | Corrupción de datos en producción |
| P0-5 | Secretos en claro + sin copia remota | 🔴 Crítica | Bajo | Pérdida total del proyecto |
| P0-6 | CORS abierto en ambos extremos | 🔴 Crítica | Bajo | API invocable desde cualquier sitio |
| P0-7 | Roles inexistentes en `@Roles` | 🔴 Alta | Bajo | Autorización silenciosamente errónea |
| P1-1 | Dos stacks de datos, uno ~95% muerto | 🟠 Alta | Alto | Confusión, 24k líneas de lastre |
| P1-2 | 0 tests; e2e desactiva auth | 🟠 Alta | Alto | Regresiones invisibles |
| P1-3 | `strict` off + 3 archivos `@ts-nocheck` | 🟠 Alta | Medio | Bugs de `null` en producción |
| P1-4 | Soft delete inconsistente | 🟠 Alta | Medio | Datos borrados visibles / historial perdido |
| P1-5 | Multi-tenancy sin aplicar | 🟠 Alta | Medio | Sin aislamiento por empresa |
| P1-6 | `npm run lint` roto en backend | 🟡 Media | Bajo | Sin control de estilo ni reglas |
| P2-1 | App Router usado como SPA | 🟡 Media | Medio | Performance y bundle innecesarios |
| P2-2 | Sin CI | 🟡 Media | Bajo | Nada garantiza que compile |
| P2-3 | 117 vulnerabilidades de dependencias | 🟡 Media | Medio | Superficie de ataque conocida |
| P2-4 | Refresh token sin usar | 🟡 Media | Bajo | Sesión cae a las 24 h |
| P2-5 | Dev-deps y secretos en imágenes Docker | 🟡 Media | Bajo | Imágenes grandes, secreto filtrado |
| P2-6 | Gitlinks sin `.gitmodules`, sin remotos | 🟡 Media | Bajo | Repo no clonable, sin backup |
| P2-7 | Documentación desfasada | 🟢 Baja | Bajo | Onboarding con errores |
| P3 | Higiene de repo y dependencias | ⚪ Baja | Bajo | Ruido y mantenimiento |

---

## 7. Plan de acción sugerido

### Semanas 1-2 — Contención (todo de bajo esfuerzo, alto impacto)

1. **Guards globales** con `APP_GUARD` + `@Public()` (P0-1). Es un cambio de ~20 líneas que cierra el hallazgo más grave.
2. **Auth y control de pertenencia** en `server-files` + validación de MIME (P0-2, P0-3).
3. **CORS restringido** por variable de entorno (P0-6).
4. **Remotos git + backup + rotación de secretos** (P0-5, P2-6).
5. **Unificar el enum `Role`** (P0-7).

Al final de estas dos semanas el sistema pasa de "expuesto" a "cerrado". Nada de esto requiere refactorizar.

### Semanas 3-6 — Reproducibilidad

6. **Baseline de migraciones** de Prisma y `migrate deploy` en el entrypoint (P0-4). Bloqueante para cualquier despliegue serio.
7. **CI mínimo**: `tsc`, `eslint`, `prisma migrate diff` (P2-2).
8. **Crear `eslint.config.mjs`** en backend; arreglar los 9 errores del frontend y quitar los `@ts-nocheck` (P1-6, P1-3).
9. **Tests de integración que verifiquen 401/403** en los endpoints críticos (P1-2, primera etapa).

### Mes 2-3 — Consolidación

10. **Decidir y ejecutar** el destino de la capa GraphQL del frontend (P1-1). Es la decisión de mayor impacto arquitectónico y la que más tiempo ahorra a futuro.
11. **Extensión de Prisma** para soft delete automático (P1-4) y, si corresponde, para scoping por empresa (P1-5).
12. **Activar `strictNullChecks`** en el backend (P1-3).
13. **Actualizar Next a 16** y completar la actualización de `next-auth` (P2-3).
14. **Dockerfiles**: stage de producción real, `NEXTAUTH_SECRET` en runtime, `output: 'standalone'` (P2-5).

### Continuo

15. Migrar listados de lectura a Server Components con `loading.tsx` (P2-1), empezando por los de mayor tráfico.
16. Implementar refresh de token en NextAuth (P2-4).
17. Limpiar artefactos de IA y `schema.json` del control de versiones (P3).

---

## 8. Conclusión

El proyecto está **más avanzado de lo que sugiere su deuda**. Tiene un dominio modelado con criterio, abstracciones que funcionan y dos aplicaciones que compilan limpias. Lo que le falta no es diseño: es **cerrar las cosas que quedaron a mitad de camino**. Los `tests/` vacíos, el enum de roles duplicado, el stage de Docker sin usar, la migración a Next 16 empezada, la capa GraphQL a medio conectar — todos son la misma historia: se empezó bien y no se terminó.

La buena noticia es que los tres bloqueantes (seguridad, migraciones, backup) se resuelven en dos o tres semanas de trabajo concentrado y **sin tocar la arquitectura**. Después de eso, el proyecto pasa de "prototipo avanzado" a "sistema en condiciones de operar", y ahí la conversación sobre GraphQL o Server Components deja de ser urgente y pasa a ser una optimización.

Lo que yo priorizaría por encima de todo: **P0-1 y P0-4**. El primero porque es una puerta abierta; el segundo porque es la diferencia entre poder desplegar con confianza y no poder.

---

*Análisis basado en inspección estática y ejecución de herramientas (tsc, ESLint, npm audit, git). No se ejecutó la aplicación ni se consultó la base de datos, por lo que los hallazgos de comportamiento en runtime son inferencias a partir del código.*
