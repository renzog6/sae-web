# Decisión: qué hacer con GraphQL en SAE (implementada)

> Estado: completada. SAE utiliza REST; GraphQL fue eliminado del frontend y backend.
> Este documento conserva el razonamiento histórico de la decisión.

> **Estado:** plan ejecutado. El estado vigente esta en [ESTADO-ACTUAL.md](ESTADO-ACTUAL.md).


**Fecha:** 27 de octubre de 2026

---

## Recomendación

**Sí: consolidá todo en REST y eliminá GraphQL del frontend. Del backend, quitá los resolvers pero conservá los servicios.**

Y hacelo **antes** de la actualización a Next 16 / Nest 12, no después. La razón está en la sección 3.

Hay una excepción que cambia la respuesta, y está en la sección 5: si tenés una app móvil o una API para terceros en el roadmap de los próximos 6 meses, hablamos de otra cosa.

---

## 1. La evidencia

### El frontend usa GraphQL en 2 archivos, de 341

| Dato | Valor |
|---|---|
| Archivos que consumen `lib/graphql/` | **2** (`useCompanies.ts`, `useEquipments.ts`) |
| Archivos que consume la capa REST | 54 imports en `app/` |
| Peso de `lib/graphql/` | **16 archivos, 25.143 líneas** |
| De esas líneas, generadas automáticamente | 24.178 (`generated.ts` 3.600 + `schema.json` 20.578) |

Es decir: el 99,4% de esa carpeta es código generado que existe para servir a dos archivos.

### El backend tiene 35 resolvers y 81 operaciones, pero la lógica no está ahí

| Dato | Valor |
|---|---|
| Archivos `*.resolver.ts` | 35 (1.113 líneas en total) |
| Operaciones GraphQL | 81 |
| De esas, heredadas del `BaseResolver` genérico | ~5 por módulo (la mayoría) |
| `common/types/graphql.ts` (generado) | 2.870 líneas |
| `src/schema.gql` (generado) | 1.134 líneas |

Promedio: **32 líneas por resolver**. No son 35 archivos de lógica de negocio; son 35 adaptadores finos que delegan en el mismo servicio que usa el controller REST.

### REST ya cubre lo mismo, y devuelve la misma forma

`BaseController` expone el CRUD completo y algo más:

```
GET    /           findAll        → { data: T[], meta: { total, page, limit } }
GET    /:id        findOne
POST   /           create
PUT    /:id        update
DELETE /:id        remove         (soft delete)
PATCH  /:id/restore               restore
DELETE /:id/force                 hardDelete
```

Y `BaseService.findAll` devuelve exactamente `{ data, total, page, limit }` → `PaginationResponseDto` con `{ data, meta }`.

Eso importa mucho: **los dos hooks de GraphQL adaptan la respuesta a `{ data, meta }` con `select: (data: any)`**. La respuesta REST ya tiene esa forma. Reescribir esos hooks no requiere diseñar nada, solo borrar los adaptadores.

### Los servicios son compartidos: borrar el resolver no borra la lógica

Verificado en 4 módulos al azar (`tire-events`, `tire-rotations`, `business-categories`, `equipment`):

```ts
// tire-events.resolver.ts
constructor(private readonly tireEventsService: TireEventsService) {}

// tire-events.controller.ts
constructor(private readonly service: TireEventsService) {}
```

Mismo servicio, dos transportes. Eliminar el transporte GraphQL deja la lógica de negocio intacta y sigue expuesta por REST.

### El GraphQL del frontend está mal implementado

No es "GraphQL bien hecho que estarías tirando". En `useEquipments.ts` las mutaciones están escritas a mano con `fetch` y la query como string literal:

```ts
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
  },
  body: JSON.stringify({ query: `mutation CreateEquipment(...)`, variables: { input: data } }),
});
```

Tres problemas en una sola llamada:

1. **Ignora el cliente generado** que importa en la línea 5 — toda la ventaja de codegen, anulada.
2. **Lee el token de `localStorage`**, que es accesible desde cualquier XSS. La capa REST usa la sesión de NextAuth.
3. **Hardcodea el endpoint** con fallback a `http://localhost:3305/graphql`, que se compila en el bundle.

