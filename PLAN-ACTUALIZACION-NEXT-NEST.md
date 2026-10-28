# Plan de actualización: Next.js y NestJS a versiones estables / LTS

**Fecha:** 27 de octubre de 2026
**Estado de partida:** `next@15.5.3`, `@nestjs/core@10.4.20`, Node `22.14.0` (local) y `node:22-alpine` (Docker)

---

## 1. Dónde estás y a dónde vas

Versiones consultadas hoy en el registro de npm (`dist-tags` oficiales):

| Paquete | Tenés | Última estable | Salto |
|---|---|---|---|
| `next` | 15.5.3 | **16.4.3** | 1 major |
| `react` / `react-dom` | 19.2.1 | **19.3.1** | menor |
| `@nestjs/core` | 10.4.20 | **12.3.2** | **2 majors** |
| `@nestjs/graphql` | 12.2.2 | **14.1.0** | 2 majors |
| `@nestjs/apollo` | 12.2.2 | **14.1.1** | 2 majors |
| `@apollo/server` | 4.12.2 | **5.5.1** | 1 major |
| `@nestjs/swagger` | 7.4.2 | **12.0.5** | **5 majors** |
| `@nestjs/throttler` | 5.0.0 | **6.7.1** | 1 major |
| `@nestjs/config` | 3.0.0 | **12.0.1** | 9 majors |
| `@nestjs/cli` | 10.x | **12.0.11** | 2 majors |
| `prisma` / `@prisma/client` | 6.19.1 | 7.10.1 (estable) | 1 major |
| `typescript` | ^5.1.3 | 7.0.2 (última), **6.x la que pide Nest 12** | 1-2 majors |
| `jest` | 29.7 | 30.x | 1 major |
| `express` (transitiva) | 4.x | 5.3.0 | 1 major |
| Node | 22.14.0 | **24 LTS** (26 LTS desde 2026-10-28) | — |

**Dos conclusiones importantes de entrada:**

1. **No es un salto, son dos.** El frontend es un major (15→16) y el backend son dos (10→12). Conviene tratarlos como proyectos separados con ramas y PRs distintos, nunca en un solo commit.
2. **TypeScript: no vayas a 7 todavía.** `@nestjs/schematics` v12 exige **TypeScript 6** como peer dependency. La 7.0.2 (el compilador nativo) es demasiado nueva para el ecosistema de decoradores en el que se apoya Nest. Objetivo backend: **TypeScript 6.x**. Ya habrá tiempo para la 7.

---

## 2. Antes de empezar: los tres prerrequisitos

Esto no es burocracia: sin esto, cualquier actualización es a ciegas.

### 2.1. Backup y remoto (bloqueante)

Los tres repositorios no tienen remoto (`git remote -v` vacío) y el repo raíz trackea `sae-backend`/`sae-frontend` como gitlinks sin `.gitmodules`. Hoy no tenés forma de volver atrás si la actualización sale mal, ni de recuperar el proyecto si se pierde el disco.

```bash
# En cada uno de los tres repos (raíz, sae-backend, sae-frontend)
git remote add origin <url>
git push -u origin --all
git tag pre-upgrade-2026-10 && git push origin pre-upgrade-2026-10
```

Después de crear el tag, cada paso del plan puede revertirse con `git checkout pre-upgrade-2026-10`.

### 2.2. Verificación automática mínima

La actualización se valida compilando y ejecutando. Hoy no hay CI y `npm run lint` está roto en el backend. Mínimo indispensable:

- [ ] `npx tsc --noEmit` en verde en ambos proyectos (hoy lo está — es tu línea base).
- [ ] `npm run build` en verde en ambos.
- [ ] Un smoke test manual documentado: login → dashboard → listado de empresas → alta de empresa → subida de un documento.
- [ ] Un workflow de CI que corra `tsc` + `build` en cada PR (aunque sea eso solo).

### 2.3. Congelar el alcance

Anotá los cambios funcionales en curso y cerrálos antes. Una actualización de dos majors con features a medio hacer es imposible de depurar. En tu caso hay un candidato claro: **decidí antes qué pasa con la capa GraphQL del frontend**. Si vas a eliminar `lib/graphql/`, hacelo *antes* de subir a Next 16: es 24.000 líneas de artefactos que si no, tendrás que migrar y validar sin motivo.

