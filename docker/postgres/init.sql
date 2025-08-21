-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create database user if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'phoenix') THEN
        CREATE ROLE phoenix LOGIN PASSWORD 'password';
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE phoenix_cn_directory TO phoenix;
GRANT ALL ON SCHEMA public TO phoenix;