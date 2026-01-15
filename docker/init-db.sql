-- Database initialization script for Aardvark Platform
-- This script runs when the PostgreSQL container is first created

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing verification
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable pg_trgm for fuzzy text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant all privileges on the database to the application user
GRANT ALL PRIVILEGES ON DATABASE aardvark TO aardvark;

-- Create schemas for better organization
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS social;
CREATE SCHEMA IF NOT EXISTS moderation;
CREATE SCHEMA IF NOT EXISTS monetization;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Grant usage on schemas
GRANT USAGE ON SCHEMA core TO aardvark;
GRANT USAGE ON SCHEMA social TO aardvark;
GRANT USAGE ON SCHEMA moderation TO aardvark;
GRANT USAGE ON SCHEMA monetization TO aardvark;
GRANT USAGE ON SCHEMA analytics TO aardvark;

-- Grant all privileges on all tables in schemas
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA core TO aardvark;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA social TO aardvark;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA moderation TO aardvark;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA monetization TO aardvark;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA analytics TO aardvark;

-- Grant all privileges on all sequences in schemas
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA core TO aardvark;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA social TO aardvark;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA moderation TO aardvark;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA monetization TO aardvark;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA analytics TO aardvark;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL PRIVILEGES ON TABLES TO aardvark;
ALTER DEFAULT PRIVILEGES IN SCHEMA social GRANT ALL PRIVILEGES ON TABLES TO aardvark;
ALTER DEFAULT PRIVILEGES IN SCHEMA moderation GRANT ALL PRIVILEGES ON TABLES TO aardvark;
ALTER DEFAULT PRIVILEGES IN SCHEMA monetization GRANT ALL PRIVILEGES ON TABLES TO aardvark;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT ALL PRIVILEGES ON TABLES TO aardvark;

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'Aardvark database initialized successfully';
END $$;