---

## 3. Orden recomendado (y por qué)

```
Fase 0  Node 24 LTS + .nvmrc + Docker            (1 día)
Fase 1  Parche de seguridad dentro de la línea    (1 día)
Fase 2  Frontend: Next 15.5.3 → 16.4.3            (3-5 días)
Fase 3  Backend: Nest 10 → 11                     (1-2 semanas)
Fase 4  Backend: Nest 11 → 12                     (1 semana)
Fase 5  Prisma 6 → 7 (acoplado a migraciones)     (1 semana)
```

**Por qué el frontend primero:** el frontend tiene typecheck limpio, no depende de Express, no usa ESM del backend y su salto es un solo major. Te da una victoria temprana y, sobre todo, te obliga a montar la verificación antes de tocar el backend, que es el difícil.

**Por qué Nest en dos pasos:** de 10 a 12 se cruzan dos cambios de fondo a la vez (Express 5 y paquetes ESM-only). Si los hacés juntos y algo se rompe, no vas a saber cuál de los dos fue. En dos pasos, cada PR tiene una causa de fallo identificable.

**Por qué Prisma al final:** el cambio de Prisma se acopla con el baseline de migraciones que te falta (hallazgo P0-4 del análisis). Hacerlo junto con Nest duplica el ruido de errores.

---

## 4. Fase 0 — Node 24 LTS

Nest 12 **no corre** en Node 22.14: los paquetes v12 son ESM-only y consumirlos desde CommonJS requiere `require(esm)`, que está habilitado sin flag desde **Node 20.19** y **22.12**. Además, la CLI de Nest 12 (`nest upgrade`, `nest generate`) exige **Node 22.22.3+, 24.15+ o 26+**. Tu 22.14 queda por debajo en los tres casos.

Node 22 sigue en soporte (EOL 2027-04) pero ya entró en mantenimiento el 2026-10-20. **Objetivo: Node 24 LTS** (24.22.1, EOL 2028-04). Node 26 pasa a LTS el 2026-10-28 — mañana — pero como LTS recién nacida no la recomiendo para un sistema en producción; planificala para dentro de 4-6 meses.

```bash
# .nvmrc en la raíz
24
```

En ambos `Dockerfile`:

```dockerfile
FROM node:24-alpine AS base
```

Y verificá que el pipeline de Docker use la misma versión que desarrollo. Node 24 también te resuelve un problema futuro: **Jest solo puede cargar los paquetes ESM de Nest 12 en Node 24.9 o superior** (en versiones anteriores falla con `ERR_REQUIRE_ASYNC_MODULE`). Como vas a seguir con Jest, Node 24 no es opcional.

---

## 5. Fase 1 — Parche de seguridad inmediato (mismo major)

No esperes a la actualización grande para cerrar los avisos críticos. Hay una línea 15.5 con backports activos:

```bash
cd sae-frontend
npm install next@15.5.28
npm run typecheck && npm run build
```

Es un patch dentro de la misma línea: riesgo casi nulo, y te saca de encima los avisos más urgentes mientras planificás el salto a 16. Verificá después con `npm audit --omit=dev` qué quedó pendiente (algunos avisos de `next` solo se resuelven en 16).

En el backend, dentro de la línea actual:

```bash
cd sae-backend
npm update
npm audit --omit=dev
```

Lo que quede sin resolver se cierra con los majors (Fases 3-4).

---

## 6. Fase 2 — Frontend: Next 15.5 → 16.4

### 6.1. Lo que ya cumplís

| Requisito de Next 16 | Tu estado |
|---|---|
| Node 20.9+ | ✅ (con Fase 0, Node 24) |
| TypeScript 5.1+ | ✅ |
| React 19.2+ | ✅ (19.2.1) |
| ESLint flat config | ✅ ya usás flat config |
| `eslint-config-next` 16 | ✅ ya instalado en 16.1.1 |

Estás mejor parado de lo que parece: `eslint-config-next` ya está en 16, señal de que este upgrade se empezó.

### 6.2. Los cambios que te van a afectar

