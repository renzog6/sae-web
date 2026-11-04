#!/bin/bash

echo "Verificando la importación de datos..."

# Reemplazar variables en el archivo SQL
SED_CMD="s/\${MYSQL_DATABASE}/${MYSQL_DATABASE}/g"
cat /docker-entrypoint-initdb.d/02-sae_web.sql | sed "$SED_CMD" > /tmp/sae_web_processed.sql

# Contar tablas en la base de datos
TABLE_COUNT=$(mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "SELECT COUNT(table_name) FROM information_schema.tables WHERE table_schema = '${MYSQL_DATABASE}';" --skip-column-names)

echo "Número de tablas en la base de datos ${MYSQL_DATABASE}: ${TABLE_COUNT}"

if [ "$TABLE_COUNT" -gt 0 ]; then
  echo "La importación de datos parece haberse realizado correctamente."
else
  echo "ADVERTENCIA: No se encontraron tablas en la base de datos. La importación puede haber fallado."
  echo "Intentando importar manualmente..."
  mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE} < /tmp/sae_web_processed.sql
  echo "Importación manual completada."
fi