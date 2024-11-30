-- Set client encoding
SET client_encoding = 'UTF8';

-- Restore menggunakan pg_restore untuk custom format
\! pg_restore -U postgres -d Film /backup/datafilm.sql
