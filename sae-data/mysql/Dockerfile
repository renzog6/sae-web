#Create MySQL Image
FROM mysql:8.0

CMD ["--default-authentication-plugin=mysql_native_password"]

ENV MYSQL_ROOT_PASSWORD: Resconi.843
ENV MYSQL_DATABASE: sae-web
ENV MYSQL_USER: saeg6
ENV MYSQL_PASSWORD: Resconi.843

ADD ./mysql-data /var/lib/mysql
ADD ./init docker-entrypoint-initdb.d

EXPOSE 3306