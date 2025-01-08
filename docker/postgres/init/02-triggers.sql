-- Auth Schema Triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON auth.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Chat Schema Triggers
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON chat.conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON chat.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_attachments_updated_at
    BEFORE UPDATE ON chat.attachments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Vector Schema Triggers
CREATE TRIGGER update_embeddings_updated_at
    BEFORE UPDATE ON vector.embeddings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Cache Schema Triggers
CREATE TRIGGER update_key_value_updated_at
    BEFORE UPDATE ON cache.key_value
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at(); 