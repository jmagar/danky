import { sql } from 'drizzle-orm';

// Enable pgvector extension
export const enablePgvector = sql`
  CREATE EXTENSION IF NOT EXISTS vector;
`;

// Create vector schema
export const createVectorSchema = sql`
  CREATE SCHEMA IF NOT EXISTS vector;
`;

// Drop old vectors table if it exists
export const dropOldVectors = sql`
  DROP TABLE IF EXISTS public.vectors;
`;

// Create new embeddings table in vector schema
export const createEmbeddings = sql`
  CREATE TABLE IF NOT EXISTS vector.embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    content_type TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
`;

// Create indexes
export const createIndexes = sql`
  CREATE INDEX IF NOT EXISTS idx_embeddings_content
    ON vector.embeddings(content_id, content_type);

  CREATE INDEX IF NOT EXISTS idx_embeddings_vector
    ON vector.embeddings
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
`;

// Create updated_at trigger
export const createTrigger = sql`
  CREATE TRIGGER update_embeddings_updated_at
    BEFORE UPDATE ON vector.embeddings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
`;
