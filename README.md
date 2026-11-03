# SAE - Sistema de Administración de Empresas

Aplicación web para la gestión de recursos, contactos y mantenimiento de Empresas.

## Stack y puertos

| Servicio      | Versión / imagen                         | Puerto local |
| ------------- | ---------------------------------------- | -----------: |
| Frontend      | Next.js 16.4.3, React 19.3.1, Node.js 24 |         3303 |
| Backend       | NestJS 12.3.2, Prisma 6.19.1, Node.js 24 |         3305 |
| Base de datos | MySQL 8.4                                |         3307 |

El frontend se conecta al backend desde el navegador mediante `NEXT_PUBLIC_API_URL`
y desde el contenedor mediante `API_URL=http://sae-backend:3005/api`. El backend
espera MySQL en la red privada de Compose y aplica las migraciones versionadas con
`prisma migrate deploy` al arrancar.

## Arranque local con Docker

1. Copiá `.env.example` a `.env` y completá las dos contraseñas y los dos secretos
   con valores aleatorios distintos de al menos 32 caracteres. Podés generarlos con
   `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
   No subas `.env` a Git.
2. Desde esta carpeta, ejecutá:

   ```sh
   docker compose config
   docker compose up --build -d
   docker compose ps
   ```

3. Abrí `http://localhost:3303`. La API queda disponible en `http://localhost:3305/api`.

Para levantar solo backend y base de datos:

```sh
docker compose -f docker-compose.backend.yml up --build -d
```

Para agregar el frontend a ese conjunto:

```sh
docker compose -f docker-compose.backend.yml -f docker-compose.frontend.yml up --build -d
```

Para base de datos y servicio de backup:

```sh
docker compose -f docker-compose.mysql-backup.yml up --build -d
```

La base nueva se crea desde las migraciones Prisma del backend. El SQL legado
`sae-data/mysql/archive/legacy-schema-2025.sql` está archivado solo como referencia:
no se importa porque sus tablas no coinciden con el esquema actual de Prisma. Los
volúmenes `mysql-data`, `backend-data` y `backup-data` persisten los datos entre
reinicios. Para detener los servicios sin borrar datos, ejecutá `docker compose down`
(no agregues `-v`).