---

## 2. La ironía que vale la pena registrar

El backend protege GraphQL y **no** protege REST.

- `BaseResolver` aplica `@UseGuards(GraphQLAuthGuard)` a nivel de clase (línea 22): **todas** las operaciones GraphQL están autenticadas.
- Los 44 endpoints REST sin guard del análisis (los 7 de cubiertas, reportes, historial, archivos) están **abiertos**.

O sea: la API que casi no usás es la segura; la que usás todos los días tiene los agujeros. Eso no es un argumento para quedarse con GraphQL — es un argumento para **aplicar el mismo patrón** (guard a nivel de clase/base) en REST. Que es justo la corrección P0-1 del análisis anterior.

---

## 3. Por qué hacerlo ANTES de actualizar

Este es el argumento decisivo.

Mantener dos transportes no es un costo único: es un costo que **se paga en cada actualización de framework**. En los próximos meses tenés que mover:

| Paquete | Ahora | Destino |
|---|---|---|
| `@nestjs/graphql` | 12.2.2 | 14.1.0 |
| `@nestjs/apollo` | 12.2.2 | 14.1.1 |
| `@apollo/server` | 4.12.2 | 5.5.1 |
| `graphql` | 16.12 | 16.x |

Si borrás GraphQL antes, esos cuatro paquetes desaparecen del problema — y con ellos, el cambio `playground` → `graphiql` de Nest 12, la migración del transporte de suscripciones y el codegen de resolvers.

```
Opción A:  actualizar Next+Nest con GraphQL  →  después borrar GraphQL
Opción B:  borrar GraphQL                     →  actualizar Next+Nest (menos superficie)
```

B es menos trabajo total y menos riesgo. La regla general: **si vas a eliminar algo, eliminalo antes de migrarlo.** Migrar código que después vas a borrar es trabajo tirado dos veces.

Además hay un beneficio colateral concreto: en el frontend, borrar GraphQL saca `graphql-request`, `graphql` y los 5 paquetes de `@graphql-codegen/*`. En el backend, saca `subscriptions-transport-ws` y `ws`, que son justamente dos de las vulnerabilidades altas del `npm audit`.

---

## 4. Qué se borra exactamente

**Frontend** (16 archivos, 25.143 líneas):

```
lib/graphql/client.ts
lib/graphql/generated.ts              3.600
lib/graphql/schema.json              20.578
lib/graphql/hooks/index.ts
lib/graphql/hooks/use-graphql.ts        224
lib/graphql/queries/*.graphql  (10)
lib/graphql/operations/*.graphql (1)
codegen.ts
```

Dependencias: `graphql`, `graphql-request`, `@graphql-codegen/cli`, `@graphql-codegen/client-preset`, `@graphql-codegen/introspection`, `@graphql-codegen/typescript-react-query`, `@parcel/watcher`. Script `codegen`.

**Backend**:

```
src/**/*.resolver.ts                 35 archivos, 1.113 líneas
src/common/resolvers/base.resolver.ts
src/common/guards/graphql-auth.guard.ts
src/common/types/graphql.ts          2.870
src/schema.gql                       1.134
codegen.yml
GraphQLModule  (en app.module.ts)
```

Dependencias: `@nestjs/graphql`, `@nestjs/apollo`, `@apollo/server`, `graphql`. DevDeps: los 4 `@graphql-codegen/*`. Script `codegen`.

**Lo que NO se borra:** ningún `*.service.ts`, ni `*.entity.ts`, ni DTOs. La lógica de los 48 modelos y las 123 rutas REST quedan igual.

---

## 5. La pregunta que cambia la respuesta

GraphQL tiene sentido cuando hay **varios clientes heterogéneos** consumiendo el mismo backend con necesidades distintas. La pregunta concreta:

> ¿En los próximos 6 meses vas a tener una app móvil, un portal para clientes/proveedores, o una API pública?

