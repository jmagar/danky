-- Add new columns to conversations
ALTER TABLE conversations
ADD COLUMN model_id TEXT NOT NULL DEFAULT 'gpt-4',
ADD COLUMN description TEXT,
ADD COLUMN deleted_at TIMESTAMP;

-- Add new columns to messages
ALTER TABLE messages
ADD COLUMN content_type TEXT NOT NULL DEFAULT 'text',
ADD COLUMN language TEXT,
ADD COLUMN tokens INTEGER,
ADD COLUMN parent_id UUID REFERENCES messages(id),
ADD COLUMN deleted_at TIMESTAMP;

-- Add new columns to attachments
ALTER TABLE attachments
ADD COLUMN mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
ADD COLUMN checksum TEXT,
ADD COLUMN metadata JSONB,
ADD COLUMN deleted_at TIMESTAMP;

-- Add indexes to conversations
CREATE INDEX conversations_user_id_idx ON conversations(user_id);
CREATE INDEX conversations_title_idx ON conversations(title);
CREATE INDEX conversations_status_idx ON conversations(is_archived, deleted_at);
CREATE INDEX conversations_model_id_idx ON conversations(model_id);
CREATE INDEX conversations_user_active_idx ON conversations(user_id, is_archived, deleted_at);

-- Add indexes to messages
CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX messages_deleted_at_idx ON messages(deleted_at);
CREATE INDEX messages_role_idx ON messages(role);
CREATE INDEX messages_content_type_idx ON messages(content_type);
CREATE INDEX messages_timeline_idx ON messages(conversation_id, created_at);
CREATE INDEX messages_thread_idx ON messages(parent_id);

-- Add indexes to attachments
CREATE INDEX attachments_message_id_idx ON attachments(message_id);
CREATE INDEX attachments_file_type_idx ON attachments(file_type);
CREATE INDEX attachments_deleted_at_idx ON attachments(deleted_at);
CREATE UNIQUE INDEX attachments_file_path_key ON attachments(file_path);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_attachments_updated_at
  BEFORE UPDATE ON attachments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); 