#!/bin/bash

# Database credentials
DB_HOST="mysql"
DB_USER="root"
DB_PASS="Resconi.843"
DB_NAME="sae-web"

# Backup directory
BACKUP_DIR="/var/backups"

# Date format for the backup file
DATE=$(date +%Y%m%d%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql.gz"

# MySQL dump command
MYSQL_DUMP="mysqldump --single-transaction -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_FILE"

# Execute the backup command
eval $MYSQL_DUMP

# Check if backup file exists
if [ -f "$BACKUP_FILE" ]; then
    echo "Database backup created successfully: $BACKUP_FILE"

    # Mails configs
    sender="admin@rcmsa.ar"
    receiver="admin@rcmsa.ar"
    pass="gTCs/E96eL"
    sub="Backup" # using cat command for multiline input
    body="Backup de App"

    file=$BACKUP_FILE # set file as the 1st positional parameter
    # MIME type for multiple type of input file extensions

    MIMEType=$(file --mime-type "$file" | sed 's/.*: //')
    curl -s --url 'smtps://c1440662.ferozo.com:465' --ssl-reqd \
        --mail-from $sender \
        --mail-rcpt $receiver --user $sender:$pass \
        -H "Subject: $sub" -H "From: $sender" -H "To: $receiver" -F \
        '=(;type=multipart/mixed' -F "=$body;type=text/plain" -F \
        "file=@$file;type=$MIMEType;encoder=base64" -F '=)'
else
    echo "Error creating database backup."
fi
