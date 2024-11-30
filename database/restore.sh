#!/bin/bash
set -e

# Tunggu PostgreSQL siap
echo "Waiting for PostgreSQL to start..."
for i in {1..30}; do
    if pg_isready -h localhost -U postgres; then
        echo "PostgreSQL is ready!"
        break
    fi
    echo "Waiting for PostgreSQL... $i/30"
    sleep 2
done

# Memastikan database Film ada, jika tidak, buat
echo "Ensuring database exists..."
psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname = 'Film'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE \"Film\""

# Restore database dari backup
echo "Starting restore..."
psql -U postgres -d Film -f /backup/film_backup.sql

echo "Restore process completed"

# Verifikasi
echo "Verifying database..."
psql -U postgres -d Film -c "\dt"
