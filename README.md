# RCM SA - Sistema de Gestión

Aplicación web para la gestión de recursos, contactos y mantenimiento de RCM SA.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **rcm-backend**: API REST desarrollada con NestJS y Prisma ORM
- **rcm-frontend**: Interfaz de usuario desarrollada con Next.js

## Requisitos Previos

- Node.js (v16 o superior)
- Docker y Docker Compose
- MySQL 8.0 (o usar el contenedor Docker proporcionado)

## Configuración

### Variables de Entorno

Antes de iniciar la aplicación, crea los archivos de variables de entorno necesarios:

1. En la raíz del proyecto, crea un archivo `.env` basado en `.env.example`
2. En la carpeta `rcm-frontend`, crea un archivo `.env` basado en `.env.example`

### Certificados SSL

Para el entorno de producción, necesitarás certificados SSL válidos:

1. Coloca tus certificados en la carpeta `nginx/ssl/`
2. Asegúrate de que los nombres de los archivos coincidan con los configurados en `nginx/nginx.conf`

## Instalación y Ejecución

### Desarrollo Local

**Backend:**

```bash
cd rcm-backend
npm install
npm run start:dev
```

**Frontend:**

```bash
cd rcm-frontend
npm install
npm run dev
```

### Producción con Docker

Para iniciar todos los servicios:

```bash
docker-compose up -d
```

Para reconstruir los contenedores después de cambios:

```bash
docker-compose up -d --build
```

## Acceso

- **Frontend**: https://app.rcmsa.ar
- **API**: https://app.rcmsa.ar/api
- **Documentación API (Swagger)**: https://app.rcmsa.ar/api/docs

## Características Principales

- Autenticación JWT con tokens de acceso y refresco
- Gestión de usuarios y permisos
- Gestión de empresas y contactos
- Gestión de equipos y mantenimiento
- Interfaz de usuario responsive y moderna

## Seguridad

- Todas las comunicaciones están protegidas con HTTPS
- Las contraseñas se almacenan hasheadas con bcrypt
- Los tokens JWT tienen tiempos de expiración configurables
- Rutas protegidas con middleware de autenticación

## Mantenimiento

### Respaldo de Base de Datos

```bash
docker exec rcm-mysql mysqldump -u root -p[ROOT_PASSWORD] [DATABASE_NAME] > backup.sql
```

### Logs

Los logs del backend se almacenan en `rcm-backend/logs/`

## Licencia

Este proyecto es propiedad de RCM SA. Todos los derechos reservados.