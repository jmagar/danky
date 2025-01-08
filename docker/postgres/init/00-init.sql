-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- For UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- For encryption functions
CREATE EXTENSION IF NOT EXISTS "citext";         -- For case-insensitive text
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- For text search trigrams
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- For GIN index support
CREATE EXTENSION IF NOT EXISTS "vector";         -- For vector operations

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;                -- Authentication related tables
CREATE SCHEMA IF NOT EXISTS chat;                -- Chat related tables
CREATE SCHEMA IF NOT EXISTS vector;              -- Vector storage related tables
CREATE SCHEMA IF NOT EXISTS cache;               -- Cache related tables

-- Set up audit timestamps function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql'; 