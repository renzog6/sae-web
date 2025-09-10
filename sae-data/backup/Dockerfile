FROM alpine:latest

RUN apk update && \
    apk upgrade && \
    apk add --no-cache mysql-client bash file curl

# Add backup script
ADD backup.sh /backup.sh
RUN chmod +x /backup.sh
COPY ./backup.sh /etc/periodic/daily

CMD ["bash", "-c", "\
    /etc/init.d/cron start && \
    echo '0 0 * * * /backup.sh' > /etc/cron.d/backup-cron && \
    cron && \
    tail -f /var/log/cron.log"]