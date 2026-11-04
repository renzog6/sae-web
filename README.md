# SAE - Sistema de Administración de Empresas

Aplicación web para la gestión de recursos, contactos y mantenimiento de Empresas.

## Estructura

- `sae-backend/`: API REST en NestJS, Prisma y MySQL.
- `sae-frontend/`: aplicación web en Next.js.
- `.github/workflows/ci.yml`: validación automática de backend, frontend, migraciones,
  E2E y contrato OpenAPI.

## Desarrollo local

Requisitos: Node.js 24 LTS, npm y MySQL local en `localhost:3306`.

```bash
cd sae-backend
npm ci
npm run prisma:generate
npm run start:dev
```

En otra terminal:

```bash
cd sae-frontend
npm ci
npm run dev
```

- Frontend: http://localhost:3003
- API: http://localhost:3305/api
- Swagger: http://localhost:3305/api/docs
- Health check: http://localhost:3305/api/health

La configuración local se define en los archivos `.env` de cada subproyecto. No
versionar secretos ni reutilizar credenciales de desarrollo en producción.

## Estado del proyecto

Consultar [ESTADO-ACTUAL.md](ESTADO-ACTUAL.md) para el estado vigente, verificaciones,
pendientes y decisiones de arquitectura.