**a) `middleware.ts` → `proxy.ts`.** Next 16 renombra la convención y la función. Tu `middleware.ts` con `withAuth` de next-auth debe pasar a `proxy.ts`, exportando `proxy`. Ojo: el runtime `edge` **no** está soportado en `proxy` (siempre es `nodejs`); vos no declarás runtime explícito, así que el comportamiento se mantiene.

```bash
mv middleware.ts proxy.ts
```

```ts
// proxy.ts — renombrar el export
export default withAuth(function proxy(req) { /* ... */ }, { /* ... */ });
```

**b) `next lint` desaparece.** Tus scripts usan `next lint` y `next build --turbopack`. Ambos hay que ajustar:

```json
// antes
"dev": "next dev --turbopack --port 3003",
"build": "next build --turbopack",
"lint": "next lint"

// después
"dev": "next dev --port 3003",
"build": "next build",
"lint": "eslint ."
```

Turbopack es el bundler por defecto en 16, así que el flag sobra. Y tu `eslint.config.mjs` **nunca importa `eslint-config-next`**: hay que agregarlo, porque con Next 16 `@next/eslint-plugin-next` pasa a flat config por defecto y es justo el momento de activarlo.

```js
// eslint.config.mjs
import next from "@next/eslint-plugin-next";
// ...
next.configs.coreWebVitals,
```

Esto va a destapar errores que hoy no ves (imágenes, dependencias de hooks, links). Es la idea.

**c) `params` y `searchParams` son Promise, sin compatibilidad.** Next 16 elimina el acceso síncrono. Tenés **17 páginas dinámicas** en `app/**/[id]/`. La buena noticia: la mayoría ya usa `useParams()`, que sigue funcionando igual. Las que reciben `params` como prop y son componentes de cliente necesitan `React.use(params)` o quedarse con `useParams()`.

Revisá estas primero (son las que declaran el prop `params`):

- `companies/[id]/page.tsx`
- `employees/[id]/page.tsx`, `[id]/edit`, `[id]/vacations`
- `equipments/[id]/page.tsx`, `[id]/edit`, `[id]/tires`, `[id]/axle-configurator`
- `tires/[id]/page.tsx`, `[id]/edit`
- `users/[id]/page.tsx`

**d) Imágenes.** `images.qualities` pasa a `[75]` por defecto, `minimumCacheTTL` a 4 h, y `images.domains` queda deprecado. Usás `next/image` una sola vez, así que el impacto es mínimo; solo revisá que no pases `quality` distinto de 75.

**e) Verificá que no uses APIs removidas.** Confirmado que **no** usás `revalidateTag`, `serverRuntimeConfig`, `publicRuntimeConfig` ni AMP. Sin acción.

### 6.3. Ejecución

```bash
cd sae-frontend
git checkout -b chore/next-16

# 1. Codemod oficial (hace el rename de middleware, next lint y flags)
npx @next/codemod@canary upgrade latest

# 2. Si quedó params síncrono en algún lado, el codemod específico
npx @next/codemod@canary next-async-request-api .

# 3. Verificación
npm run typecheck
npm run build
npm run lint
```

El codemod de Next no cubre todo: los puntos (b), (c) y (d) requieren revisión manual. Después del build, el smoke test completo (login → dashboard → un listado → un alta → subida de archivo).

### 6.4. Criterio de aceptación

- [ ] `next build` sin errores ni warnings de deprecación.
- [ ] `proxy.ts` protege las mismas rutas que antes (probá `/dashboard` sin sesión).
- [ ] El flujo de login de NextAuth funciona y la sesión persiste.
- [ ] `npm run lint` corre y no hay errores nuevos respecto de los 9 actuales.
- [ ] `npm audit --omit=dev`: bajó el número de críticas.

---

## 7. Fase 3 — Backend: Nest 10 → 11

Este es el paso con más superficie. Nest 11 trae dos cambios estructurales: **Express 5** y **Node 20+**, además de que cada paquete satélite sube de major.

### 7.1. Matriz de paquetes (subir todos juntos)

```bash
cd sae-backend
git checkout -b chore/nest-11

npm install @nestjs/{common,core,platform-express}@^11 \
            @nestjs/config@^4 \
            @nestjs/jwt@^11 \
            @nestjs/passport@^11 \
            @nestjs/graphql@^13 \
            @nestjs/apollo@^13 \
            @nestjs/swagger@^11 \
            @nestjs/throttler@^6 \
            @nestjs/mapped-types@latest

npm install -D @nestjs/cli@^11 @nestjs/schematics@^11 @nestjs/testing@^11
```

