FROM alpine:latest

# Establecer etiquetas para mejorar la mantenibilidad
LABEL maintainer="admin@rcmsa.ar"
LABEL description="Servicio de backup para la base de datos MySQL de SAE-Web"

# Instalar dependencias en una sola capa para reducir el tamaño de la imagen
RUN apk update && \
    apk upgrade && \
    apk add --no-cache mysql-client bash file curl tzdata ca-certificates mailx && \
    cp /usr/share/zoneinfo/America/Argentina/Buenos_Aires /etc/localtime && \
    echo "America/Argentina/Buenos_Aires" > /etc/timezone && \
    update-ca-certificates && \
    apk del tzdata

# Crear directorio para backups
RUN mkdir -p /var/backups && chmod 777 /var/backups

# Variables de entorno para configuración
ENV DB_HOST="sae-mysql" \
    DB_USER="root" \
    DB_NAME="sae_web" \
    BACKUP_SCHEDULE="0 0 * * *" \
    BACKUP_RETENTION_DAYS=7

# Agregar script de backup y configurar permisos
COPY backup.sh /backup.sh
RUN chmod +x /backup.sh && \
    mkdir -p /etc/periodic/daily && \
    ln -s /backup.sh /etc/periodic/daily/backup

# Configurar cron y ejecutar
CMD ["sh", "-c", "crond -f -d 8 & echo \"${BACKUP_SCHEDULE} /backup.sh\" > /etc/crontabs/root && crond -f"]