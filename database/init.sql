-- One application database, created by the PostgreSQL image from POSTGRES_DB.
-- This script runs connected to that database on a fresh data directory.
-- Service folders organize SQL ownership; all tables use the public schema.
-- Creates all seven application tables and loads the college-demo fixtures.
\set ON_ERROR_STOP on

-- Create parent tables before tables that reference them with foreign keys.
\ir account/schema.sql
\ir room/schema.sql
\ir booking/schema.sql

-- Seed referenced users/pets/rooms before their bookings.
\ir seed.psql