Los paquetes `@nestjs/*` **deben** moverse en bloque: son interdependientes y una mezcla de majors produce errores de tipos confusos.

### 7.2. El cambio que te va a romper: Express 5 y las rutas comodín

Express 5 cambia el motor de rutas (`path-to-regexp` 8). El comodín suelto `"*"` ya no es válido. En tu `app.module.ts` tenés exactamente eso:

```ts
// sae-backend/src/app.module.ts  — roto en Express 5
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
```

Forma correcta en Express 5:

```ts
consumer.apply(LoggerMiddleware).forRoutes("{*splat}");
```

Opciones equivalentes: `"*splat"` (con nombre) o `[MiddlewareConsumer]` con `forRoutes({ path: "{*splat}", method: RequestMethod.ALL })`.

Buscá el mismo patrón en cualquier otro `forRoutes`, `@All()`, `@Get("*")` o `exclude(...)`:

```bash
cd sae-backend
grep -rn 'forRoutes(\|@All(\|"\*"' src/
```

### 7.3. Cambios de API a revisar

| Archivo | Qué cambia |
|---|---|
| `app.module.ts` | `playground: true` en `GraphQLModule` → usar `graphiql` (se estabiliza en 12, pero el flag `playground` ya molesta en 13+) |
| `app.module.ts` | `ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }])` — en throttler 6 verificá que `ttl` siga en **milisegundos** (tu comentario dice ms, es correcto, pero confirmalo) |
| `main.ts` | `app.enableCors()` sin argumentos → aprovechá para restringir orígenes (hallazgo P0-6 del análisis) |
| `main.ts` | `require("express").json(...)` — sigue funcionando en CJS, pero es la línea a revisar si algún día pasás a ESM |
| `src/common/**` | `ArgumentMetadata`, firmas de `PipeTransform` — tus pipes custom pueden necesitar ajuste de tipos |

### 7.4. `@nestjs/swagger` 7 → 11: el salto más grande en apariencia

Cinco majors asustan, pero tu uso es estándar (`@ApiTags`, `@ApiOperation`, `@ApiProperty`, `DocumentBuilder`, `SwaggerModule.setup`). Esas APIs son estables. Lo que suele romper es:

- El campo `type` en `@ApiProperty` con enums generados.
- `extraModels` / `partialType` desde `@nestjs/mapped-types` (subilo junto con swagger).
- El orden de decoradores en DTOs con `class-validator`.

Compilá temprano y seguí los errores de tipos: en este paquete son explícitos.

### 7.5. GraphQL: `@nestjs/graphql` 12 → 13

- Regenerá el esquema: `autoSchemaFile` se reescribe solo al arrancar.
- Regenerá los tipos: `npm run codegen` (genera `src/common/types/graphql.ts`).
- Revisá `context: ({ req }) => ({ req })`: sigue igual.
- Si en algún momento agregás subscripciones, `subscriptions-transport-ws` está fuera en la 14; usá `graphql-ws`. Hoy no lo usás directamente.

### 7.6. Tests

Los 12 e2e usan `jest` 29 + `ts-jest`. Con Nest 11 conviene subir:

```bash
npm install -D jest@^30 ts-jest@latest @types/jest@^30
```

Ojo: tus e2e reemplazan los guards por un `AllowAllGuard`. **Aprovechá este momento para arreglarlo** (hallazgo P1-2). Si vas a tocar la cadena de guards de todos modos, es el momento natural: agregá al menos un test que verifique `401` sin token y `403` sin rol.

### 7.7. Criterio de aceptación

- [ ] `npx tsc --noEmit` en verde.
- [ ] `npm run build` y la app arranca contra la base real.
- [ ] Swagger (`/api/docs`) renderiza y lista los endpoints.
- [ ] `/graphql` responde introspección y una query simple.
- [ ] El middleware de logging sigue aplicándose a todas las rutas.
- [ ] Los 12 e2e pasan.
- [ ] Smoke test: login, CRUD de empresa, subida y descarga de archivo, un reporte.

---

## 8. Fase 4 — Backend: Nest 11 → 12

