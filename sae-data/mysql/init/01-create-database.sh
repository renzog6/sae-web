#!/bin/bash

echo "Creando base de datos ${MYSQL_DATABASE}..."
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${MYSQL_DATABASE}.* TO '${MYSQL_USER}'@'%';"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "FLUSH PRIVILEGES;"
echo "Base de datos ${MYSQL_DATABASE} creada correctamente."