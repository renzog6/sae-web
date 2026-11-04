# Estado actual del proyecto SAE

**Última actualización:** 4 de noviembre de 2026

Este documento es la referencia operativa del repositorio `sae-web`. Los análisis y
planes anteriores se conservan como documentación histórica y no representan tareas
pendientes salvo que se indique explícitamente.

## Stack actual

### Backend (`sae-backend`)

| Componente | Versión |
|---|---|
| NestJS | 12.3.2 |
| TypeScript | 6.0.3 |
| Node.js | 24 LTS |
| Prisma | 6.19.1 con MySQL |
| Express | 5.3.0 |
| Jest | 30.5.2 |
| API | REST únicamente |

### Frontend (`sae-frontend`)

| Componente | Versión |
|---|---|
| Next.js | 16.4.3, App Router y Turbopack |
| React | 19.3.1 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| TanStack Query | 5.x |
| NextAuth | 4.24 |
| Node.js | 24 LTS |

### Puertos y URLs locales

- Frontend: `http://localhost:3003`
- Backend desarrollo: `http://localhost:3305`
- API pública del frontend: `http://localhost:3305/api`
- Health check: `http://localhost:3305/api/health`
- Swagger: `http://localhost:3305/api/docs`
- MySQL local: `localhost:3306`, base `sae_web`

En Docker/producción el backend usa `3005`; no debe confundirse con el puerto local
de desarrollo `3305`.

## Arquitectura y decisiones vigentes

- El transporte utilizado es REST; GraphQL fue eliminado del frontend y backend.
- El contrato OpenAPI se versiona en `sae-backend/openapi.json`.
- Los tipos del frontend se generan en `sae-frontend/lib/api/schema.d.ts`.
- Los subrepositorios `sae-backend` y `sae-frontend` se mantienen como gitlinks del
  repositorio raíz.
- El frontend usa `NEXT_PUBLIC_API_URL=http://localhost:3305/api` en desarrollo.
- Las fechas se almacenan como instantes UTC y se convierten a la zona local en la
  interfaz cuando corresponde, por ejemplo `America/Argentina/Buenos_Aires`.

## Trabajo completado

- Migración a Next.js 16, React 19, NestJS 12, TypeScript 6 y Node 24.
- Eliminación completa de GraphQL.
- Guards globales y autenticación fail-closed.
- Control de pertenencia para descargas de archivos.
- Validación de MIME y extensiones en subidas.
- Baseline de migraciones Prisma y ejecución con `prisma migrate deploy`.
- CORS restringido mediante `CORS_ORIGINS`.
- DTOs tipados en el CRUD genérico para evitar mass assignment.
- Contrato OpenAPI regenerable y tipos frontend sincronizados.
- `lint:check` del backend sin autofix.
- Corrección de ejemplos Swagger no deterministas producidos por `new Date()`.
- Corrección de la URL local del frontend y conexión con el backend en `/api`.

## Verificaciones realizadas

### Backend

- `npx tsc --noEmit -p tsconfig.json`: correcto.
- `npm run lint:check`: correcto.
- `npm run build`: correcto.
- `npm run test:e2e`: 19 pruebas aprobadas en 3 suites.
- `/api/health`: responde `200` con MySQL local.
- `/api/docs`: responde `200`.

### Frontend

- `npm run typecheck`: correcto.
- `npm run lint`: correcto, con advertencias no bloqueantes existentes.
- `npm run build`: correcto, 60 rutas generadas.
- Listados probados contra el backend local con datos reales.

### CI

El workflow [.github/workflows/ci.yml](.github/workflows/ci.yml) ejecuta:

- Calidad del backend: Prisma, typecheck, lint sin autofix y build.
- Calidad del frontend: typecheck, lint y build.
- Migraciones y pruebas E2E con MySQL 8.4.
- Exportación OpenAPI y verificación de artefactos generados.

El primer fallo del contrato OpenAPI fue corregido estabilizando los ejemplos de
fecha y sincronizando los artefactos. Falta confirmar el resultado del siguiente run
en GitHub Actions después de todos los cambios recientes.

## Pendientes actuales

### Prioridad alta

1. Rotar secretos de desarrollo que hayan sido compartidos y mantener secretos reales
   fuera de archivos versionados o capturas.
2. Ejecutar y confirmar el CI posterior a la corrección del contrato OpenAPI.
3. Actualizar el remoto del frontend de `sae-fronted` a `sae-frontend`.

### Prioridad media

1. Agregar tests unitarios reales en backend; actualmente la cobertura depende sobre
   todo de E2E.
2. Evaluar activar `strictNullChecks` en backend.
3. Completar schemas de respuesta en OpenAPI; hoy el contrato documenta principalmente
   cuerpos de entrada.
4. Revisar Dockerfiles para no incluir dependencias de desarrollo en runtime y no
   pasar secretos como argumentos de build.
5. Resolver la advertencia de DTO duplicado `CreateTirePositionDto` en Swagger.
6. Revisar la vulnerabilidad crítica reportada por `npm audit` y confirmar su estado
   actual con una nueva auditoría.

### Prioridad baja

1. Reducir advertencias de ESLint del frontend.
2. Unificar y simplificar la documentación duplicada de los subrepositorios.
3. Decidir si se elimina la dependencia `next-themes`, actualmente sin uso después
   de retirar el proveedor que generaba un error de React en desarrollo.

## Documentación relacionada

- `ANALISIS-TECNICO-SAE.md`: diagnóstico histórico previo a la migración.
- `PLAN-ACTUALIZACION-NEXT-NEST.md`: plan de actualización ya ejecutado.
- `DECISION-GRAPHQL.md`: decisión implementada de consolidar en REST.
- `sae-backend/README.md`: instalación y operación del backend.
- `sae-frontend/README.md`: instalación y operación del frontend.
- `sae-frontend/docs/`: integración API, arquitectura, despliegue y troubleshooting.

## Commits recientes

### Repositorio raíz

- `78e2b71` - sincronización del contrato API generado.
- `a2750fc` - workflow CI para backend, frontend y contrato API.

### Backend

- `984e449` - estabilización del contrato OpenAPI generado.
- `d7e1bda` - lint check sin autofix.

### Frontend

- `67e2115` - actualización de tipos API generados.

Los últimos cambios locales de documentación, visualización horaria y proveedores
frontend deben validarse y publicarse en commits separados cuando finalice esta
revisión.