Aquí el camino está allanado porque la propia CLI lo migra.

### 8.1. Usar `nest upgrade`

```bash
git checkout -b chore/nest-12

# La CLI global debe ser la nueva
npm i -g @nestjs/cli@latest @nestjs/schematics@latest

# Ver el informe sin tocar nada
nest upgrade --dry-run

# Aplicar
nest upgrade
```

`nest upgrade` sube todos los paquetes `@nestjs/*` a la major compatible con v12, pasa TypeScript a 6, sube Jest a 30 y aplica las partes mecánicas de la migración (`nest-cli.json`, opciones de webpack, `playground` de GraphQL, opciones de validación de `@nestjs/config`). Al final imprime un informe de lo que cambió **y de lo que no pudo migrar** — leé esa parte, es la que importa.

### 8.2. Lo que cambia de fondo en Nest 12

**a) Todos los paquetes del core son ESM-only.** No tenés que pasar tu proyecto a ESM: una app CommonJS sigue funcionando mediante `require(esm)`. `nest upgrade` deliberadamente no toca tu formato de módulo. Tu `tsconfig` con `"module": "commonjs"` puede quedarse así. Esto es la buena noticia de la fase.

Requisito que sí es duro: **Node 20.19+ / 22.12+**, y para la CLI **22.22.3+ / 24.15+ / 26+**. Ya cubierto en la Fase 0.

**b) TypeScript 6.** `@nestjs/schematics` v12 lo exige como peer. Si npm se queja de conflicto, es por `ts-jest` o `typescript-eslint` viejos:

```bash
npm update ts-jest typescript-eslint
npm install -D typescript@^6
```

**c) GraphQL: `playground` → `graphiql`.** Tu `app.module.ts` tiene:

```ts
playground: process.env.NODE_ENV !== "production",
```

En v12 (y en `@nestjs/graphql` 14) el IDE por defecto es GraphiQL y se configura con un objeto:

```ts
graphiql: process.env.NODE_ENV !== "production",
```

`nest upgrade` suele aplicar esta parte; verificala igual.

**d) `@nestjs/config`: validación por Standard Schema.** Tu uso actual es mínimo (`ConfigModule.forRoot({ isGlobal: true, envFilePath })`), así que no hay nada que migrar. Pero es la oportunidad para agregar validación de entorno con Zod, que ya usás en el frontend y te falta acá:

```ts
import { z } from "zod";

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: join(__dirname, "..", ".env"),
  validationSchema: z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3305),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(16),
    JWT_REFRESH_SECRET: z.string().min(16),
  }),
});
```

(Con Zod, `validationSchema` acepta cualquier Standard Schema; ya no necesitás Joi.)

**e) Orden de los hooks de ciclo de vida.** Ahora se invocan por nivel de jerarquía de componentes. Si algún `onModuleInit` dependía del orden anterior, cambia. Revisá `PrismaService` y los módulos de reportes.

**f) `@Optional()` ya no se hereda en constructores redeclarados.** Si alguna subclase de `BaseController`/`BaseService` declara su constructor sin repetir el decorador, en 12.0.x puede lanzar `UnknownDependenciesException`. Se corrigió en 12.1; igual conviene revisar las subclases.

### 8.3. Criterio de aceptación

- [ ] `nest upgrade --dry-run` sin cambios pendientes después de aplicar.
- [ ] `npx tsc --noEmit` en verde con TypeScript 6.
- [ ] Jest 30 corriendo en Node 24 (sin `ERR_REQUIRE_ASYNC_MODULE`).
- [ ] GraphiQL carga en desarrollo y no en producción.
- [ ] Mismo smoke test que Fase 3.
- [ ] `npm audit --omit=dev`: las 3 críticas del backend resueltas o justificadas.

---

## 9. Fase 5 — Prisma 6 → 7

**Importante:** hoy `prisma` tiene `latest` apuntando a `8.0.0-rc.27` (un release candidate) y `prev` en `7.10.1` (la estable). **No uses `@latest` con Prisma**: instalá la versión explícita o vas a meter un RC en producción.

```bash
npm install prisma@7.10.1 @prisma/client@7.10.1
```

Antes de esto, cerrá el hallazgo P0-4: **no existe `prisma/migrations/`**. Sin historial de migraciones no hay forma segura de cambiar de major de Prisma.

