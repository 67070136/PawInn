-- One PostgreSQL instance, three service-owned databases.
-- Docker runs this on the FIRST start with an empty data directory.
-- Schema/seed files are TODO starter files until each teammate implements them.
\set ON_ERROR_STOP on

SELECT 'CREATE DATABASE pawinn_account'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pawinn_account')
\gexec

SELECT 'CREATE DATABASE pawinn_room'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pawinn_room')
\gexec

SELECT 'CREATE DATABASE pawinn_booking'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pawinn_booking')
\gexec

\connect pawinn_account
\ir account/schema.sql
\ir account/seed.sql

\connect pawinn_room
\ir room/schema.sql
\ir room/seed.sql

\connect pawinn_booking
\ir booking/schema.sql
\ir booking/seed.sql
