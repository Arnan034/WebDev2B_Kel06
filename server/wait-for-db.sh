#!/bin/bash

set -e

echo "Waiting for postgres..."

# Tambahkan ping untuk debug
echo "Trying to ping database host..."
ping -c 1 database || echo "Ping failed but continuing..."

# Tunggu lebih lama dengan timeout 30 detik
RETRIES=30
until [ $RETRIES -eq 0 ] || PGPASSWORD=$DB_PASSWORD psql -h "database" -U "$DB_USER" -d "$DB_DATABASE" -c '\q'; do
  echo "Postgres is unavailable - sleeping (retries left: $RETRIES)"
  RETRIES=$((RETRIES-1))
  sleep 2
done

if [ $RETRIES -eq 0 ]; then
  echo "Failed to connect to Postgres after 30 attempts"
  exit 1
fi

echo "Postgres is up - executing command"
exec "$@" 