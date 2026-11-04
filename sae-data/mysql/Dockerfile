# Dockerfile para MySQL
# MySQL Image optimizado
FROM mysql:8.0.40

# Instalar tzdata para que MySQL pueda cargar los timezones
RUN microdnf install -y tzdata && microdnf clean all

# Configuración de autenticación y SSL con sintaxis moderna
CMD ["--authentication-policy=mysql_native_password", "--host-cache-size=0"]

# Usar ARG en lugar de ENV para evitar exponer credenciales en la imagen
ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_USER
ARG MYSQL_PASSWORD

# Configurar variables de entorno
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
ENV MYSQL_DATABASE=${MYSQL_DATABASE}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}

# Copiar archivos de inicialización
COPY ./init /docker-entrypoint-initdb.d

# Asegurar que los scripts tengan permisos de ejecución
RUN chmod +x /docker-entrypoint-initdb.d/*.sh

# Exponer puerto MySQL
EXPOSE 3306

# Configuración de salud
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} || exit 1