- **Si la respuesta es no** (lo más probable, dado que hoy sólo hay un frontend web y cero consumidores externos): consolidá en REST.
- **Si es sí**, o si el cliente móvil va a operar sobre redes lentas y necesita *field selection* para no arrastrar payloads grandes: entonces GraphQL pasa de ser deuda a ser inversión, y lo que conviene es lo contrario — **terminar de migrar a GraphQL de forma consistente** y borrar la capa REST del frontend.

No hay una tercera opción sensata. Mantener ambos transportes indefinidamente es lo único que no se justifica: pagás el costo de los dos y aprovechás uno.

Si no lo tenés claro hoy, tomá la decisión de menor riesgo: **REST ahora, y si mañana aparece el cliente móvil, GraphQL se agrega de nuevo como capa de agregación para ese cliente**, sin arrastrar al frontend web.

---

## 6. Cómo seguir: plan concreto

### Etapa 1 — Congelar (hoy)

- [ ] Regla de equipo: **no se agrega nada nuevo a GraphQL**.
- [ ] Los arreglos de seguridad P0 (guards globales en REST) no tocan GraphQL.

### Etapa 2 — Reescribir los 2 hooks a REST (~1-2 días)

Es el único trabajo real de código, y es chico porque la forma de respuesta coincide.

`useCompanies.ts` → usar `CompaniesService` y `BusinessCategoriesService` (ya existen en `lib/api/companies/`) con `useQuery`/`useMutation`, igual que el resto de los 19 hooks.

`useEquipments.ts` → usar `EquipmentsService` (ya existe). Ojo: las mutaciones hoy escriben a mano contra `/graphql`; pasan a `service.create()` / `service.update()`, que es además donde arreglás el `localStorage.getItem("token")`.

Borrá también los `select: (data: any)` y los `__typename: undefined`: existen sólo para adaptar la forma de GraphQL.

**Verificación:** las pantallas de empresas, categorías de negocio, equipos y configurador de ejes siguen funcionando igual (alta, edición, listado, borrado). Comparar a ojo contra el comportamiento actual antes de seguir.

### Etapa 3 — Borrar la capa GraphQL del frontend (~1 día)

- [ ] Borrar `lib/graphql/`, `codegen.ts`.
- [ ] Quitar deps y el script `codegen`.
- [ ] Quitar `NEXT_PUBLIC_GRAPHQL_ENDPOINT` de `.env` y `.env.example`.
- [ ] `npm run typecheck && npm run build`.

### Etapa 4 — Verificar que no hay otros consumidores (~medio día)

- [ ] `grep -rn "/graphql" --exclude-dir=node_modules` en todo el repo: no debe quedar nada.
- [ ] Revisar logs de acceso del servidor: ¿algún cliente pegando a `/graphql` fuera del frontend? (Postman, algún script, un integrador).
- [ ] Preguntar explícitamente si alguien usa GraphiQL para debug. Si es así, ese es el único costo real de la decisión: se reemplaza por Swagger, que ya tenés en `/api/docs`.

### Etapa 5 — Borrar GraphQL del backend (~2-3 días)

- [ ] Quitar `GraphQLModule` de `app.module.ts` y el `ScalarsModule` si queda huérfano.
- [ ] Borrar los 35 `*.resolver.ts`, `common/resolvers/`, `graphql-auth.guard.ts`, `common/types/graphql.ts`, `schema.gql`, `codegen.yml`.
- [ ] Borrar deps y devDeps de GraphQL.
- [ ] Si algún módulo registra el resolver en `providers`, quitarlo de cada `*.module.ts` (35 archivos).
- [ ] `npx tsc --noEmit && npm run build`.
- [ ] Levantar la app: Swagger en `/api/docs` con las 123 rutas, `/graphql` devolviendo 404.
- [ ] Correr los 12 e2e.

**Ojo con este paso:** es el único con riesgo real, porque los e2e usan `AppModule` completo. Si algún resolver era la única implementación de algo (poco probable, pero verificable), va a fallar acá.

### Etapa 6 — Auditar y celebrar (~1 h)

