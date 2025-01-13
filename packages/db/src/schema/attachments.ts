import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { chats } from './chat';

export const attachments = pgTable('attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  filePath: text('file_path').notNull().unique(),
  mimeType: text('mime_type').notNull(),
  checksum: text('checksum').notNull(),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertAttachmentSchema = createInsertSchema(attachments, {
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
  filePath: z.string().min(1),
  mimeType: z.string().min(1),
  checksum: z.string().min(1),
  metadata: z.string().optional(),
});

export const selectAttachmentSchema = createSelectSchema(attachments);

export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
