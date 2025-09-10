#!/bin/bash

echo "Preparando archivos SQL para importación..."

# Asegurar que la base de datos existe
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "FLUSH PRIVILEGES;"

# Procesar el archivo SQL para reemplazar variables
echo "Procesando archivo SQL..."
SED_CMD="s/\${MYSQL_DATABASE}/${MYSQL_DATABASE}/g"
cat /docker-entrypoint-initdb.d/02-sae_web.sql | sed "$SED_CMD" > /tmp/sae_web_processed.sql

# Modificar el archivo original para que use directamente la base de datos
echo "USE ${MYSQL_DATABASE};" > /docker-entrypoint-initdb.d/02-sae_web.sql.tmp
cat /tmp/sae_web_processed.sql >> /docker-entrypoint-initdb.d/02-sae_web.sql.tmp
mv /docker-entrypoint-initdb.d/02-sae_web.sql.tmp /docker-entrypoint-initdb.d/02-sae_web.sql

echo "Archivos SQL preparados correctamente."