- [ ] `npm audit --omit=dev` en ambos: deberían caer las altas de `ws`/`subscriptions-transport-ws`.
- [ ] Commit con tag `pre-next16`. Recién ahora arrancás la Fase 2 del plan de actualización.

**Total: 4-6 días.** A cambio, la migración a Nest 12 pierde 4 paquetes, el cambio `playground`→`graphiql` y todo el codegen de resolvers.

---

## 7. ¿Qué tecnología en su lugar?

### La respuesta corta

**REST + OpenAPI + TanStack Query + Zod.** Que es lo que ya tenés funcionando. No hace falta adoptar nada nuevo.

| Rol | Antes (GraphQL) | Ahora |
|---|---|---|
| Transporte | GraphQL | REST (ya existe) |
| Contrato | `schema.gql` | **OpenAPI** (Swagger ya lo genera en `/api/docs`) |
| Tipos del cliente | `graphql-codegen` | tipos del dominio escritos a mano (ya existen en `lib/types/`) |
| Estado y caché | TanStack Query | **TanStack Query** (igual) |
| Validación | Zod | **Zod** (igual) |

Fijate que dos de las cinco filas no cambian. La migración no toca tu stack de estado ni tu validación: toca sólo el transporte.

### Por qué no tRPC

Porque tRPC requiere compartir el router de TypeScript entre cliente y servidor. Con un backend NestJS con decoradores, DTOs y `class-validator`, eso implica reescribir la capa HTTP entera. Cambiarías un problema de mantenimiento por un proyecto de tres meses. No.

### El rol que cumplía el codegen lo puede cumplir OpenAPI

Si te gusta tener tipos generados desde el contrato (y es una buena idea), el equivalente natural es generar un cliente tipado desde el OpenAPI que Swagger ya produce: `openapi-typescript` para los tipos, u `openapi-fetch` para el cliente completo.

**Pero no lo hagas ahora.** Hay un bloqueante concreto:

```ts
// BaseController, línea 114
async create(@Body() dto: any) {
```

El CRUD genérico de tu backend acepta `any`. Mientras eso sea así, el OpenAPI que genera Swagger para esas rutas es pobre y los tipos generados no valdrían mucho. Primero habría que tipar los DTOs por módulo en los métodos genéricos.

Orden sensato: **borrar GraphQL → actualizar frameworks → tipar los DTOs del CRUD genérico → recién ahí evaluar OpenAPI codegen.** Si nunca llegás al último paso, no pasa nada: 41 servicios escritos a mano funcionan bien.

---

## 8. Riesgos de esta decisión

| Riesgo | Mitigación |
|---|---|
| Un consumidor de GraphQL que no está en el repo (Postman, script, integrador) | Etapa 4: revisar logs de acceso antes de borrar el backend |
| Los e2e fallan al quitar resolvers de los módulos | Es el canario correcto; correrlos en la Etapa 5, no después |
| Perder GraphiQL como herramienta de debug | Swagger en `/api/docs` lo cubre; ya está configurado |
| En 6 meses necesitás GraphQL para un móvil | Se agrega como capa de agregación para ese cliente; el frontend web no se toca |
| Alguien del equipo tiene features a medio hacer sobre GraphQL | Etapa 1: congelar y verificar antes de borrar |

---

## Conclusión

GraphQL en SAE no es una arquitectura: es un experimento que quedó a medio camino. Se construyó un backend GraphQL completo y seguro, y se consumió desde dos archivos con `fetch` manual y el token en `localStorage`. Lo que hay hoy no da los beneficios de GraphQL (no hay clientes heterogéneos que los aprovechen) pero sí cobra todos sus costos (dos contratos, dos juegos de tipos, dos transportes que actualizar).

La decisión no es "GraphQL es malo". Es que **en este proyecto, con un solo cliente web, la segunda API no se paga**. Y el momento de sacarla es justo antes de la actualización, cuando el costo de mantenerla se multiplica por dos frameworks.

Una semana de trabajo ahora te ahorra arrastrar 25.000 líneas de artefactos generados y 4 paquetes con cambios de major a través de la migración a Nest 12.
