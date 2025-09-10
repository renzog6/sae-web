#!/bin/bash

# Usar variables de entorno o valores por defecto
DB_HOST=${DB_HOST:-"sae-mysql"}
DB_USER=${DB_USER:-"root"}
DB_PASS=${MYSQL_ROOT_PASSWORD:-"Resconi.843"}
DB_NAME=${DB_NAME:-"sae-web"}
BACKUP_RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}

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

# MySQL dump command con manejo de errores
MYSQL_DUMP="mysqldump --single-transaction -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_FILE"

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
    MAIL_SENDER=${MAIL_SENDER:-"admin@rcmsa.ar"}
    MAIL_RECEIVER=${MAIL_RECEIVER:-"admin@rcmsa.ar"}
    MAIL_PASSWORD=${MAIL_PASSWORD:-"gTCs/E96eL"}
    MAIL_SERVER=${MAIL_SERVER:-"smtps://c1440662.ferozo.com:465"}
    
    # Asunto y cuerpo del correo con más información
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    HOSTNAME=$(hostname)
    SUBJECT="Backup SAE-Web - $TIMESTAMP"
    BODY="Backup de la base de datos SAE-Web\n\nFecha: $TIMESTAMP\nServidor: $HOSTNAME\nBase de datos: $DB_NAME\nTamaño: $BACKUP_SIZE\nArchivo: $BACKUP_FILE\nTotal backups: $BACKUP_COUNT"
    
    log_message "Enviando notificación por correo a $MAIL_RECEIVER"
    
    # Determinar el tipo MIME del archivo
    MIME_TYPE=$(file --mime-type "$BACKUP_FILE" | sed 's/.*: //')
    
    # Enviar correo con el archivo adjunto
    if curl -s --url "$MAIL_SERVER" --ssl-reqd \
        --mail-from "$MAIL_SENDER" \
        --mail-rcpt "$MAIL_RECEIVER" --user "$MAIL_SENDER:$MAIL_PASSWORD" \
        -H "Subject: $SUBJECT" -H "From: $MAIL_SENDER" -H "To: $MAIL_RECEIVER" -F \
        '=(;type=multipart/mixed' -F "=$BODY;type=text/plain" -F \
        "file=@$BACKUP_FILE;type=$MIME_TYPE;encoder=base64" -F '=)'; then
        log_message "Correo enviado exitosamente"
    else
        log_message "ERROR: No se pudo enviar el correo de notificación"
    fi
    
    log_message "Proceso de backup completado exitosamente"
else
    log_message "ERROR: No se pudo crear el archivo de backup"
    exit 1
fi
