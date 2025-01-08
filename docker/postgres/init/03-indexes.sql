-- Auth Schema Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON auth.users(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON auth.sessions(expires_at);

-- Chat Schema Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON chat.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON chat.conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_is_archived ON chat.conversations(is_archived) WHERE is_archived = false;

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON chat.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON chat.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_role ON chat.messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_content_gin ON chat.messages USING gin(to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_attachments_message_id ON chat.attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_attachments_file_type ON chat.attachments(file_type);

-- Vector Schema Indexes
CREATE INDEX IF NOT EXISTS idx_embeddings_content ON vector.embeddings(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_embeddings_vector ON vector.embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Cache Schema Indexes
CREATE INDEX IF NOT EXISTS idx_key_value_expires_at ON cache.key_value(expires_at)
WHERE expires_at IS NOT NULL; 