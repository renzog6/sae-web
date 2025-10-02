#!/bin/bash

# pathfile: sae-data/backup/backup.sh

# Descripción: Script para realizar backup de la base de datos MySQL y enviar notificaciones por correo electrónico
# Requiere: mysqldump, gzip, find, du, curl, date, mkdir, tee, hostname, file, mktemp
# Autor: Gorosito Renzo + AI
# Fecha: 2024-06-27
# Versión: 1.0 

# Usar variables de entorno proporcionadas por docker-compose.yml
DB_HOST=${DB_HOST}
DB_USER=${DB_USER}
DB_PASS=${MYSQL_ROOT_PASSWORD}
DB_NAME=${DB_NAME}
BACKUP_RETENTION_DAYS=${BACKUP_RETENTION_DAYS}

# Backup directory
BACKUP_DIR="/var/backups"

# Crear directorio de backup si no existe
mkdir -p "$BACKUP_DIR"

# Date format for the backup file
DATE=$(date +%Y%m%d%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql.gz"

# Log file
LOG_FILE="$BACKUP_DIR/backup_log.txt"

# Función para registrar mensajes
log_message() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

log_message "Iniciando backup de la base de datos $DB_NAME en $DB_HOST"

# MySQL dump command con manejo de errores y desactivando SSL para evitar errores con certificados autofirmados
MYSQL_DUMP="mysqldump --single-transaction --ssl-mode=DISABLED -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_FILE"

# Execute the backup command
if eval $MYSQL_DUMP; then
    log_message "Backup completado exitosamente: $BACKUP_FILE"
else
    log_message "ERROR: Falló el backup de la base de datos"
    exit 1
fi

# Verificar si el archivo de backup existe
if [ -f "$BACKUP_FILE" ]; then
    log_message "Verificando tamaño del backup"
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    # Eliminar backups antiguos
    log_message "Eliminando backups con más de $BACKUP_RETENTION_DAYS días"
    find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +"$BACKUP_RETENTION_DAYS" -delete
    
    # Contar archivos de backup restantes
    BACKUP_COUNT=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" | wc -l)
    
    # Configuración de correo electrónico desde variables de entorno
    MAIL_SENDER=${MAIL_SENDER}
    MAIL_RECEIVER=${MAIL_RECEIVER}
    MAIL_PASSWORD=${MAIL_PASSWORD}
    # Usar el servidor SMTP configurado en las variables de entorno
    MAIL_SERVER=${MAIL_SERVER}
    
    # Asunto y cuerpo del correo con más información
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    HOSTNAME=$(hostname)
    SUBJECT="Backup SAE-Web - $TIMESTAMP"
    BODY="Backup de la base de datos SAE-Web\n\nFecha: $TIMESTAMP\nServidor: $HOSTNAME\nBase de datos: $DB_NAME\nTamaño: $BACKUP_SIZE\nArchivo: $BACKUP_FILE\nTotal backups: $BACKUP_COUNT"
    
    log_message "Enviando notificación por correo a $MAIL_RECEIVER"
    
    # Determinar el tipo MIME del archivo
    MIME_TYPE=$(file --mime-type "$BACKUP_FILE" | sed 's/.*: //')
    
    # Crear un archivo temporal para el correo con formato MIME
    TEMP_MAIL=$(mktemp)
    
    # Crear el correo con formato MIME adecuado
    {
        echo "From: $MAIL_SENDER"
        echo "To: $MAIL_RECEIVER"
        echo "Subject: $SUBJECT"
        echo "MIME-Version: 1.0"
        echo "Content-Type: text/plain"
        echo ""
        echo -e "$BODY"
    } > "$TEMP_MAIL"
    
    # Enviar correo sin adjunto (más simple y confiable)
    if curl --silent --show-error --url "$MAIL_SERVER" \
        --mail-from "$MAIL_SENDER" \
        --mail-rcpt "$MAIL_RECEIVER" \
        --user "$MAIL_SENDER:$MAIL_PASSWORD" \
        --upload-file "$TEMP_MAIL" \
        --insecure \
        --ssl; then
        log_message "Correo enviado exitosamente"
    else
        log_message "ERROR: No se pudo enviar el correo de notificación"
        log_message "Continuando con el proceso de backup a pesar del error de correo"
    fi
    
    # Eliminar archivo temporal
    rm -f "$TEMP_MAIL"
    
    log_message "Proceso de backup completado exitosamente"
else
    log_message "ERROR: No se pudo crear el archivo de backup"
    exit 1
fi