```bash
# Baseline: crear la migración inicial a partir del esquema actual
mkdir -p prisma/migrations/0_init
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
npx prisma migrate resolve --applied 0_init
```

Y después:

```bash
npx prisma migrate dev      # genera la migración del cambio de motor
npx prisma generate
```

Revisá en el changelog de Prisma 7 los puntos de ruptura que te tocan: generador `prisma-client` (nuevo, distinto de `prisma-client-js`), manejo de `Json`, y cambios en el tipado de `$transaction`. Tus 48 modelos y los 16 borrados físicos que detecté son los puntos a testear con más cuidado.

---

## 10. Resumen de archivos a tocar

Para que puedas planificar el esfuerzo real:

**Frontend**

| Archivo | Cambio |
|---|---|
| `package.json` | scripts (`dev`, `build`, `lint`), deps |
| `middleware.ts` → `proxy.ts` | rename + export `proxy` |
| `eslint.config.mjs` | agregar `@next/eslint-plugin-next` |
| 10 páginas `[id]` | `params` asíncrono |
| `next.config.ts` | `images.qualities` si aplica; CORS a restringir |
| `Dockerfile` | `node:24-alpine`, `NEXT_PUBLIC_API_URL` en runtime |

**Backend**

| Archivo | Cambio |
|---|---|
| `package.json` | ~15 paquetes `@nestjs/*`, jest 30, TypeScript 6 |
| `app.module.ts` | `forRoutes("{*splat}")`, `graphiql`, `validationSchema` |
| `main.ts` | CORS restringido |
| `prisma/schema.prisma` + `migrations/` | baseline + Prisma 7 |
| `src/common/types/graphql.ts` | regenerar con codegen |
| `Dockerfile` | `node:24-alpine` |
| `tsconfig.json` | TypeScript 6 (y de paso, activar `strictNullChecks`) |
| 16 carpetas `tests/` vacías | llenar o eliminar |

---

## 11. Riesgos y cómo mitigarlos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| `forRoutes("*")` rompe el arranque silenciosamente | Alta | Es el primer error que vas a ver; corregilo antes de seguir |
| Mezcla de majors `@nestjs/*` → errores de tipos incomprensibles | Alta | Subir todos en bloque, nunca de a uno |
| Jest no carga ESM en Node < 24.9 | Media | Fase 0 primero |
| `@ts-nocheck` en 3 formularios esconde errores que Next 16 destapa | Media | Quitarlos antes de la Fase 2 |
| Prisma 8-rc instalado por accidente con `@latest` | Media | Fijar `7.10.1` explícito |
| Sin remoto, un upgrade fallido es irreversible | **Alta** | Fase 2.1, no negociable |
| Regresión silenciosa en auth al cambiar guards y framework a la vez | Media | Un PR = un cambio de causa |

**Estrategia de rollback:** cada fase es una rama con su tag (`pre-next16`, `nest11-ok`, `nest12-ok`). Si una fase no cierra en su presupuesto de tiempo, se revierte el merge y se sigue con la anterior estable. No acumules deuda de migración a medio hacer.

---

## 12. Qué haría primero, concretamente

Si arrancás mañana, el orden exacto sería:

1. `git remote add` + tag `pre-upgrade-2026-10` en los tres repos. **(30 min)**
2. Workflow de CI con `tsc` + `build` en los dos proyectos. **(2 h)**
3. Decidir el destino de la capa GraphQL del frontend. **(decisión, no código)**
4. `next@15.5.28` en el frontend. **(1 h)**
5. `.nvmrc` con Node 24 + `node:24-alpine` en los dos Dockerfile. **(1 h)**
6. Recién ahí, rama `chore/next-16` y el codemod.

Las tres primeras son de infraestructura y no tocan lógica de negocio. Son las que hacen que todo lo demás sea reversible.

---

## Fuentes

- [Next.js — How to upgrade to version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [NestJS — Migration guide (v11 → v12)](https://github.com/nestjs/docs.nestjs.com/blob/master/content/migration.md)
- Versiones obtenidas de los `dist-tags` de `registry.npmjs.org` el 2026-10-27
- Ciclo de vida de Node.js: [endoflife.date/api/nodejs.json](https://endoflife.date/api/nodejs.json)
