import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./auth";
import { sql } from "drizzle-orm";

// Valid message roles
export const MESSAGE_ROLES = ['user', 'assistant', 'system', 'tool', 'function'] as const;

// Valid message content types
export const CONTENT_TYPES = ['text', 'code', 'image', 'file'] as const;

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().$defaultFn(() => createId()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  modelId: text("model_id").notNull(), // Moved from metadata to proper column
  description: text("description"),
  isArchived: boolean("is_archived").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Index for user's conversations lookup
  userIdIdx: index("conversations_user_id_idx").on(table.userId),
  // Index for searching by title
  titleIdx: index("conversations_title_idx").on(table.title),
  // Index for soft deletes and archiving
  statusIdx: index("conversations_status_idx").on(table.isArchived, table.deletedAt),
  // Index for model-based queries
  modelIdx: index("conversations_model_id_idx").on(table.modelId),
  // Compound index for user's active conversations
  userActiveIdx: index("conversations_user_active_idx").on(table.userId, table.isArchived, table.deletedAt),
}));

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().$defaultFn(() => createId()),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull().$type<typeof MESSAGE_ROLES[number]>(),
  content: text("content").notNull(),
  contentType: text("content_type").notNull().$type<typeof CONTENT_TYPES[number]>().default('text'),
  language: text("language"), // For code blocks
  tokens: integer("tokens"), // Track token usage
  metadata: jsonb("metadata"),
  parentId: uuid("parent_id").references(() => messages.id), // For threaded conversations
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Index for conversation lookup
  conversationIdx: index("messages_conversation_id_idx").on(table.conversationId),
  // Index for soft deletes
  deletedAtIdx: index("messages_deleted_at_idx").on(table.deletedAt),
  // Index for role-based queries
  roleIdx: index("messages_role_idx").on(table.role),
  // Index for content type queries
  contentTypeIdx: index("messages_content_type_idx").on(table.contentType),
  // Compound index for conversation timeline
  timelineIdx: index("messages_timeline_idx").on(table.conversationId, table.createdAt),
  // Index for threaded messages
  threadIdx: index("messages_thread_idx").on(table.parentId),
}));

export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().$defaultFn(() => createId()),
  messageId: uuid("message_id")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  filePath: text("file_path").notNull(),
  mimeType: text("mime_type").notNull(),
  checksum: text("checksum").notNull(), // For file integrity
  metadata: jsonb("metadata"),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Index for message lookup
  messageIdx: index("attachments_message_id_idx").on(table.messageId),
  // Index for file type queries
  fileTypeIdx: index("attachments_file_type_idx").on(table.fileType),
  // Index for soft deletes
  deletedAtIdx: index("attachments_deleted_at_idx").on(table.deletedAt),
  // Unique constraint for file path
  filePathKey: uniqueIndex("attachments_file_path_key").on(table.filePath),
}));

// Trigger to automatically update updatedAt
export const updateUpdatedAtTrigger = sql`
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`; 